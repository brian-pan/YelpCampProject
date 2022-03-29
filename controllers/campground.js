const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')

//index
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

//new
module.exports.new =  (req, res) => {
    res.render('campgrounds/new');
}

module.exports.create = async (req,res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    //make a new campground:
    const campground = new Campground(req.body.campground);//under 'campground'
    campground.image = req.files.map(f => ({url: f.path, filename: f.filename})) 
    campground.author = req.user._id;
    console.log(campground.image)
    // console.log('CampgroundAuthor:', campground.author);
    await campground.save();
    req.flash('success', 'Campground added successfully!')
    res.redirect(`/campgrounds/${campground._id}`)
}

//show
module.exports.show = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews', //populate all reviews
        populate: { 
            path: 'author' //and for each review, populate its author
        }
    }).populate('author'); //populate the campground author
    if(!campground) {
        req.flash('error', 'Cannot find that campground...')
    }
    res.render('campgrounds/show', { campground });
}

//edit
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground...');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.update = async(req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    const imgArray = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.image.push(...imgArray); //spread operator
    await campground.save();
    //delete images backend:
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        };
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages}}}});
        console.log(campground);
    }
    req.flash('success', 'Campground updated successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
}

//delete
module.exports.delete = async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!')
    res.redirect('/campgrounds')
}