import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
const baseURL = import.meta.env.VITE_BACKEND_URL;

const LoginPage = ({ setCurrentUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${baseURL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                // Normalize user to have _id field
                const user = data.user;
                const normalizedUser = { ...user, _id: user.id };

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(normalizedUser));
                setCurrentUser(normalizedUser);

                toast.success("Login successful! 🚀");
                setTimeout(() => navigate('/user'), 1000);
            } else {
                toast.error(data.message || "Login failed. Try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white font-ibm overflow-hidden">
            <div className="max-w-screen">
                <div className="flex items-center justify-center px-4 sm:px-6 lg:px-12">
                    <div className="max-w-sm p-8 rounded-xl shadow-lg bg-white">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                            Login Script Sync
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                        <p className="mt-4 text-sm text-gray-600 text-center">
                            Don&apos;t have an account?{' '}
                            <Link to="/signup" className="text-blue-600 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
