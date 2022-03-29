const express = require('express');
const router = express.Router();
const campControl = require('../controllers/campground')

const catchAsync = require('../Utilities/catchAsync')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary/index')
// const upload = multer({ dest: '/uploads' })
const upload = multer({ storage })


//index route
router.get('/', catchAsync(campControl.index))

//new route
router.get('/new', isLoggedIn, campControl.new)

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campControl.create))

//show route
router.get('/:id', catchAsync(campControl.show))

//edit route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campControl.edit))

router.put('/:id', isLoggedIn, validateCampground, isAuthor, catchAsync(campControl.update))

//delete route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campControl.delete))

module.exports = router;