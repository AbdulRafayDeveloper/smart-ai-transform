import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  const isAdminRoute = pathname.startsWith("/admin");

  // If no token
  if (!token) {
    if (isAdminRoute) {
      // Not logged in but trying to access /admin -> redirect to login
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  // Token exists
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role || "user";

    // If already logged in and trying to access login/register page
    if (isAuthPage) {
      const redirectPath = role === "admin" ? "/admin/dashboard" : "/";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // If user role and trying to access /admin
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("JWT verification failed:", error);
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login", "/auth/register"],
};
