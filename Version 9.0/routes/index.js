var express = require("express");
var router = express.Router();
var passport= require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("home");
});

//Auth Routes
router.get("/register", function(req, res){
    res.render("register");
});

//register logic
router.post("/register", function(req, res){
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err) {console.log(err); res.redirect("/register");}
        else{
            //console.log(user);
            passport.authenticate("local")(req, res, function(){
                res.redirect("/camps");
            });
        }
    });
});

//login form
router.get("/login", function(req, res){
    res.render("login");
});

//login process
router.post("/login", passport.authenticate("local", { //middleware to authenticate
    successRedirect:"/camps",
    failureRedirect: "/login"}),
    function(req, res){
    res.render("login");
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});

module.exports = router;