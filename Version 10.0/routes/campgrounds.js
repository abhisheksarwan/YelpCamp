var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

//camps get route
router.get("/", function(req, res){
    Campground.find({}, function(err, allCamps){
        if(err) { console.log("Wrong");} 
        else { 
        res.render("campgrounds/camps", {camps:allCamps, currentUser: req.user}); } //current user will work on /camps only
    });
});

//camps new
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//camps post route
router.post("/", middleware.isLoggedIn, function(req, res){
    let newCamp = {
        name:req.body.campName,
        url: req.body.imgURL,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
};
Campground.create(newCamp, function(err, newlyCreated){
    if(err) { console.log("Wrong");} else { console.log("Camp Added!"); console.log(newlyCreated); }
});
req.flash("success", "Added a new campground!");
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

//Edit Route
router.get("/:id/edit", middleware.isAuthorisedCamp, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) { console.log("Error");}
        else {
            res.render("campgrounds/edit", {camp: foundCampground});
        }
    });
});

//update route
router.put("/:id", middleware.isAuthorisedCamp, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCampground){
        if(err) { console.log("Error"); res.redirect("/camps");}
        else{
            res.redirect("/camps/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:id", middleware.isAuthorisedCamp, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, camp){
        if(err){
            res.redirect("/camp/" + req.params.id);
        }
        else{
            res.redirect("/camps");
        }
    });
});

//MIDDLEWARE - authorisation
// function isAuthorised(req, res, next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if(err) 
//             { console.log(err); res.redirect("back");
//             }
//             else {
//                 if(foundCampground.author.id.equals(req.user._id))
//                 {
//                     next();
//                 }
//                 else{
//                     res.redirect("back");
//                 }
//             }
//         });
//     }
//     else{
//         res.send("Not Logged In!");
//     }
// }

// //MIDDLEWARE
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;