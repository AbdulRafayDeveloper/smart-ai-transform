import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaLayerGroup,
  FaTools,
  FaBell,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Link from "next/link";

function Sidebar({ dashboard, speechmaker, users, videorevoice }) {
  const [isOpen, setIsOpen] = useState(true);

  // Effect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1023) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Initial check in case the page is already at the right size on load
    handleResize();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed top-20 left-0 h-[calc(100vh-4rem)] ${
          isOpen ? "w-60" : "w-16"
        } bg-white shadow-md transition-width duration-300 ease-in-out z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div
            className={`flex items-center space-x-4 ${isOpen ? "flex" : "hidden"}`}
          >
            <FaLayerGroup className="text-2xl" />
            <span className="text-xl font-semibold">MyApp</span>
          </div>
          <button
            className={`p-2 text-gray-600 hover:text-gray-800 `}
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaSignOutAlt />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
          <nav>
            <ul>
              <li
                className={`p-4 hover:bg-gray-100 cursor-pointer ${!isOpen ? "hidden" : ""}`}
              >
                <Link href={dashboard} className="flex items-center">
                  <FaHome className="text-lg mr-4" />
                  <span className="text-gray-700">Dashboard</span>
                </Link>
              </li>

              <li
                className={`p-4 hover:bg-gray-100 cursor-pointer ${!isOpen ? "hidden" : ""}`}
              >
                <Link href={users} className="flex items-center">
                  <FaUser className="text-lg mr-4" />
                  <span className="text-gray-700">Users</span>
                </Link>
              </li>

              <li
                className={`p-4 hover:bg-gray-100 cursor-pointer ${!isOpen ? "hidden" : ""}`}
              >
                <Link href={speechmaker} className="flex items-center">
                  <FaUser className="text-lg mr-4" />
                  <span className="text-gray-700">SpeechMaker Users</span>
                </Link>
              </li>

              <li
                className={`p-4 hover:bg-gray-100 cursor-pointer ${!isOpen ? "hidden" : ""}`}
              >
                <Link href={videorevoice} className="flex items-center">
                  <FaUser className="text-lg mr-4" />
                  <span className="text-gray-700">VideoRevoice Users</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            className={`w-full p-2 text-gray-600 hover:text-gray-800 flex items-center justify-center ${!isOpen ? "hidden" : ""}`}
          >
            <FaSignOutAlt className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Button to open the sidebar when it's collapsed */}
      {/* {!isOpen && (
        <button
          className="fixed top-16 mt-2 left-3 p-2 bg-blue-500 text-white rounded-full z-50"
          onClick={() => setIsOpen(true)}
        >
          <FaSignOutAlt />
        </button>
      )} */}
    </>
  );
}

export default Sidebar;
