const express = require("express");
const router = express.Router();
const Post = require("../models/Post.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

// JWT Secret (Move this to .env in production)
const JWT_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidmFzdSIsImlhdCI6MTc1NDY3NDE1NywiZXhwIjoxNzU0Njc3NzU3fQ.PuD0nh9wO_1oqAuHZD1Ezp292DeIAyaVJxv8Nxvzv0w";

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG/PNG images allowed"), false);
    }
};
const upload = multer({ storage, fileFilter });

/**
 * @route POST /api/posts
 * @desc Create a new post
 */
router.post("/", authenticateToken, upload.single("coverImage"), async (req, res) => {
    const { title, summary, content } = req.body;

    if (!title || !summary || !content) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newPost = new Post({
            title,
            summary,
            content,
            coverImage: req.file ? `/uploads/${req.file.filename}` : null,
            author: req.user.name || req.user.user,
            authorId: req.user.id || null
        });

        const savedPost = await newPost.save();
        res.status(201).json({ message: "Post created", post: savedPost });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route GET /api/posts?page=1
 * @desc Fetch paginated posts
 */
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("title summary coverImage author createdAt");

        res.json({
            posts,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        let userId = req.params.userId;
        userId = userId.trim();

        console.log('Received userId:', JSON.stringify(userId));
        console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(userId));

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const objectUserId = new mongoose.Types.ObjectId(userId);
        console.log('Converted userId to ObjectId:', objectUserId);

        const posts = await Post.find({ authorId: objectUserId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments({ authorId: objectUserId });




        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Server error while fetching user posts' });
    }
});

// GET /api/posts/:id - Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Validate Mongo ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log(post);

        res.json({ post }); // Return the full post object
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
