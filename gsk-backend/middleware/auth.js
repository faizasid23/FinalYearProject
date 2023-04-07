const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/APIError');
const { promisify } = require('util');
// Importing our modals here for the DB ... 
const Manager = require('../models/Manager');
const Student = require('../models/Student');

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
};

const createSendToken = (res, user, statusCode) => {
	const token = signToken(user.id);
	// Setting up cookie
	const cookieOptions = {
		expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	// if code is in production then cookies will be sent on only https connections
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	// sending cookie
	res.cookie('jwt', token, cookieOptions);

	// preventing user password to show up in response
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: { user }
	});
};

// Registering a Student
exports.RegisterStudent = catchAsync(async (req, res, next) => {
	const { first_name, last_name, email, mudid, password } = req.body;

	let name = first_name + ' ' + last_name

	const student = await Student.findOne({ email });

	if (student) {
		return next(new APIError('A user with the same email already exists', 400));
	}

	const newStudent = await Student.create({
		first_name, last_name, name, email, mudid, password,
	});
	// await UserProfile.create({ userId: newUser._id });

	createSendToken(res, newStudent, 201);
});

// Registering a Manager
exports.RegisterManager = catchAsync(async (req, res, next) => {
	const { first_name, last_name, email, mudid, password } = req.body;

	let name = first_name + ' ' + last_name;

	const manager = await Manager.findOne({ email });

	if (manager) {
		return next(new APIError('A user with the same email already exists', 400));
	}

	const newManager = await Manager.create({
		first_name, last_name, name, email, mudid, password
	});
	// await UserProfile.create({ userId: newUser._id });

	createSendToken(res, newManager, 201);
});

// Log in for the Student
exports.LoginStudent = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		// just in case we are also doing a basic validation on the backend
		return next(new APIError(`Please Enter Your Email and Password`, 400));
	}

	const student = await Student.findOne({ email }).select('+password');

	if (!student) {
		return next(new APIError(`Email or Password is not correct`, 200, { email: ["This email does not exist."] }));
	}
	else if (!(await student.correctPassword(password, student.password))) {
		return next(new APIError(`Email or Password is not correct`, 200));
	}

	createSendToken(res, student, 200);
});

// Log in for the Manager
exports.LoginManager = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		// just in case we are also doing a basic validation on the backend
		return next(new APIError(`Please Enter Your Email and Password`, 400));
	}

	const manager = await Manager.findOne({ email }).select('+password');

	if (!manager) {
		return next(new APIError(`Email or Password is not correct`, 200, { email: ["This email does not exist."] }));
	}
	else if (!(await manager.correctPassword(password, manager.password))) {
		return next(new APIError(`Email or Password is not correct`, 200));
	}

	createSendToken(res, manager, 200);
});

// // Logging out a user
// exports.logOut = catchAsync(async (req, res, next) => {
// 	res.cookie('jwt', '', {
// 		expiresIn: new Date(Date.now() + 10 * 1000),
// 		httpOnly: true,
// 	});

// 	res.status(200).json({
// 		status: 'success',
// 		data: {},
// 	});
// });

// Validation Middleware to check the token validity
// To check for the Student
exports.protectStudent = catchAsync(async (req, res, next) => {

	let token;
	// 1) Getting token and check of it's there
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(
			new APIError('You are not logged in,please log in to get access', 401)
		);
	}

	// 2) Verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exists
	const currentUser = await Student.findById(decoded.id);
	if (!currentUser) {
		return next(
			new APIError(`The user belongs to this token does not exist anymore`, 401)
		);
	}
	else if (currentUser) {
		currentUser.password = undefined;
		res.status(200).json({
			status: 'success',
			data: {
				user: currentUser
			}
		});
	}
});

// To check for the Manager
exports.protectManager = catchAsync(async (req, res, next) => {
	let token;
	// 1) Getting token and check of it's there
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(
			new APIError('You are not logged in,please log in to get access', 401)
		);
	}

	// 2) Verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exists
	const currentUser = await Manager.findById(decoded.id);
	if (!currentUser) {
		return next(
			new APIError(`The user belongs to this token does not exist anymore`, 401)
		);
	}
	else if (currentUser) {
		currentUser.password = undefined;
		res.status(200).json({
			status: 'success',
			data: {
				user: currentUser
			}
		});
	}
});