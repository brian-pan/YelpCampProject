const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')

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

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<50; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '623fc0108f8b3591abb3e716', location: `${cities[random1000].city}, ${cities[random1000].state}`, title: `${sample(descriptors)} ${sample(places)}`, description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque officiis ad eos vero placeat. At voluptatibus dolorum molestias cupiditate similique fugit quidem inventore ipsa id nulla soluta nostrum itaque nobis provident magnam non sint aperiam, quibusdam quos eveniet, dolore unde? Aperiam accusamus, necessitatibus laboriosam quasi dolores libero vel vero fugit!', price, 
            image: [
                {
                  url: 'https://res.cloudinary.com/dsyjdz9zn/image/upload/v1648557194/YelpCamp/udamouruylu91rmnynao.jpg',
                  filename: 'YelpCamp/udamouruylu91rmnynao',
                },
                {
                  url: 'https://res.cloudinary.com/dsyjdz9zn/image/upload/v1648557195/YelpCamp/teup9pfut4xasqwcdd8v.jpg',
                  filename: 'YelpCamp/teup9pfut4xasqwcdd8v',
                },
                {
                  url: 'https://res.cloudinary.com/dsyjdz9zn/image/upload/v1648557195/YelpCamp/wpmulpdzqzdbogldhpqa.jpg',
                  filename: 'YelpCamp/wpmulpdzqzdbogldhpqa',

                }
            ]

        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})