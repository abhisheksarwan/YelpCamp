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
        if(err) {
            req.flash("error", err.message);
            console.log(err); res.redirect("/register");}
        else{
            //console.log(user);
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome Aboard " + user.username);
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
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { req.flash("error", "Something is not good here."); res.redirect("/login"); }
      if (!user) {  req.flash("error", "User not found or incorrect entries."); res.redirect('/login'); }
      req.logIn(user, function(err) {
        if (err) { req.flash("error", err); res.redirect('/login');  }
        req.flash("success", "Welcome " + user.username);
        res.redirect("/camps");
      });
    })(req, res, next);
  });

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You've been logged out.");
    res.redirect("/login");
});

module.exports = router;