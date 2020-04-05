var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser:true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));

//schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    url: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// /* Campground.create({
//     name:"Auli",
//     url:"https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg",
//     description:"This is a beatiful view of the hills. You will love it!"
// }, function(err, campground){
//     if(err){console.log("Wrong");} else { console.log(campground);}
// }) */


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
        res.render("camps", {camps:allCamps}); }
    });
});

//camps new
app.get("/new", function(req, res){
    res.render("new");
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
    res.redirect("camps");
});

//shows page by id
app.get("/camps/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) { console.log(err);}
        else {
            res.render("show", {campground:foundCampground});
        }
    })
    
})

app.listen(3000, function(){
    console.log("Server started.");
});