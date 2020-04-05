var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

var camps = [
    {name:"Auli", img:"http://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5259404.jpg"},
    {name:"Leh", img:"https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg"},
    {name:"Auli", img:"http://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5259404.jpg"},
    {name:"Auli", img:"http://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5259404.jpg"},
    {name:"Auli", img:"http://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5259404.jpg"}
]
//root route
app.get("/", function(req, res){
    res.render("home");
});

//camps get route
app.get("/camps", function(req, res){
    res.render("camps", {camps:camps})
});

//camps new
app.get("/new", function(req, res){
    res.render("new");
});

//camps post route
app.post("/camps", function(req, res){
    let newCamp = {
        name:req.body.campName,
        img: req.body.imgURL
}
camps.push(newCamp);
    res.redirect("camps");
});

app.listen(3000, function(){
    console.log("Server started.");
});