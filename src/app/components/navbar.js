"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import "../components/css/responsive.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const token = Cookies.get("access_token");
  const role = Cookies.get("user_role");
  const fullName = Cookies.get("full_name");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const confirmLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user_id");
    Cookies.remove("user_role");
    Cookies.remove("full_name");
    setShowLogoutModal(false);
    setIsOpen(false);
    toast.success("Logout successful");

    setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-foreground z-50 shadow-md">
        <div
          className={`max-w-screen-xl mx-auto flex flex-wrap items-center ${props.admin ? "py-4 px-2" : "p-4"}`}
        >
          <ToastContainer position="top-right" />

          {/* Logo and System Name on Left */}
          <div className="flex items-center mr-auto">
            <Link href="/" className="flex items-center">
              {/* <img src="/img/logo.png" className="h-10 sm:h-10" alt="Logo" /> */}
              <Image
                src="/img/logo.png"
                alt="logo"
                width={100} // adjust based on your design
                height={32}
                className="h-8 w-auto"
              />

              <p className="pl-2 font-semibold text-white md:text-3xl text-2xl custom-logo-size">
                SmartTransform
              </p>
            </Link>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            type="button"
            className={`inline-flex items-center p-2 w-10 h-10 justify-center text-white rounded-lg md:hidden hover:bg-foreground focus:outline-none focus:ring-2 focus:ring-gray-500 ${props.admin ? "hidden" : ""
              }`}
            aria-controls="navbar"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Menu Links */}
          <div
            className={`${isOpen ? "block" : "hidden"} w-full md:w-auto md:block`}
            id="navbar"
          >
            <ul
              className={`flex flex-col mt-4 md:flex-row md:mt-0 md:space-x-5 ${props.admin ? "hidden" : ""}`}
            >
              {[
                { href: "/aboutpage", label: "About Us" },
                { href: "/textvideo", label: "SmartVidz" },
                { href: "/textspeak", label: "SmartSpeak" },
                { href: "/voicetext", label: "SmartVoice" },
                { href: "/imgtext", label: "SmartScan" },
                { href: "/texttoimg", label: "SmartArt" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 custom-navLink-size ${pathname === item.href
                      ? "text-indigo-400 border-b-2 border-indigo-400"
                      : "text-white hover:text-gray-300 hover:underline"
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {token && role === "user" ? (
                <li key="welcome" className="flex items-center space-x-2">
                  <span className="text-white">Welcome, {fullName}</span>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="bg-white text-foreground font-semibold px-4 py-1 rounded hover:bg-gray-200 focus:outline-none"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li key="/auth/login">
                  <Link href="/auth/login" className="inline-block">
                    <button
                      className="bg-white text-foreground font-semibold px-4 py-1 rounded hover:bg-gray-200 focus:outline-none"
                    >
                      Login
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmLogout}
                className="bg-foreground text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
