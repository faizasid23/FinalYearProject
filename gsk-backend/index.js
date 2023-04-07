const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
dotenv.config({ path: './config/config.env' });

// Routes
const auth = require('./routes/auth');
// const applicationContent = require('./routes/applicationContent');
// const applicationSettings = require('./routes/applicationSettings');
// const glasses = require('./routes/glasses');
// const hair = require('./routes/hair');
// const colourPsychology = require('./routes/colourPsychology');
// const styleType = require('./routes/styleType');
// const coolUndertone = require('./routes/coolUndertone');
// const warmUndertone = require('./routes/warmUndertone');
// const personality = require('./routes/personality');
// const colourSwatch = require('./routes/colourSwatch');
// const body = require('./routes/body');
// const clothing = require('./routes/clothing');
// const travel = require('./routes/travel');
// const face = require('./routes/faceMakeUp');
// const nose = require('./routes/noseMakeUp');
// const eyes = require('./routes/eyesMakeUp');
// const lips = require('./routes/lipsMakeUp');
// const hairCut = require('./routes/hairCut');
// const jewelry = require('./routes/jewelry');
// const physicalAppearance = require('./routes/physicalAppearance');
// const makeUp = require('./routes/makeUpTips');
// const userProfile = require('./routes/userProfile');
// const colourContrast = require('./routes/colourContrast');
// const valueContrast = require('./routes/valueContrast');
// const notifications = require('./routes/notifications');
// const quizes = require('./routes/quizes');

// Handling UnCaught Exceptions
process.on('uncaughtException', err => {
	console.log('Uncaught Exception, Shutting Down...');
	console.log(err.name, err.message);
	process.exit(1);
});

const app = express();

// Body Parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Cookie Parser
app.use(cookieParser());
app.use(cors());
// app.use('/uploads', express.static('uploads'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", '*');
	res.header("Access-Control-Allow-Credentials", true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
	next();
});

app.use('/api/auth', auth);
// app.use('/api/app', applicationContent);
// app.use('/api/appSettings', applicationSettings);
// app.use('/api/glasses', glasses);
// app.use('/api/hair', hair);
// app.use('/api/colourPsychology', colourPsychology);
// app.use('/api/styleType', styleType);
// app.use('/api/coolUndertone', coolUndertone);
// app.use('/api/warmUndertone', warmUndertone);
// app.use('/api/personality', personality);
// app.use('/api/colourSwatch', colourSwatch);
// app.use('/api/body', body);
// app.use('/api/clothing', clothing);
// app.use('/api/travel', travel);
// app.use('/api/face', face);
// app.use('/api/nose', nose);
// app.use('/api/eyes', eyes);
// app.use('/api/lips', lips);
// app.use('/api/hairCut', hairCut);
// app.use('/api/jewelry', jewelry);
// app.use('/api/physicalAppearance', physicalAppearance);
// app.use('/api/makeUp', makeUp);
// app.use('/api/userProfile', userProfile);
// app.use('/api/valueContrast', valueContrast);
// app.use('/api/colourContrast', colourContrast);
// app.use('/api/notifications', notifications);
// app.use('/api/quizes', quizes);

// Middleware
app.use(
	session({
		secret: 'my session secrete',
		resave: false,
		saveUninitialized: false,
	})
);

//* Error Handlers for server
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Connecting to the database
const DB = process.env.MONGO_URI;
mongoose
	.connect(DB)
	.then(() => console.log('database is connected successfully'))
	.catch(err => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
	console.log(
		`server is listening on Port : ${PORT}, running in ${process.env.NODE_ENV} mode`
	)
);

// Handling unhandled Rejections
process.on('unhandledRejection', err => {
	console.log('Unhandled Rejection, Shutting Down...');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});