import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";


const Navbar = ({ currentUser, setCurrentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setCurrentUser(null);
        setIsOpen(false); // close mobile menu on logout
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-20">
            <div className="max-w-screen mx-auto">
                <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-12">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-blue-600" aria-label="Dev Talk Home">
                        <Logo/>
                    </Link>

                    {/* Hamburger Button for Mobile */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-700 focus:outline-none"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label="Toggle navigation menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                        >
                            Home
                        </Link>

                        {!currentUser ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                                >
                                    Signup
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded bg-transparent border-none cursor-pointer"
                                aria-label="Logout"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div
                        id="mobile-menu"
                        className="md:hidden mt-2 space-y-2 px-4 sm:px-6 lg:px-12 pb-4"
                    >
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="block text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                        >
                            Home
                        </Link>

                        {!currentUser ? (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                                >
                                    Signup
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded bg-transparent border-none cursor-pointer"
                                aria-label="Logout"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
