var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Comment = require("./models/comment"); //make sure this is placed before campgrounds
var Campground = require("./models/campgrounds"); //Campground.create and others dependent
var seedDB = require("./seeds");
var User = require("./models/user");

seedDB(); //run returned function
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp1", {useNewUrlParser:true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public")); //just in case of path errors

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

//root route
app.get("/", function(req, res){
    res.render("home");
});

//camps get route
app.get("/camps", function(req, res){
    Campground.find({}, function(err, allCamps){
        if(err) { console.log("Wrong");} 
        else { 
        res.render("campgrounds/camps", {camps:allCamps, currentUser: req.user}); } //current user will work on /camps only
    });
});

//camps new
app.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//camps post route
app.post("/camps", isLoggedIn, function(req, res){
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
app.get("/camps/:id/comment/new", isLoggedIn, function(req, res){
    var id = req.params.id;
    Campground.findById(id, function(err, camp){
        if(err) { console.log("Error!");}
        else{
            res.render("comments/new",{camp: camp});
        }
    })
});

//comment post route
app.post("/camps/:id/comment", isLoggedIn, function(req, res){
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

//Auth Routes
app.get("/register", function(req, res){
    res.render("register");
});

//register logic
app.post("/register", function(req, res){
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err) {console.log(err); res.redirect("/register");}
        else{
            //console.log(user);
            passport.authenticate("local")(req, res, function(){
                res.redirect("/camps");
            });
        }
    });
});

//login form
app.get("/login", function(req, res){
    res.render("login");
});

//login process
app.post("/login", passport.authenticate("local", { //middleware to authenticate
    successRedirect:"/camps",
    failureRedirect: "/login"}),
    function(req, res){
    res.render("login");
});

//logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

}



app.listen(3000, function(){
    console.log("Server started.");
});