//to get sample data
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");

//dummy data
var data =[
    {name:"Himachal", url:"https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg", description:"Heyyyyyyyyyy"},
    {name:"Auli", url:"https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg", description:"Nooooooooo"}
]

function seedDB(){
Campground.remove({}, function(err){
    if(err) { console.log("ERROR!");}
    else { console.log("Removed!");
    data.forEach(function(seed){
        Campground.create(seed, function(err, newCamp){
            if(err) { console.log("Error!");}
            else{
                console.log("Added");
                //comment creation
                Comment.create({
                    text: "Lovely place!",
                    author: "Matt"
                }, function(err, comment){
                    if(err){ console.log("Error!");}
                    else {
                        newCamp.comments.push(comment);
                        newCamp.save();
                    }
                });
            }
        });
    });
}
});
}


module.exports = seedDB;