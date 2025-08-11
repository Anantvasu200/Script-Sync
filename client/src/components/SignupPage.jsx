import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Signup successful! 🎉");
                // TODO: Redirect or store token
            } else {
                toast.error(data.message || "Signup failed. Try again.");
            }
        } catch (error) {
            toast.error("Server error. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
            setFormData({ name: "", mobile: "", email: "", password: "" });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white font-ibm overflow-hidden">
            <div className="w-full max-w-sm p-8 rounded-xl shadow-lg bg-white">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Sign Up for Dev Talk
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="mobile"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Mobile Number
                        </label>
                        <input
                            type="tel"  // Correct input type for phone numbers
                            name="mobile"  
                            id="mobile" 
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono"
                            placeholder="e.g., +91XXXXXXXXXX"
                            required
                        />
                    </div>


                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
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
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
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
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                style={{ marginTop: "100px" }}
            />
        </div>
    );
};

export default SignupPage;
