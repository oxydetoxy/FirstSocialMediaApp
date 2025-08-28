const express = require("express");
const router=express.Router();

router.post("/createPost", createPost);

module.exports = router;