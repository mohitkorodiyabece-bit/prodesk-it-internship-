const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title must be at most 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [10, "Content must be at least 10 characters"],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "authorId is required"],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Post", postSchema);