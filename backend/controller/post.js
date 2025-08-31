const Post = require("../models/post");
const User = require("../models/user");

const createPost = async (req, res) => {
  try {
    const newPostData = await Post.create({
      caption: req.body.caption,
      image: {
        public_id: req.body.public_id,
        url: req.body.url,
      },
      owner: req.user._id,
    });
    const newPost = await Post.create(newPostData);

    const user = await User.findById(req.user._id);
    await user.populate("posts");
    user.posts.push(newPost._id);
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
const likeDislike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.likes.includes(req.user._id)) {
      // If already liked -> remove like (dislike)
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Disliked",
      });
    } else {
      // If not liked -> add like
      post.likes.push(req.user._id);
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No Post to delete",
      });
    }

    // Check if the logged-in user is the owner of the post
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    const user = await User.findById(req.user._id);

    // Remove post reference from user's posts array
    const index = user.posts.indexOf(post._id);

    user.posts.splice(index, 1);

    await user.save();
    await post.deleteOne(); // safer than remove()

    res.status(200).json({
      success: true,
      message: "Post Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "following",
      "posts"
    );
    res.status(200).json({
      success: true,
      followers: user.following,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const addcomments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(401).json({
        succcess: false,
        message: "No post exist",
      });
    }
    let commentExist = -1;
    post.comments.forEach((items, index) => {
      if (items.user.toString == req.user._id.toString) {
        commentExist = index;
      }
    });
    if (commentExist !== -1) {
      post.comments[commentExist].comment = req.body.comment;
      await post.save();
      res.status(200).json({
        succcess: true,
        messgae: "comment updated",
      });
    } else {
      post.push({
        user: req.user._id,
        comment: req.body.comment,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: message.error,
    });
  }
};
const deleteComment = async (req, res) => {
  const commentIndex = -1;
  try {
    const post = await Post.findById(req.params.id);

    if (post.owner.toString == req.user._id.params) {
      post.comments.forEach((item, index) => {
        if (item._id.toString === req.body.commentId.toString) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      return res.status(200).json({
        success: true,
        message: "comemnt removed",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString === req.user.id.toString) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      res.status(200).json({
        succcess: true,
        message: "comemnt deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: message.error,
    });
  }
};

module.exports = {
  createPost,
  likeDislike,
  deletePost,
  getPostOfFollowing,
  addcomments,
  deleteComment
};
