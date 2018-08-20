const express = require("express");
const multer = require("multer");
const router = express.Router();

// Schema
const User = require("../models/user");
var decodedToken = "";
function verifyToken(req, res, next) {
  let token = req.query.token;
  console.log("Here is token = ", req.headers);
  jwt.verify(token, "$@qw1P", (err, tokendata) => {
    if (err) throw err;
    if (tokendata) {
      decodedToken = tokendata;
      console.log("decodeToken = ", decodedToken);
      next();
    }
  });
}
