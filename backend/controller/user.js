const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let userData = await User.findOne({ email });
    if (userData) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const avatar = randomBytes(32).toString("hex");
    user = await User.create({
      name,
      email,
      password,
      avatar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
