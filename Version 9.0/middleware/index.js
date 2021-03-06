var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObject ={};

middlewareObject.isAuthorisedCamp = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err) 
            { console.log(err); res.redirect("back");
            }
            else {
                if(foundCampground.author.id.equals(req.user._id))
                {
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.send("Not Logged In!");
    }
}

middlewareObject.isAuthorisedComment = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) 
            { console.log(err); res.redirect("back");
            }
            else {
                if(foundComment.author.id.equals(req.user._id))
                {
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.send("Not Logged In!");
    }
}

middlewareObject.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObject;