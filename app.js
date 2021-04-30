const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Models
const Campground = require('./models/campground');

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

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
	const campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campground/${campground._id}`);
});

app.get('/campground/:id', async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, {
		...req.body.campground,
	});
	res.redirect(`/campground/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect('/campgrounds');
});

app.listen(3000, () => {
	console.log('SERVING ON PORT 3000');
});
