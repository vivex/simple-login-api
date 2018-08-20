const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// Register Page
router.get("", (req, res) => {
  res.render("register");
});

router.post("", (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.render("register", { msg: err });
    } else {
      if (
        !req.body.confirm_password ||
        req.body.confirm_password != req.body.password
      ) {
        res.render("register", {
          msg: "password and confirm password doesn't match"
        });
      }
      var data = {};
      data.name = req.body.name;
      data.email = req.body.email;
      data.password = bcrypt.hashSync(req.body.password, 10);
      data.profileImage = req.file.filename;
      console.log("Hi data", data);

      var myData = new User(data);
      myData.save((err, data) => {
        if (err) {
          throw err;
        }
      });
      res.redirect("/user/login");
    }
  });
});

module.exports = router;
