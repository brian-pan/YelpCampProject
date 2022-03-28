const express = require('express');
const router = express.Router();

const catchAsync = require('../Utilities/catchAsync')
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//index route
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

//new route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req,res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    //make a new campground:
    const campground = new Campground(req.body.campground);//under 'campground'
    // console.log(req.body);
    // console.log(req.user);
    campground.author = req.user._id;
    console.log('CampgroundAuthor:', campground.author);
    await campground.save();
    req.flash('success', 'Campground added successfully!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

//show route
router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews', //populate all reviews
        populate: { 
            path: 'author' //and for each review, populate its author
        }
    }).populate('author'); //populate the campground author
    // console.log(campground);
    if(!campground) {
        req.flash('error', 'Cannot find that campground...')
    }
    res.render('campgrounds/show', { campground });
}))

//edit route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground...');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, validateCampground, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    req.flash('success', 'Campground updated successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!')
    res.redirect('/campgrounds')
}))

module.exports = router;