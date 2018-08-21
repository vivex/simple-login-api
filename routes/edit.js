// Edit Profile route: /user/edit

const express = require("express");
const router = express.Router();
// Schema
const User = require("../models/user");

router.get("/:username", (req, res) => {
  var username = req.params.username;
  User.findOne({ email: username }, (err, data) => {
    if (err) throw err;
    res.render("edit", { user: data });
  });
});

router.post("/:username", (req, res) => {
  var username = req.params.username;
  var newName = req.body.name;
  User.findOneAndUpdate(
    { email: username },
    { $set: { name: newName } },
    { new: true },
    (err, data) => {
      if (err) throw err;
      res.render("edit", { user: data });
    }
  );
});

module.exports = router;
