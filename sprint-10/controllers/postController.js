const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create a new post
// @route   POST /api/posts
const createPost = asyncHandler(async (req, res) => {
  const { title, content, authorId } = req.body;

  if (!title || !content || !authorId) {
    throw new ErrorResponse("Title, content and authorId are required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    throw new ErrorResponse("Invalid authorId", 400);
  }

  const author = await User.findById(authorId);
  if (!author) {
    throw new ErrorResponse("Author not found", 404);
  }

  const post = await Post.create({ title, content, authorId });
  const populatedPost = await post.populate("authorId", "name email");

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: populatedPost,
  });
});

// @desc    Get all posts, newest first
// @route   GET /api/posts
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("authorId", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Posts retrieved successfully",
    data: posts,
  });
});

// @desc    Get the 3 most recently created posts
// @route   GET /api/posts/recent
const getRecentPosts = asyncHandler(async (req, res) => {
  const posts = await Post.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: 3 },
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        createdAt: 1,
        "author._id": 1,
        "author.name": 1,
        "author.email": 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Recent posts retrieved successfully",
    data: posts,
  });
});

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorResponse("Invalid post ID", 400);
  }

  const post = await Post.findById(id).populate("authorId", "name email");

  if (!post) {
    throw new ErrorResponse("Post not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Post retrieved successfully",
    data: post,
  });
});

// @desc    Delete a post by ID
// @route   DELETE /api/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorResponse("Invalid post ID", 400);
  }

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    throw new ErrorResponse("Post not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: {},
  });
});

module.exports = {
  createPost,
  getPosts,
  getRecentPosts,
  getPostById,
  deletePost,
};