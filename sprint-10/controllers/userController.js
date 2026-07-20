const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create a new user
// @route   POST /api/users
const createUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ErrorResponse("Name and email are required", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ErrorResponse("A user with this email already exists", 409);
  }

  const user = await User.create({ name, email: normalizedEmail });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

// @desc    Get all users, newest first
// @route   GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

// @desc    Get a single user along with all of their posts
// @route   GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorResponse("Invalid user ID", 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  const posts = await Post.find({ authorId: id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: {
      user,
      posts,
    },
  });
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
};