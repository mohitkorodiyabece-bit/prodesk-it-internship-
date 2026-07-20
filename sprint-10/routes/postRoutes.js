const express = require("express");
const {
  createPost,
  getPosts,
  getRecentPosts,
  getPostById,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

// /recent must be declared before /:id, otherwise Express treats
// "recent" as a value for the :id param
router.get("/recent", getRecentPosts);

router.route("/").post(createPost).get(getPosts);

router.route("/:id").get(getPostById).delete(deletePost);

module.exports = router;