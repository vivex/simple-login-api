// Edit Profile route: /user/edit
const express = require("express");
const multer = require("multer");
const path = require("path");
const Joi = require("joi");
const router = express.Router();
// Schema
const User = require("../models/user");

// Set Storage Engine
const storage = multer.diskStorage({
  destination: "./views/assests/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("image");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  // Check mime
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error : Images Only for Profile Picture!");
  }
}

router.get("/:username", (req, res) => {
  var username = req.params.username;
  User.findOne({ email: username }, (err, data) => {
    if (err) throw err;
    res.render("edit", { user: data });
  });
});

router.post("/:username", (req, res) => {
  console.log("Hi ", req.file);
  if (req.body.name) {
    User.findOneAndUpdate(
      { email: req.params.username },
      { $set: { name: req.body.name } },
      { new: true },
      (err, data) => {
        if (err) throw err;
        res.render("edit", { user: data });
      }
    );
  }
  upload(req, res, err => {
    if (err) {
      return res.render("register", { msg: err });
    } else {
      console.log("Hi ", req.file);
      User.findOneAndUpdate(
        { email: req.params.username },
        { $set: { profileImage: req.file.filename } },
        { new: true },
        (err, data) => {
          if (err) throw err;
          res.render("edit", { user: data });
        }
      );
    }
  });
});

module.exports = router;
