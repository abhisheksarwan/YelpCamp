var express = require("express");
var router = express.Router({mergeParams:true});  // to make :id work 
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

//comment new form
router.get("/new", isLoggedIn, function(req, res){
    var id = req.params.id;
    Campground.findById(id, function(err, camp){
        if(err) { console.log("Error!");}
        else{
            res.render("comments/new",{camp: camp});
        }
    })
});

//comment post route
router.post("/", isLoggedIn, function(req, res){
    var id = req.params.id;
    Comment.create(req.body.comment, function(err, comment){
        if(err) { console.log("Error!");}
        else{
            Campground.findById(id, function(err, foundCamp){
                if(err) { console.log("Error!");}
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect("/camps/" + id);
                }
            })
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