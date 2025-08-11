import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BACKEND_URL;

// Animated Button component
const AnimatedButton = ({ children, onClick, variant = "primary", className = "" }) => {
    const baseClasses =
        "inline-flex items-center justify-center px-5 py-2 rounded-md font-semibold transition transform focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary:
            "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 active:scale-95 shadow-md hover:shadow-lg",
        secondary:
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400 active:scale-95 shadow-sm hover:shadow-md",
        danger:
            "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 focus:ring-red-300 active:scale-95",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            type="button"
        >
            {children}
        </button>
    );
};

export default function UserPage({ currentUser, setCurrentUser }) {
    const navigate = useNavigate();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const storedUser =
        typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

    const [userName, setUserName] = useState(currentUser?.name || storedUser?.name || "User");
    const [userId, setUserId] = useState(
        currentUser?._id ||
        currentUser?.id ||
        storedUser?._id ||
        storedUser?.id ||
        null
    );
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            toast.info("Please login first");
            navigate("/login");
            return;
        }

        if (!userId) {
            toast.error("User info not available, please login again.");
            navigate("/login");
            return;
        }

        const fetchUserPosts = async () => {
            setLoading(true);
            setError(null);

            try {
                const url = `${baseURL}/api/posts/user/${userId}?page=1&limit=10`;

                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user posts");
                }

                const data = await res.json();

                setUserPosts(data.posts || []);

                if (data.posts?.length > 0) {
                    setUserName(data.posts[0].author || userName);
                }
            } catch (err) {
                console.error("Error fetching user posts:", err);
                setError(err.message || "Error fetching posts");
                toast.error(err.message || "Error fetching posts");
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [token, userId, navigate]);

    function formatDate(dateStr) {
        try {
            return new Date(dateStr).toLocaleDateString();
        } catch {
            return "-";
        }
    }

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        if (setCurrentUser) setCurrentUser(null);
        navigate("/");
    };

    if (!token || !userId) {
        return null;
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full shadow-md">
                            <FaUserCircle className="text-6xl text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                Welcome back, <span className="text-indigo-700">{userName}</span>
                            </h1>
                            <p className="mt-1 text-gray-500 text-sm">
                                Here's a snapshot of your writing and drafts.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <AnimatedButton variant="primary" onClick={() => navigate("/write")}>
                            + Write a New Post
                        </AnimatedButton>
                        <AnimatedButton variant="secondary" onClick={() => navigate("/read-blogs")}>
                            View All Blogs
                        </AnimatedButton>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Profile Panel */}
                    <aside className="col-span-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 mb-5">Your Profile</h3>
                        <div className="text-xs text-gray-500 mb-6">Signed in as</div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center shadow-inner">
                                <span className="uppercase text-indigo-700 font-extrabold text-xl">
                                    {(userName || "U").charAt(0)}
                                </span>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 text-lg">{userName}</div>
                                <div className="text-xs text-gray-400 tracking-wide">Member</div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-sm text-gray-600 mb-1 font-medium">Posts</div>
                            <div className="text-3xl font-extrabold text-gray-900">{userPosts.length}</div>
                        </div>
                        <div className="mt-10">
                            <AnimatedButton variant="danger" onClick={handleLogout} className="w-full">
                                Logout
                            </AnimatedButton>
                        </div>
                    </aside>

                    {/* Posts Grid */}
                    <main className="col-span-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Your Posts</h2>
                                <div className="text-sm text-gray-500">Sorted by newest</div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="animate-pulse p-4 bg-gray-100 rounded-lg shadow-inner"
                                            aria-hidden="true"
                                        >
                                            <div className="h-40 bg-gray-200 rounded mb-4" />
                                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                                            <div className="h-8 bg-gray-200 rounded mt-4 w-1/3" />
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <p className="text-red-600 mb-3">{error}</p>
                                    <AnimatedButton variant="primary" onClick={() => window.location.reload()}>
                                        Try Again
                                    </AnimatedButton>
                                </div>
                            ) : userPosts.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-gray-600 mb-5">
                                        You haven't written any posts yet. Start by clicking <strong>Write a New Post</strong>.
                                    </p>
                                    <AnimatedButton variant="primary" onClick={() => navigate("/write")}>
                                        + Write Your First Post
                                    </AnimatedButton>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {userPosts.map((post) => (
                                        <article
                                            key={post._id}
                                            onClick={() => navigate(`/post/${post._id}`)}
                                            className="cursor-pointer flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm
                       hover:shadow-lg hover:-translate-y-1 transition-shadow transition-transform overflow-hidden"
                                            aria-label={`Read post titled ${post.title}`}
                                        >
                                            {post.coverImage ? (
                                                <img
                                                    src={`${baseURL}${post.coverImage}`}
                                                    alt={post.title}
                                                    className="h-44 w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                        e.target.nextSibling.style.display = "flex";
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-44 w-full bg-gradient-to-br from-indigo-50 to-sky-50 flex items-center justify-center text-gray-400">
                                                    <span className="text-sm">No image</span>
                                                </div>
                                            )}
                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title || "Untitled Post"}</h3>
                                                <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                                                    {post.summary || (post.content ? post.content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 120) + "..." : "No summary")}
                                                </p>
                                                <div className="flex justify-between items-center text-gray-500 text-xs mb-3">
                                                    <time>{formatDate(post.createdAt)}</time>
                                                    <div className="flex items-center gap-1">
                                                        <FaRegHeart aria-label="Likes" />
                                                        <span>{post.likes?.length || post.likeCount || 0}</span>
                                                    </div>
                                                </div>

                                                {/* Read Full Blog button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent card click
                                                        navigate(`/read-blogs/${post._id}`);
                                                    }}
                                                    className="self-start px-3 py-1.5 text-indigo-600 text-sm font-medium rounded-md border border-indigo-600
                           hover:bg-indigo-600 hover:text-white transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                    aria-label={`Read full blog titled ${post.title}`}
                                                >
                                                    Read Full Blog →
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
