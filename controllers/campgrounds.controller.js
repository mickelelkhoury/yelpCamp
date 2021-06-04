// Models
const Campground = require('../models/campground.model');

module.exports.getCampgrounds = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
	const campground = new Campground(req.body.campground);
	campground.images = req.files.map((zone) => ({
		url: zone.path,
		filename: zone.filename,
	}));
	campground.author = req.user._id;
	await campground.save();
	console.log(campground);
	req.flash('success', 'Campground created successfully!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.getSingleCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({ path: 'reviews', populate: { path: 'author' } })
		.populate('author');
	if (!campground) {
		req.flash('error', 'Campground not found');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash('error', 'Cannot find that campground!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { campground });
};

module.exports.editCampground = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, {
		...req.body.campground,
	});
	const imgs = req.files.map((zone) => ({
		url: zone.path,
		filename: zone.filename,
	}));
	campground.images.push(...imgs);
	await campground.save();
	req.flash('success', 'Campground updated successfully!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect('/campgrounds');
};
