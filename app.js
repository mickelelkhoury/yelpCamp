if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize')

// Error handling
const ExpressError = require('./utils/ExpressError');

// ROUTES
const usersRoutes = require('./routes/users.routes');
const campgroundsRoutes = require('./routes/campgrounds.routes');
const reviewsRoutes = require('./routes/reviews.routes');

// Models
const User = require('./models/user.model');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize())

const sessionConfig = {
	name: '__YC',
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// uncomment on deploy 
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.get('/fakeUser', async (req, res) => {
	const user = new User({
		email: 'mickel@gmfaail.com',
		username: 'mdafdsi',
	});
	const newUser = await User.register(user, 'dfsdfs');
	res.send(newUser);
});

// Routes
app.use('/', usersRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh No! Something Went Wrong';
	res.status(statusCode).render('error/error', { err });
});

app.listen(3000, () => {
	console.log('SERVING ON PORT 3000');
});
