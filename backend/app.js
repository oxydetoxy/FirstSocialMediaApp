const express = require("express");
const app = express();
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");


if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
} //for production we will not use dotenv

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", postRoutes);
app.use("/api/v1", userRoutes);


module.exports = app;
