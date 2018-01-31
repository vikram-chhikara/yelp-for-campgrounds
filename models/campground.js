var mongoose = require("mongoose");

//SCHEMA SETUP WITH MONGOOSE
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    creator: { 
        id:{ type:mongoose.Schema.Types.ObjectId, ref:"User"}, 
        creatorName : String
        
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        
        }
    ]
});

//pass schema to mongoose.model
module.exports = mongoose.model("Campground", campgroundSchema);