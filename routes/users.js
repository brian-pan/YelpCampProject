const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../Utilities/catchAsync');
const userControl = require('../controllers/user')

//register route
router.get('/register', userControl.registerForm);

router.post('/register', catchAsync(userControl.register));

//login route
router.get('/login', userControl.loginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userControl.login)

//logout route
router.get('/logout', userControl.logout)

module.exports = router;