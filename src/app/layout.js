import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Smart Transform AI",
  description: "Smart Transform AI - Text, Image, and Video Processing Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
        {/* Add Font Awesome CDN link */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta name="robots" content="noindex"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Navbar/> */}
        {children}
      </body>
    </html>
  );
}
