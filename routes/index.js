var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");

router.get("/",function(req,res){
    res.render("landing");
});

//============
// Auth routes
//============
//show register form
router.get("/signup",function(req, res) {
    res.render("signup");
});

//handle register logic
router.post("/signup",function(req, res) {
    User.register(new User({username:req.body.username}), req.body.password, function(error,user){
        if(error){
            console.log("error");
            req.flash("error");
            return res.render("signup", {error:error.message});
        }
        passport.authenticate("local")(req, res, function(){
        req.flash("success","Welcome to Yelp Camp "+ user.username+"!")
        res.redirect("/campgrounds");
        });
    });
    
});

//show login page
router.get("/login",function(req, res) {
    res.render("login");
});
    
//handle the user login logic using middleware
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {    
    
});

//logout route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
})


module.exports = router;