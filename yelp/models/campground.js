var mongoose = require("mongoose");

var campGroundsSchema = new mongoose.Schema({
    location: String,
    price: String,
    image: String,
    description: String,
    createdAt: {type: Date, default:Date.now},
    author: {
       id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
       },
       username: String
    },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

var Campground = mongoose.model("Campground", campGroundsSchema);

module.exports = Campground;