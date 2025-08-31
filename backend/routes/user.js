const express = require("express");
const routes = express.Router();
const { isAuthenticated } = require("../middlewares/auth");

const {
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
} = require("../controller/user");

routes.post("/signup", signup);
routes.post("/login", login);
routes.get("/logout", logOut);
routes.get("/follow/:id", isAuthenticated, followers);
routes.put("/updatepass", isAuthenticated, updatePassword);
routes.put("/updatepass", isAuthenticated, updateProfile);
routes.delete("/deleteProfile", isAuthenticated, deleteProfile);
routes.get("/me", isAuthenticated, myProfile);
routes.get("/user/:id",isAuthenticated, getUserProfile);
routes.get("/users",isAuthenticated, getAllUser);
routes.get("/forgot/password",isAuthenticated, forgotPassword);
routes.put("/password/reset/:token",isAuthenticated,resetPassword);

module.exports = routes;
