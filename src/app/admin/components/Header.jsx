import React, { useState } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import Link from "next/link";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';

function Header() {
    const router = useRouter();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        Swal.fire({
            icon: "success",
            title: "Logout",
            text: "Your account has been logged out.",
            confirmButtonText: "OK",
        }).then(() => {
            Cookies.remove('access_token');
            Cookies.remove('user_id');
            Cookies.remove('user_role');
            Cookies.remove('full_name');
            // router.push("../../auth/login");
            window.location.href = '/auth/login';
        });
    }

    return (
        <header className="bg-foreground shadow-md fixed top-0 w-full flex items-center px-2 py-4 border-b border-gray-200 z-10">
            <div className="flex items-center justify-between w-full">
                {/* Left Side Text */}
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    {/* <img src="/img/logo.png" className="w-1/4 h-10 sm:h-10" alt="Logo" /> */}
                    <Image src="/img/logo.png" alt="Logo" width={50} height={50} />
                    <p className="pl-2 font-semibold text-background md:text-3xl text-2xl custom-logo-size">
                        ContentVerse AI
                    </p>
                </Link>

                {/* Right Side Icons */}
                <div className="flex items-center space-x-4">
                    {/* Notification Icon */}

                    {/* Profile Icon */}
                    <div className="relative">
                        <button
                            className="p-2 text-background hover:text-gray-800"
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        >
                            <FaUserCircle className="text-2xl" />
                        </button>
                        {/* Profile Menu Dropdown */}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
                                <ul>
                                    <li className="p-2 cursor-pointer hover:bg-gray-100" onClick={handleLogout}>Logout</li> {/* Logout in the dropdown */}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
