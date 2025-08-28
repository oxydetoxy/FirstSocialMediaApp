const Post = require("../models/post");

exports.createPost = async (req, res) => {
  try {
    const newPostData = await Post.create({
      caption: req.body.caption,
      image: {
        public_id: req.body.public_id,
        url: req.body.url,
      },
      owner: req.user._id,
    });
    const newPost = await Post.create(newPost);
    res.status(201).json({
      success: true,
      newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
