const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema; //shorten codes slightly

const CampgroundSchema = new Schema({
    title: String,
    image: [{
        url: String,
        filename: String
    }],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId, //need populate()
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);