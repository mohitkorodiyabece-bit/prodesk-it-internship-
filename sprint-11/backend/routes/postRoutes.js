const express = require("express");

const {
  getPosts,
  getPostById,
  createPost,
  deletePost,
} = require("../controllers/postController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// GET all posts
router.get("/", getPosts);

// CREATE a post with an optional thumbnail
router.post(
  "/",
  upload.single("thumbnail"),
  createPost
);

// GET one post
router.get("/:id", getPostById);

// DELETE one post
router.delete("/:id", deletePost);

module.exports = router;