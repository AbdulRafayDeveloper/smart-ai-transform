"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../components/css/responsive.css"
import { colors } from "@mui/material";
const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  // const [IsAdmin, setIsAdmin] = useState(false)
  // const handelAdmin =()=>{
  //   setIsAdmin(true)
  // }
  console.log(props.admin)
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-foreground z-50 shadow-md">
      <div className={`max-w-screen-xl mx-auto flex flex-wrap items-center justify-between  ${props.admin ? "py-4 px-2" : "p-4"} `}>
        {/* Logo */}
        <Link href="/" className="flex items-center ">
          <img src="/img/logo.png" className=" w-1/4 h-10 sm:h-10 " alt="Logo" />
          <p className="pl-2 font-semibold text-white md:text-3xl text-2xl custom-logo-size">
            SmartTransform
          </p>
        </Link>

        {/* Hamburger Menu */}
        <button
          onClick={toggleMenu}
          type="button"
          className={`inline-flex items-center p-2 w-10 h-10 justify-center text-white rounded-lg md:hidden  hover:bg-foreground focus:outline-none focus:ring-2 focus:ring-gray-500 ${props.admin ? "hidden" : ""} `}
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
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Menu Links */}
        <div
          className={`${isOpen ? "block" : "hidden"
            } w-full md:w-auto md:block `}
          id="navbar"
        >

          <Link href={"/"} className={` text-background text-xl font-semibold ${props.admin ? "block" : "hidden "}`}>Log Out</Link>
          <ul className={`flex flex-col mt-4 md:flex-row md:mt-0 md:space-x-5 ${props.admin ? "hidden" : ""}`}>
            {[
              // { href: "/", label: "Home" },
              { href: "/textvideo", label: "SmartVidz" },
              { href: "/textspeak", label: "SmartSpeak" },
              { href: "/voicetext", label: "SmartVoice" },
              { href: "/imgtext", label: "SmartScan" },
              { href: "/texttoimg", label: "SmartArt" },
              { href: "/aboutpage", label: "About Us" },
              { href: "/loginform", label: "Login / Register" },
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
