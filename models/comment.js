var mongoose = require("mongoose");

//SCHEMA SETUP WITH MONGOOSE
var commentSchema = new mongoose.Schema({
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text: String
});

//pass schema to mongoose.model
module.exports = mongoose.model("Comment", commentSchema);