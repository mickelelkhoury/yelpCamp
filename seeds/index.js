const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

// Models
const Campground = require('../models/campground.model');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => {
	return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20 + 10);
		const camp = new Campground({
			author: '60b72155747591402047c506',
			title: `${sample(descriptors)} ${sample(places)}`,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae iste aperiam excepturi repellendus minus, optio tempore voluptatum voluptate quidem mollitia ducimus atque illum aliquam quas! Eaque labore delectus omnis tempore aperiam in doloremque explicabo suscipit, ea vero iure fugiat porro corrupti voluptates illum aut voluptate cumque perferendis rem. Nostrum, blanditiis.',
			price,
			geometry: {
				type: 'Point',
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			images: [
				{
					url: 'https://res.cloudinary.com/mickel/image/upload/v1622892123/YelpCamp/syvap2py9dqt3qdpcmim.jpg',
					filename: 'YelpCamp/syvap2py9dqt3qdpcmim',
				},
				{
					url: 'https://res.cloudinary.com/mickel/image/upload/v1622797860/YelpCamp/atuvcxsdzmvvjaowhkx7.jpg',
					filename: 'YelpCamp/atuvcxsdzmvvjaowhkx7',
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => mongoose.connection.close());
