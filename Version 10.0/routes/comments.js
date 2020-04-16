var express = require("express");
var router = express.Router({mergeParams:true});  // to make :id work 
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comment new form
router.get("/new", middleware.isLoggedIn, function(req, res){
    var id = req.params.id;
    Campground.findById(id, function(err, camp){
        if(err) { console.log("Error!");}
        else{
            res.render("comments/new",{camp: camp});
        }
    })
});

//comment post route
router.post("/", middleware.isLoggedIn, function(req, res){
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

router.get("/:comment_id/edit", middleware.isAuthorisedComment, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log("Error!");
            }
            else{
                res.render("comments/edit", {camp: foundCamp, comment: foundComment});
            }
        });
       
    });
});

router.put("/:comment_id", middleware.isAuthorisedComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err)
        {
            res.send("Error!")
        }
        else{
            res.redirect("/camps/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.isAuthorisedComment, function(req, res){
Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
        res.redirect("back");
    }
    else{
        res.redirect("/camps/" + req.params.id);
    }
})
});

// //MIDDLEWARE - authorisation
// function isAuthorised(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err) 
//             { console.log(err); res.redirect("back");
//             }
//             else {
//                 if(foundComment.author.id.equals(req.user._id))
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

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;