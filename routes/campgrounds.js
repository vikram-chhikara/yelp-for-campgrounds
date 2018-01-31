var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middlewareObejct = require("../middleware")

//Edit Campground
router.get("/:id/edit",middlewareObejct.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(error,campground){
        if(error){
            req.flash("error","Campground not found");
            res.redirect("/campgrounds");
        }
        else{
            res.render("campgrounds/edit",{campground:campground}); 
        }
    });
   
});

//Update Campground
router.put("/:id", middlewareObejct.checkCampgroundOwnership, function(req,res){
   //findbyid +update campground 
   
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(error,updatedCampground){
       if(error){
           req.flash("error","Campground not found");
           res.redirect("/campgrounds");
       }
       else{ //render campgrounds show page
           res.redirect("/campgrounds/"+req.params.id);
       }
   });
   
});

router.delete('/:id', middlewareObejct.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           req.flash("error","Campground not found");
           console.log(err);
       }else{
            req.flash("success","Campground deleted!");
            res.redirect('/campgrounds'); 
       }
   });
});  
    

//show all the campgrounds; index page
router.get("/", function(req,res){
    console.log(req.user)
    Campground.find({},function(error,campgrounds){
        if(error){
           console.log("Error"); 
        }
        else{
            res.render("campgrounds/index",{campgrounds:campgrounds});
        }
    });
});

router.post("/", middlewareObejct.isLoggedIn, function(req,res){ //adds to the campgrouds array 
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.descrip;
    var newCampground = {name:name,image:image, description:description, creator:{id:req.user._id, creatorName:req.user.username}};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // newlyCreated.creator.id = req.user._id;
            // newlyCreated.creator.creatorName = req.user.username;
            // newlyCreated.save();
            console.log(newlyCreated);
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//show new campground form
router.get("/new", middlewareObejct.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//show campground details(image, comments, ratings)
router.get("/:id",function(req, res) {

    //dereference the comment ids to get actual comments
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground)
        {
        if(error || !foundCampground){
            req.flash("error","Campground not found!");
            res.redirect("back");
        }
        else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

module.exports = router;