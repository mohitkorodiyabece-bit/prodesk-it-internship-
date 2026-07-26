const mongoose = require("mongoose");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid post ID");
  }

  const post = await Post.findById(id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

const createPost = asyncHandler(async (req, res) => {
  const {
    title = "",
    content = "",
    author = "",
  } = req.body || {};

  if (!title.trim() || !content.trim() || !author.trim()) {
    res.status(400);
    throw new Error("Title, content and author are required");
  }

  let uploadedImage = null;

  try {
    if (req.file) {
      uploadedImage = await uploadToCloudinary(req.file.buffer);
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      thumbnail: uploadedImage?.secure_url || "",
      thumbnailPublicId: uploadedImage?.public_id || "",
    });

    console.log(`[Telemetry] Post created: ${post._id}`);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    // Remove the Cloudinary image if MongoDB creation fails.
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error(
          `[Cloudinary cleanup failed]: ${cleanupError.message}`
        );
      }
    }

    throw error;
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid post ID");
  }

  const post = await Post.findById(id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.thumbnailPublicId) {
    await cloudinary.uploader.destroy(post.thumbnailPublicId);
  }

  await post.deleteOne();

  console.log(`[Telemetry] Post deleted: ${id}`);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: {
      id,
    },
  });
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  deletePost,
};