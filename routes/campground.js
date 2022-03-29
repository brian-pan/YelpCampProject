const express = require('express');
const router = express.Router();
const campControl = require('../controllers/campground')

const catchAsync = require('../Utilities/catchAsync')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const multer = require('multer');
const upload = multer({ dest: '/uploads' })


//index route
router.get('/', catchAsync(campControl.index))

//new route
router.get('/new', isLoggedIn, campControl.new)

// router.post('/', isLoggedIn, validateCampground, catchAsync(campControl.create))
router.post(upload.array('image'), (req, res) => {
    console.log(req.body, req.files);
    res.send('it worked')
})

//show route
router.get('/:id', catchAsync(campControl.show))

//edit route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campControl.edit))

router.put('/:id', isLoggedIn, validateCampground, isAuthor, catchAsync(campControl.update))

//delete route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campControl.delete))

module.exports = router;