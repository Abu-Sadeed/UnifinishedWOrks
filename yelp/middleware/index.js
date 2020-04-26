var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};


middlewareObj.checkCamownership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamp){
            if(err || !foundCamp){
                req.flash("error", "Campground does not exist")
                res.redirect("back")
            } else {
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Permission denied");
                    res.redirect("back")
                }
               
            }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Review not found");
                res.redirect("back")
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Permission denied")
                    res.redirect("back")
                }
               
            }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;