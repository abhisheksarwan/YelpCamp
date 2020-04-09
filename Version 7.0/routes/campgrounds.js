var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");

//camps get route
router.get("/", function(req, res){
    Campground.find({}, function(err, allCamps){
        if(err) { console.log("Wrong");} 
        else { 
        res.render("campgrounds/camps", {camps:allCamps, currentUser: req.user}); } //current user will work on /camps only
    });
});

//camps new
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//camps post route
router.post("/", isLoggedIn, function(req, res){
    let newCamp = {
        name:req.body.campName,
        url: req.body.imgURL,
        description: req.body.description
};
Campground.create(newCamp, function(err, newlyCreated){
    if(err) { console.log("Wrong");} else { console.log("Camp Added!"); }
});
res.redirect("/camps");
});

//shows page by id
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) { console.log(err);}
        else {
            console.log(foundCampground)
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;