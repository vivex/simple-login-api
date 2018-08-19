const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const UserServices = require("./services/user-services");
// EJS
app.set("view engine", "ejs");
// Static folder
app.use(express.static("./views/assests"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", UserServices);

//Connecting to Database
mongoose.connect(
  "mongodb://localhost:27017/simple-login-api",
  err => {
    if (err) {
      return console.log("mongo err", err);
    }
    console.log("Connected to Database simple-login-api");
  }
);

//Starting Server
var port = 3000;
app.listen(port, (err, res) => {
  if (err) throw err;
  console.log("Listening at port:", port);
});
