// Sign In route: /user/login

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authService = require("../services/auth");
// Schema
const User = require("../models/user");
console.log('above login');
// Login Page
router.get("/", (req, res) => {
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
      let token = authService.createJWToken({sessionData: {username: data.email}});
      res.cookie('auth_token',token, { maxAge: 900000000});
        if (req.accepts('html')) {
            res.redirect("/user");
            return;
        } else if (req.accepts('json')) {
            res.send({ auth_token: token });
            return;
        }

    } else {
      console.log("Hello");
      res.render("login", { msg: "incorrect password" });
    }
  });
});

module.exports = router;
