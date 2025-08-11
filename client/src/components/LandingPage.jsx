import React from 'react';
import { Link } from 'react-router-dom';
import image from "../assets/Instant information-cuate.svg";
import Footer from './Footer';

const LandingPage = () => {
    return (
        <section className="bg-white font-ibm">
            <div className="max-w-screen">
                <div className="px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 leading-tight">
                            <span className="typing-animation">Welcome to Script Sync</span>
                        </h1>
                        <p className="text-gray-600 mb-6">
                            <span className="typing-animation delay-1">
                                We talk code,chase trends and break down real-world tech no jargon,just pure desi dev energy!
                            </span>
                        </p>
                        <div className="space-x-4">
                            <Link
                                to="/read-blogs"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Read Blogs
                            </Link>
                            {/* <Link
                                to="/login"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Login
                            </Link> */}
                        </div>
                        {/* Hero Image */}
                        <img
                            src={image}
                            alt="Blogging illustration"
                            className="mt-12 w-full max-w-md mx-auto"
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default LandingPage;