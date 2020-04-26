var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var Campground = require("../models/campground");

router.get("/", function(req, res){
    Campground.find({}, function(err, allcampgrounds){
        if(err){
             console.log(err);
        } else {
             res.render("campgrounds/index", {campgrounds:allcampgrounds});
        }
    });
 });
 
router.get("/new", middleware.isLoggedIn, function(req, res){
     res.render("campgrounds/new");
 });
 
router.post("/", middleware.isLoggedIn, function(req, res){
     var location = req.body.location;
     var image = req.body.image;
     var price  = req.body.price;
     var description = req.body.description;
     var author = {
         id: req.user._id,
         username: req.user.username
     }
     var newCampground = {location: location, image:image, price:price, description:description,author:author}
     Campground.create(newCampground, function(err, newlyCreated){
         if(err){
             console.log(err);
         } else {
            req.flash("success", "Location posted successfully");
             res.redirect("/");
         }
     });
 });
 
router.get("/:id", function(req, res){
     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
         if(err || !foundCamp){
            req.flash("error", "Location not found");
            res.redirect("back")
         } else {
             res.render("campgrounds/show", {campground: foundCamp});
         }
     })
 });

router.get("/:id/edit", middleware.checkCamownership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        console.log(foundCamp);
        res.render("campgrounds/edit", {campground: foundCamp});
    });
});
 
router.put("/:id", middleware.checkCamownership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Changes are saved");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/:id", middleware.checkCamownership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Location has been removed successfully");
            res.redirect("/campgrounds");
        }
    })
})


module.exports = router;