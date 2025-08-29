const express = require("express");
const router=express.Router();
const { createPost ,likeDislike,deletePost} = require("../controller/post");
const {isAuthenticated} = require("../middlewares/auth");

router.post("/createPost",isAuthenticated, createPost);
router.post("/posts/:id",isAuthenticated,likeDislike);
router.delete("/posts/:id",isAuthenticated,deletePost);

module.exports = router;