import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent successfully! 🚀");
        e.target.reset();
    };
    
    return (
        <footer className="bg-gray-900 text-gray-300 font-ibm">
            <div className="max-w-screen">
                <div className="px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold text-white">Script Sync 💬</h2>
                        <p className="mt-2 text-sm max-w-xs">
                            Where tech meets clarity — we break down global trends, real-world use cases, and share dev wisdom with a hint of desi perspective.
                        </p>
                    </div>
                    {/* Spacer for layout */}
                    <div className="hidden lg:block"></div>
                    {/* Contact Form */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Connect with us</h3>
                        <form className="space-y-3" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                rows="3"
                                placeholder="Your Message"
                                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition duration-200"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
                        <div className="flex space-x-4 text-lg mb-3 sm:mb-0">
                            <a href="https://github.com/Anantvasu200" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <FaGithub />
                            </a>
                            <a href="https://x.com/AvAwasthi" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <FaTwitter />
                            </a>
                            <a href="https://www.linkedin.com/in/anant-kumar-awasthi-422840201/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                <FaLinkedin />
                            </a>
                        </div>
                        <p>© {new Date().getFullYear()} Script Sync. Made with ❤️ in India.</p>
                    </div>
                </div>
            </div>
            {/* Toast */}
            <ToastContainer position="top-right" 
            autoClose={3000}
            style = {{marginTop: "100px"}} />
        </footer>
    );
};

export default Footer;