const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const user = require("../models/user");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login first to access this resource",
      });
    }
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
    isAuthenticated
};
// Compare this snippet from backend/app.js:
// const express =
