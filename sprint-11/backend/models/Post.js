const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      minlength: [3, "Title must contain at least 3 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      minlength: [5, "Content must contain at least 5 characters"],
      maxlength: [2000, "Content cannot exceed 2000 characters"],
    },

    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [80, "Author name cannot exceed 80 characters"],
    },

    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },

    thumbnailPublicId: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);