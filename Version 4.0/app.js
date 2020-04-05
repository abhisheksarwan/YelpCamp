var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Comment = require("./models/comment"); //make sure this is placed before campgrounds
var Campground = require("./models/campgrounds"); //Campground.create and others dependent
var seedDB = require("./seeds");

seedDB(); //run returned function
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp1", {useNewUrlParser:true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));

//root route
app.get("/", function(req, res){
    res.render("home");
});

//camps get route
app.get("/camps", function(req, res){
    Campground.find({}, function(err, allCamps){
        if(err) { console.log("Wrong");} 
        else { 
        console.log("Alright");
        res.render("campgrounds/camps", {camps:allCamps}); }
    });
});

//camps new
app.get("/new", function(req, res){
    res.render("campgrounds/new");
});

//camps post route
app.post("/camps", function(req, res){
    let newCamp = {
        name:req.body.campName,
        url: req.body.imgURL,
        description: req.body.description
};
Campground.create(newCamp, function(err, newlyCreated){
    if(err) { console.log("Wrong");} else { console.log("Alright");}
});
    res.redirect("campgrounds/camps");
});

//shows page by id
app.get("/camps/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) { console.log(err);}
        else {
            console.log(foundCampground)
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});



//comment new form
app.get("/camps/:id/comment/new", function(req, res){
    var id = req.params.id;
    Campground.findById(id, function(err, camp){
        if(err) { console.log("Error!");}
        else{
            res.render("comments/new",{camp: camp});
        }
    })
});

//comment post route
app.post("/camps/:id/comment", function(req, res){
    var id = req.params.id;
    Comment.create(req.body.comment, function(err, comment){
        if(err) { console.log("Error!");}
        else{
            Campground.findById(id, function(err, foundCamp){
                if(err) { console.log("Error!");}
                else{
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect("/camps/" + id);
                }
            })
        }
    });
});




app.listen(3000, function(){
    console.log("Server started.");
});