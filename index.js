// MAIN FILE

//requiring all required npm modules
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();

//requiring all routes
const register = require("./routes/register");
const login = require("./routes/login");
const edit = require("./routes/edit");
const profile = require("./routes/profile");
const authService = require("./services/auth");
// Setting View Engine as EJS
app.set("view engine", "ejs");

// Static folder
app.use(express.static("./views/assests"));

//Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//TODO: move this middleware to separate  file under middlewares folder
function authMiddleware(req, res, next){
    let token = (req.headers.authorization) || req.cookies.auth_token;
    authService.verifyJWTToken(token).then((data)=> {
        req._username =  data.data.username;
        return next();
    }, ()=> {
        res.redirect('/login');
    });

}

//Defining rutes
app.use("/login", login);
app.use("/register", register); //TODO move login and register to one router only, and name that router auth-router
app.use("/user", authMiddleware,  profile); //private route so authMiddleware
app.use("/user/edit", edit); //todo: move it to user controller only

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
var port = 3001;
app.listen(port, (err, res) => {
  if (err) throw err;
  console.log("Listening at port:", port);
});
