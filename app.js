const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
// const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const catchAsync = require('./Utilities/catchAsync')
const ExpressError = require('./Utilities/ExpressError');
const Review = require('./models/review')

const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/review')


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true})) //parse req.body
app.use(methodOverride('_method'))



app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})





app.all('*', (req, res, next) => { //for all routes
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong.'
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})