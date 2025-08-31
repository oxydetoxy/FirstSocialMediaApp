const express = require("express");
const router = express.Router();
const {
  createPost,
  likeDislike,
  deletePost,
  getPostOfFollowing,
  addcomments,
  deleteComment,
} = require("../controller/post");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/createPost", isAuthenticated, createPost);
router.post("/posts/:id", isAuthenticated, likeDislike);
router.delete("/posts/:id", isAuthenticated, deletePost);
router.get("/posts", isAuthenticated, getPostOfFollowing);
router.put("/posts/comments/:id", isAuthenticated, addcomments)
router.delete("/posts/comments/:id",isAuthenticated, deleteComment);

module.exports = router;
