const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review');

const campgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

// FIXME: to check why middleware is not working
campgroundSchema.post('findOneAndDelete', async function (doc) {
	console.log('ok');
	// if (doc) {
	// 	await Review.deleteMany({
	// 		_id: { $in: doc.review },
	// 	});
	// }
});

module.exports = mongoose.model('Campground', campgroundSchema);
