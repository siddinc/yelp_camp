var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware");


// nested RESTful routes for comments

// comments new
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground}); 
        }
    });
});

// comments create
router.post("/", middlewareObj.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong!")
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment!")
                    res.redirect(`/campgrounds/${campground._id}`);                    
                }
            });
        }
    });
});

// comment edit
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership,function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    });
});

// comment update
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if(err) {
            console.log(err);
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// comment delete
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        req.flash("success", "Successfully removed!")
    res.redirect(`/campgrounds/${req.params.id}`);
    });
});

module.exports = router;