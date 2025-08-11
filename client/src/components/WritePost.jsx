import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import Image from "@tiptap/extension-image";

const BASE_URL = "http://localhost:5000"; 

const WritePost = ({ currentUser }) => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debug: log currentUser whenever it changes
    useEffect(() => {
        console.log("WritePost currentUser:", currentUser);
    }, [currentUser]);

    const editor = useEditor({
        extensions: [StarterKit, Bold, Italic, BulletList, Image],
        content: "",
    });

    const fetchPosts = async (pageNum = 1) => {
  if (!currentUser?._id) {
    setPosts([]);
    setTotalPages(1);
    setLoading(false);
    return;
  }
  try {
    setLoading(true);
    const res = await fetch(
      `${BASE_URL}/api/posts/user/${currentUser._id}?page=${pageNum}&limit=10`
    );
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    setPosts(data.posts || []);
    setTotalPages(data.totalPages || 1);
  } catch (err) {
    toast.error(err.message || "Error loading posts");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const controller = new AbortController();
  fetchPosts(page, { signal: controller.signal });
  return () => controller.abort();
}, [page, currentUser]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const isEditorEmpty = () => {
        const content = editor
            .getHTML()
            .replace(/<p>|<\/p>|<br>/g, "")
            .trim();
        return !content;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !summary.trim() || isEditorEmpty()) {
            toast.warn("Please fill in all required fields");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("summary", summary.trim());
            formData.append("content", editor.getHTML());
            if (coverImage) formData.append("coverImage", coverImage);

            const res = await fetch(`${BASE_URL}/api/posts`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to create post");
            }

            toast.success("Post created successfully");
            setTitle("");
            setSummary("");
            setCoverImage(null);
            setCoverPreview(null);
            editor.commands.setContent("");
            fetchPosts(page);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            {/* User info */}
            <div className="flex items-center gap-2 mb-6">
                <FaUserCircle size={32} className="text-gray-500" />
                <span className="font-semibold text-lg">
  {currentUser?.name || "Guest"}
</span>
            </div>

            {/* Post form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white shadow-md p-6 rounded-xl"
            >
                <input
                    type="text"
                    placeholder="Post Title *"
                    className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Summary *"
                    rows={3}
                    className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                />

                {/* Cover image upload */}
                <div>
                    <label className="block mb-2 font-medium">Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 
            file:px-4 file:rounded-full file:border-0 
            file:text-sm file:font-semibold 
            file:bg-blue-50 file:text-blue-700 
            hover:file:bg-blue-100"
                    />
                    {coverPreview && (
                        <img
                            src={coverPreview}
                            alt="Cover preview"
                            className="mt-3 rounded-lg shadow-sm max-h-56 object-cover"
                        />
                    )}
                </div>

                {/* TipTap toolbar */}
                <div className="flex gap-2 mb-2">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                        Bold
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                        Italic
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                        Bullet List
                    </button>
                </div>

                <EditorContent
                    editor={editor}
                    className="border p-3 rounded-lg min-h-[200px]"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? "Publishing..." : "Publish Post"}
                </button>
            </form>

            {/* Previous posts */}
            <h2 className="text-xl font-bold mt-10 mb-4">Previous Posts</h2>
            {loading ? (
                <div className="flex gap-4 overflow-x-auto">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="min-w-[320px] h-48 bg-gray-200 animate-pulse rounded"
                        />
                    ))}
                </div>
            ) : (
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="relative flex-shrink-0 w-[320px] border rounded-lg shadow-md overflow-hidden group cursor-pointer"
                        >
                            {post.coverImage && (
                                <div className="relative h-40 w-full overflow-hidden">
                                    <img
                                        src={
                                            post.coverImage.startsWith("http")
                                                ? post.coverImage
                                                : `${BASE_URL}${post.coverImage}`
                                        }
                                        alt="Cover"
                                        loading="lazy"
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <button
                                        onClick={() => {
                                            /* handle your "Read Full Blog Post" action here */
                                            alert(`Open full post: ${post.title}`);
                                        }}
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Click to Read Full Blog Post
                                    </button>
                                </div>
                            )}
                            <div className="p-4 bg-white">
                                <h3
                                    className="font-semibold text-lg mb-2 truncate"
                                    title={post.title}
                                >
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 line-clamp-3" title={post.summary}>
                                    {post.summary}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default WritePost;
