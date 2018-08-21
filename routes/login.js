// Sign In route: /user/login

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Schema
const User = require("../models/user");

// Login Page
router.get("", (req, res) => {
  console.log("Hello world");
  res.render("login");
});

// Login Post Request
router.post("/", (req, res) => {
  User.findOne({ email: req.body.username }, (err, data) => {
    if (err) {
      throw err;
    } else if (!data) {
      res.render("login", { msg: "User not found" });
    } else if (bcrypt.compareSync(req.body.password, data.password)) {
      let token = jwt.sign({ username: data.email }, "$@qw1P", {
        expiresIn: "3h"
      });
      res.redirect("/user/" + data.email);
    } else {
      console.log("Hello");
      res.render("login", { msg: "incorrect password" });
    }
  });
});

module.exports = router;
