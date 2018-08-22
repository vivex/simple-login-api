// Profile route: /user/profile

const express = require("express");
const router = express.Router();

// Schema
const User = require("../models/user");

// USER PROFILE
router.get("/", (req, res, next) => {
  var username = req._username;
  User.findOne({ email: username }, (err, data) => {
    if (err) throw err;
      if (req.accepts('json')) {
        res.json(data);
      } else {
          res.render("profile", { user: data });
      }
  });
});

module.exports = router;
