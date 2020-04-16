var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Comment = require("./models/comment"); //make sure this is placed before campgrounds
var Campground = require("./models/campgrounds"); //Campground.create and others dependent
var seedDB = require("./seeds");
var User = require("./models/user");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//seedDB(); //run returned function
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp1", {useNewUrlParser:true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public")); //just in case of path errors
app.use(methodOverride("_method"));

//Passport Config
app.use(require("express-session")({
    secret: "battyCat",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;      //to make currentUser available to all paths
    next();
});

app.use(indexRoutes);
app.use("/camps/:id/comment", commentRoutes);  //make sure mergeParams:true when working with :id in prefixing
app.use("/camps", campgroundRoutes); //will put /camps before every route in campgrounds.js

app.listen(3000, function(){
    console.log("Server started.");
});