const express =require("express");
const routes= express.Router();

routes.post("/signup", signup);

module.exports = routes;