const user = require("../models/user");
const User = require("../models/user");
const { randomBytes } = require("crypto");


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
    console.log("Creating user...");
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
module.exports = { signup, login };
