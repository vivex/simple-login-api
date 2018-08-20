const express = require("express");
const router = express.Router();
// Schema
const User = require("../models/user");

router.get("/:username", (req, res, next) => {
  var username = req.params.username;
  User.findOne({ email: username }, (err, data) => {
    if (err) throw err;
    res.render("edit", { user: data });
  });
});

module.exports = router;
