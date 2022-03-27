const express = require('express');
const router = express.Router();

const catchAsync = require('../Utilities/catchAsync')
const ExpressError = require('../Utilities/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemaValidations.js')
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
} // it is a middleware

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req,res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    //make a new campground:
    const campground = new Campground(req.body.campground);//under 'campground'
    await campground.save();
    req.flash('success', 'Campground added successfully!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Cannot find that campground...')
    }
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Cannot find that campground...');
        return res.redirect('/campgrounds')
    } else {
        res.render('campgrounds/edit', { campground })
    }
}))
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    req.flash('success', 'Campground updated successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!')
    res.redirect('/campgrounds')
}))

module.exports = router;