var express = require("express");
var router = express.Router({mergeParams:true});

var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middlewareObejct = require("../middleware");


//Get add comment form
router.get("/new", middlewareObejct.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(error,campground){
        if(error){
           console.log("Error"); 
        }
        else{
            res.render("./comments/new",{campground:campground});
        }
    });
    
});

//Post a new comment associated with a campground
router.post("/", middlewareObejct.isLoggedIn, function(req,res){
    //add comments to db
    Campground.findById(req.params.id,function(error, campground) {
        if(error){
            console.log(error);
            res.redirect("/campgrounds");
        }
        else{
            var newComment = {text:req.body.comment, author:{id:req.user._id, username:req.user.username}};
            Comment.create(newComment,function(error,comment){
                if(error){
                    console.log(error);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
      }
  });

});

//Edit a comment
router.get("/:comment_id/edit", middlewareObejct.checkCommentOwnership, function(req,res){
    Campground.findById(req.params.id, function(error,foundCampground){
        if(error || !foundCampground){
            req.flash("error","Campground not found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(error,comment){
        if(error){
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{comment:comment, campground: foundCampground}); 
        }
    });       
    });
     
});



//Update a comment using PUT
router.put("/:comment_id", middlewareObejct.checkCommentOwnership, function(req,res){
    //find by id and update comment 
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
        if(error){
            console.log("cold not update comment");
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//delete route for comment
router.delete("/:comment_id", middlewareObejct.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
        if(error){
            console.log("Comment deletion failure");
            res.redirect("back");
        }
        else{
            req.flash("success","Comment deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports = router;