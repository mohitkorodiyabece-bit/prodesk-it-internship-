const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").post(createUser).get(getUsers);

router.route("/:id").get(getUserById);

module.exports = router;