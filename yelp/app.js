var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var passport = require("passport");
var localStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var methodOverride = require("method-override");
var seeDB = require("./seed");
var flash = require("connect-flash");
mongoose.set('useFindAndModify', false);

//Routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//seeDB();

app.locals.moment = require('moment');

app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb://localhost/yelp", {useNewUrlParser: true, useUnifiedTopology: true}); 

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "SSSSSSSSSHHHHSSSSSSSS",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
    console.log("Server Started");
});