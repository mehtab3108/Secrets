const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const app = express();

const mongoose = require("mongoose");

const encrypt=require('mongoose-encryption');

require('dotenv').config();

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, sencryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home")
});

app.get("/register", function(req, res) {
  res.render("register")
});

app.get("/login", function(req, res) {
  res.render("login")
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  console.log(newUser);
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render('secrets');
    }
  });

});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets");
        }
        else{
          res.send("Wrong password! Try again");
        }
      }
      else{
        res.send("User not found! Register with us!");
      }
    }
  });

});

app.listen(3000, function() {
  console.log("Server running at port 3000");
})
