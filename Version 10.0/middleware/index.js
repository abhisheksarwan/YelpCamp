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
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("/camps");
                }
            }
        });
    }
    else{
        req.flash("error", "You don't have permission to do that!");
        res.redirect("/camps");
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
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login to continue.");
    res.redirect("/login");
}

module.exports = middlewareObject;