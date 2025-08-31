const { log } = require("console");
const user = require("../models/user");
const User = require("../models/user");
const { randomBytes } = require("crypto");
const Post = require("../models/post");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    let userData = await User.findOne({ email });
    if (userData) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const avatar = randomBytes(32).toString("hex");
    const user = await User.create({
      name,
      email,
      password,
      avatar,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    const token = await user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Login Successful",
        user,
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const followers = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      // ----- UNFOLLOW -----
      const index1 = loggedInUser.following.indexOf(userToFollow._id);
      loggedInUser.following.splice(index1, 1);

      const index2 = userToFollow.followers.indexOf(loggedInUser._id);
      userToFollow.followers.splice(index2, 1);

      await loggedInUser.save();
      await userToFollow.save();

      return res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
      });
    } else {
      // ----- FOLLOW -----
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      return res.status(200).json({
        success: true,
        message: "User followed successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const logOut = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user_id);
    const { oldPassword, newPassword } = req.body;
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Old Password",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { name, email } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = req.user_id;

    // Delete user's posts
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      if (post) await post.deleteOne();
    }

    // Remove this user from all followers' "following" list
    for (let i = 0; i < followers.length; i++) {
      const followerUser = await User.findById(followers[i]);
      if (followerUser) {
        const index = followerUser.following.indexOf(userId);
        if (index > -1) followerUser.following.splice(index, 1);
        await followerUser.save();
      }
    }

    // Remove this user from all followings' "followers" list
    for (let i = 0; i < following.length; i++) {
      const followingUser = await User.findById(following[i]);
      if (followingUser) {
        const index = followingUser.followers.indexOf(userId);
        if (index > -1) followingUser.followers.splice(index, 1);
        await followingUser.save();
      }
    }

    // Delete user
    await user.deleteOne();

    // Clear auth cookie
    res.clearCookie("token", { httpOnly: true });

    return res
      .status(200)
      .json({ message: "Profile and related data deleted successfully." });
  } catch (err) {
    console.error("Delete Profile Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user_id).populate("posts");
    res.status(200).json({
      success: true,
      message: "userinfor",
    });
  } catch (error) {
    res.staus(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user_id).populate("posts");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: mesage.error,
    });
  }
};
const getAllUser = async (req, res) => {
  try {
    const userrs = await User.find({});
    res.status(200).json({
      success: true,
      URLSearchParams,
    });
  } catch (error) {
    res.status.json({
      success: false,
      message: message.error,
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const user = await User.find();
    const resetPasswordToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${req.protocal}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetPasswordToken}`;
    const message = `Reset your password by clickng on ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "reset password",
        message,
      });
      res.status(200).json({
        success: true,
        message: "email sent successfully",
      });
    } catch (error) {
      (user.resetPasswordToken = undefined),
        (user.resetPasswordExpire = undefined),
        await user.save();
      res.status(500).json({
        success: false,
        message: message.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: message.error,
    });
  }
};
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .toString("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },//menas resert password token is greaetr then curren titme(rest link still valid)
  });
  if (!user) {
    return res.status(401).json({
      success: false,
      mesage: "either token expired or wron access",
    });
  }
  user.password =req.body.params;
  user.resetPasswordExpire=undefined;
  user.resetPasswordToken=undefined;
  await user.save();
};

module.exports = {
  signup,
  login,
  followers,
  logOut,
  updatePassword,
  updateProfile,
  deleteProfile,
  myProfile,
  getUserProfile,
  getAllUser,
  forgotPassword,
  resetPassword
};
