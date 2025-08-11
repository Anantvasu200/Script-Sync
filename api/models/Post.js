const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        summary: { type: String, required: true },
        content: { type: String, required: true },
        coverImage: { type: String },
        author: { type: String, required: true },
        authorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
