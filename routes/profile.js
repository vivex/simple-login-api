const express = require("express");
const router = express.Router();

// Schema
const User = require("../models/user");

// USER PROFILE
router.get("/:username", (req, res, next) => {
  var username = req.params.username;
  User.findOne({ email: username }, (err, data) => {
    if (err) throw err;
    res.render("profile", { user: data });
  });
});

module.exports = router;
