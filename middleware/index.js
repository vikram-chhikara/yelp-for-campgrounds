// all middlewares
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObejct = {};

//middleware 
middlewareObejct.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You must be logged in first!");
    res.redirect("/login");
}

middlewareObejct.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(error,campground){
        
            if(error || !campground){
                req.flash("error","Campground not found!")
                res.redirect("back");
            }
            else{
                if(req.user._id.equals(campground.creator.id)){
                    return next();
                }
                else{
                    req.flash("error", "You don't have the permission to do that!");
                    res.redirect("/campgrounds");
                }
            }
        });
    }
    else{
        req.flash("error","You must be logged in first!");
        res.redirect("back");
    }
}

middlewareObejct.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err || !comment){
                req.flash("error","Comment not found!");
                res.redirect("back");
            }else{
              if(comment.author.id.equals(req.user._id)){
                   next();
                }else{
                    req.flash("error", "You don't have the permission to do that!");
                    res.redirect("back");
                }
            }   
        });
    }else{
        req.flash("error","You must be logged in first!");
        res.redirect("back");
    }
}

module.exports = middlewareObejct;