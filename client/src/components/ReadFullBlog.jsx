import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    FaTwitter,
    FaFacebookF,
    FaLinkedinIn,
    FaWhatsapp,
    FaLink,
    FaMoon,
    FaSun,
} from "react-icons/fa";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const shareUrls = (url, title) => ({
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
    )}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
    )}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url
    )}&title=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        title + " " + url
    )}`,
});

const ReadFullComponent = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const contentRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        async function fetchPost() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${baseURL}/api/posts/${id}`);
                if (!response.ok) throw new Error("Failed to fetch post");
                const data = await response.json();
                setPost(data.post);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;
            const totalHeight = contentRef.current.scrollHeight - window.innerHeight;
            const windowScroll = window.scrollY;
            const progressValue = Math.min((windowScroll / totalHeight) * 100, 100);
            setProgress(progressValue);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [post]);

    const copyLinkToClipboard = () => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => toast.success("Link copied to clipboard!"))
            .catch(() => toast.error("Failed to copy link"));
    };

    if (loading) return <div className="p-8 text-center">Loading post...</div>;
    if (error)
        return (
            <div className="p-8 text-center text-red-500">
                <p>Error: {error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    if (!post) return <div className="p-8 text-center">Post not found</div>;

    const url = window.location.href;
    const shares = shareUrls(url, post.title);

    return (
        <>
            {/* Reading Progress Bar */}
            <div
                className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-150"
                style={{ width: `${progress}%` }}
                aria-hidden="true"
            ></div>

            <section
                ref={contentRef}
                className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
                    } w-full min-h-screen transition-colors duration-300 px-6 sm:px-12 py-8`}
            >
                <div className="flex justify-between items-center mb-6 max-w-[1200px] mx-auto">
                    <Link
                        to="/read-blogs"
                        className={`text-blue-600 hover:underline ${darkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                    >
                        ← Back to Blogs
                    </Link>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="text-sm px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-2"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? <FaSun /> : <FaMoon />}{" "}
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>

                <article className="max-w-[1200px] mx-auto">
                    <h1 className="text-5xl font-extrabold mb-4">{post.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        By <span className="font-semibold">{post.author}</span> |{" "}
                        <time dateTime={post.createdAt}>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </time>
                    </p>

                    {post.coverImage && (
                        <img
                            loading="lazy"
                            src={`${baseURL}${post.coverImage}`}
                            alt={post.title}
                            className="w-full rounded-lg mb-12 shadow-md max-h-[500px] object-cover"
                        />
                    )}

                    <section className="prose prose-lg prose-indigo max-w-full dark:prose-invert">
                        <p className="mb-8">{post.summary}</p>
                        {post.content && (
                            <div
                                dangerouslySetInnerHTML={{ __html: post.content }}
                                className="prose prose-lg prose-indigo dark:prose-invert"
                            />
                        )}
                    </section>

                    {/* Share Section */}
                    <section className="mt-16 max-w-full">
                        <h2 className="text-2xl font-semibold mb-6 max-w-[1200px] mx-auto">
                            Share this post
                        </h2>
                        <div className="flex items-center gap-4 flex-wrap max-w-[1200px] mx-auto">
                            <button
                                onClick={copyLinkToClipboard}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition shadow"
                                aria-label="Copy link to clipboard"
                            >
                                <FaLink size={20} /> Copy Link
                            </button>

                            <a
                                href={shares.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 bg-blue-500 rounded-full text-white hover:bg-blue-600 shadow transition"
                                aria-label="Share on Twitter"
                            >
                                <FaTwitter size={24} />
                            </a>
                            <a
                                href={shares.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 bg-blue-700 rounded-full text-white hover:bg-blue-800 shadow transition"
                                aria-label="Share on Facebook"
                            >
                                <FaFacebookF size={24} />
                            </a>
                            <a
                                href={shares.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 bg-blue-600 rounded-full text-white hover:bg-blue-700 shadow transition"
                                aria-label="Share on LinkedIn"
                            >
                                <FaLinkedinIn size={24} />
                            </a>
                            <a
                                href={shares.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 bg-green-500 rounded-full text-white hover:bg-green-600 shadow transition"
                                aria-label="Share on WhatsApp"
                            >
                                <FaWhatsapp size={24} />
                            </a>
                        </div>
                    </section>
                </article>
            </section>
        </>
    );
};

export default ReadFullComponent;
