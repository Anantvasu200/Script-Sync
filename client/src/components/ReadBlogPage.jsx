import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFacebook,
    FaTwitter,
    FaWhatsapp,
    FaSnapchatGhost,
    FaHeart,
} from "react-icons/fa";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const ReadBlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 6;

    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(
                    `${baseURL}/api/posts?page=${currentPage}`
                );
                const data = await res.json();

                // data.posts is the array, reverse only once
                const orderedPosts = data.posts.reverse();

                setPosts(orderedPosts);
                setFilteredPosts(orderedPosts);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load posts");
            }
        };

        fetchPosts();
    }, [currentPage]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = posts.filter(
            (post) =>
                post.title.toLowerCase().includes(term) ||
                (post.author?.name || post.author).toLowerCase().includes(term) || // handle author as string or object
                new Date(post.createdAt).toLocaleString().toLowerCase().includes(term)
        );

        setFilteredPosts(filtered);
        setCurrentPage(1);
    };

    const handleLike = async (postId) => {
        if (!isLoggedIn) {
            toast.warning("Please login first to like the post!");
            return;
        }

        try {
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: "POST",
                headers: { Authorization: `Bearer ${isLoggedIn}` },
            });

            if (res.ok) {
                const updated = await res.json();
                setFilteredPosts((prev) =>
                    prev.map((p) => (p._id === postId ? updated : p))
                );
                setPosts((prev) => prev.map((p) => (p._id === postId ? updated : p)));
            } else {
                toast.error("Oops! Something went wrong while liking the post.");
            }
        } catch (error) {
            toast.error("Failed to like the post. Please try again.");
        }
    };


    const handleShare = (platform, postId) => {
        const url = `${window.location.origin}/post/${postId}`;
        let shareUrl = "";

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    url
                )}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    url
                )}`;
                break;
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
                break;
            case "snapchat":
                toast.info(
                    "Snapchat doesn't support direct sharing. Please copy the link manually."
                );
                return;
            default:
                return;
        }

        window.open(shareUrl, "_blank", "noopener,noreferrer");
    };

    // Pagination slicing on filtered posts
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    return (
        <div className="bg-white min-h-screen py-10 px-4 md:px-8">
            <h1 className="text-3xl font-bold text-center mb-6">All Blogs</h1>

            {/* Title + Write Post button */}
            <div className="flex justify-between items-center max-w-7xl mx-auto mb-6 px-4">
                {isLoggedIn && (
                    <button
                        onClick={() => navigate("/write")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition"
                    >
                        + Write Post
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Search by author, title, date..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {paginatedPosts.length === 0 ? (
                    <p className="text-center text-gray-600 col-span-full">
                        No posts found.
                    </p>
                ) : (
                    paginatedPosts.map((post) => (
                        <div
                            key={post._id}
                            className="border rounded-lg shadow hover:shadow-lg transition bg-white"
                        >
                            <img
                                src={
                                    post.coverImage
                                        ? `${baseURL}${post.coverImage}`
                                        : "https://via.placeholder.com/400x250"
                                }
                                alt={post.title}
                                className="w-full h-[200px] object-cover rounded-t-lg"
                            />

                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                <p className="text-sm text-gray-600 mb-1">
                                    By {post.author?.name || post.author || "Unknown"} •{" "}
                                    {new Date(post.createdAt).toLocaleString()}
                                </p>
                                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                    {post.summary || post.content?.slice(0, 100) + "..."}
                                </p>

                                {/* Read More */}
                                <button
                                    onClick={() => navigate(`/read-blogs/${post._id}`)} // match route path
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Read Full Blog →
                                </button>

                                {/* Like + Share */}
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center gap-1 text-red-500 hover:scale-110 transition ${!isLoggedIn ? "cursor-not-allowed opacity-50" : ""}`}
                                        disabled={!isLoggedIn}
                                    >
                                        <FaHeart />
                                        <span>{post.likes?.length || 0}</span>
                                    </button>


                                    <div className="flex gap-3 text-xl">
                                        <button
                                            onClick={() => handleShare("facebook", post._id)}
                                            title="Facebook"
                                        >
                                            <FaFacebook className="text-blue-600 hover:scale-110" />
                                        </button>
                                        <button
                                            onClick={() => handleShare("twitter", post._id)}
                                            title="X"
                                        >
                                            <FaTwitter className="text-blue-500 hover:scale-110" />
                                        </button>
                                        <button
                                            onClick={() => handleShare("whatsapp", post._id)}
                                            title="WhatsApp"
                                        >
                                            <FaWhatsapp className="text-green-500 hover:scale-110" />
                                        </button>
                                        <button
                                            onClick={() => handleShare("snapchat", post._id)}
                                            title="Snapchat"
                                        >
                                            <FaSnapchatGhost className="text-yellow-500 hover:scale-110" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx + 1}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-4 py-2 rounded border ${currentPage === idx + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600"
                            } hover:bg-blue-500 hover:text-white transition`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ReadBlogPage;
