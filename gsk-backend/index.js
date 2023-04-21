const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
dotenv.config({ path: './config/config.env' });

// Routes
const auth = require('./routes/auth');
const ManagerRoutes = require('./routes/manager');
const StudentRoutes = require('./routes/student');

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
app.use('/api/manager', ManagerRoutes);
app.use('/api/student', StudentRoutes);

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