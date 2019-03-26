var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");


/*Campground.create({
    name: "Salmon Creek",
    image: "https://www.camping.se/ImageVaultFiles/id_2034/cf_239/st_edited/8ZfOHyVM3gcxasp5N1En.jpg",
    description: "This is a huge campsite with beautiful scenery",
}, function(err, campground) {
    if(err) {
        console.log(err);
    } else {
        console.log("Newly created campground");
        console.log(campground);
    }
});*/

// RESTful routes for campgrounds

// campground index
router.get("/", function(req, res) {
    Campground.find({}, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campground});
        }
    });
});

// campground create
router.post("/", middlewareObj.isLoggedIn, function(req, res) {
    var newCampground = req.body.campground;
    Campground.create(newCampground, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
            res.redirect("/campgrounds");
        }
    });
});

// campground new
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// campground show
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// campground edit
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {    
        res.render("campgrounds/edit", {campground: campground});  
    });
});

// campground update
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
    var data = req.body.campground;
    Campground.findByIdAndUpdate(req.params.id, data, function(err, campground) {
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// campground delete
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        res.redirect("/campgrounds");
    });
});

module.exports = router;