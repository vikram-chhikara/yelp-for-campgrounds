var app = require("express")(), 
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    express = require("express"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

//getting routes
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

//connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true}); //the first time, will create database called "yelp_camp" and connect to it, every other time, will just connect to it.

app.use(flash());

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

//seedDB(); //seed db


//passport config
app.use(require("express-session")({
    secret: "world is flat",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate comes from passport local mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//middleware will run for every route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

// var campgrounds =[
//     {name:"Yosemite", image:"https://farm8.staticflickr.com/7530/15570594753_49fe0b95da.jpg"}, 
//     {name:"Zions Park", image:"https://farm7.staticflickr.com/6014/6193268729_7d1deddba3.jpg"}, 
//     {name:"Granite Hill", image:"https://s-media-cache-ak0.pinimg.com/originals/9d/62/46/9d62462e7dfaf0f3c09711152acb01d6.jpg"},
//     {name:"Yosemite", image:"https://farm8.staticflickr.com/7530/15570594753_49fe0b95da.jpg"}, 
//     {name:"Zions Park", image:"https://farm7.staticflickr.com/6014/6193268729_7d1deddba3.jpg"}, 
//     {name:"Granite Hill", image:"https://s-media-cache-ak0.pinimg.com/originals/9d/62/46/9d62462e7dfaf0f3c09711152acb01d6.jpg"},
//     {name:"Yosemite", image:"https://farm8.staticflickr.com/7530/15570594753_49fe0b95da.jpg"}, 
//     {name:"Zions Park", image:"https://farm7.staticflickr.com/6014/6193268729_7d1deddba3.jpg"}, 
//     {name:"Granite Hill", image:"https://s-media-cache-ak0.pinimg.com/originals/9d/62/46/9d62462e7dfaf0f3c09711152acb01d6.jpg"}
// ];



app.listen(process.env.PORT,process.env.IP,function(){
   console.log("YelpCamp server has started!"); 
});