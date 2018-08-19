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
router.get("/user/register", (req, res) => {
  res.render("register");
});

router.post("/user/register", (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.render("register", { msg: err });
    } else {
      var data = {};
      data.name = req.body.name;
      data.email = req.body.email;
      data.password = bcrypt.hashSync(req.body.password, 10);
      data.profileImage = req.file.filename;
      console.log("Hi data", data);

      // Object.assign(data, fileName);
      var myData = new User(data);
      myData.save((err, data) => {
        if (err) {
          throw err;
          // return res.redirect("/user/login", { msg: err });
        }
      });
      res.redirect("/user/login");
    }
  });
});

// Login Page
router.get("/user/login", (req, res) => {
  res.render("login");
});

// Login Post Request
router.post("/user/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, data) => {
    if (err) throw err;
    if (bcrypt.compareSync(req.body.password, data.password)) {
      let token = jwt.sign({ username: data.email }, "$@qw1P", {
        expiresIn: "3h"
      });
      res.redirect({ token: token }, "/user/" + data.email);
    } else {
      res.render("login", { msg: "incorrect password" });
    }
  });
});

// USER PROFILE
router.get("/user/:username", verifyToken, (req, res, next) => {
  var username = req.params.username;
  User.findOne({ email: username }, (err, data) => {
    if (err) throw err;
    res.render("profile", { user: data });
  });
});

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

module.exports = router;
