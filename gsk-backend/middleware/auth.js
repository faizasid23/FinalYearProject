const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/APIError');
const { promisify } = require('util');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
// Importing our modals here for the DB ... 
const Manager = require('../models/Manager');
const Student = require('../models/Student');
const ResetCode = require('../models/ResetCode');
const sendEmail = require('../utils/email');

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

// Forgot Password handlers
exports.forgetPassword = catchAsync(async (req, res, next) => {
	const { email, type } = req.body;

	let db = type === "student" ? Student : Manager;

	let query = await db.findOne({ email });

	if (!query) {
		return next(new APIError(`Cannot find your info in DB.`, 200, { email: ["This email does not exist."] }));
	}
	else {
		res.status(200).json({ status: 'success', data: { email: query?.email.replace(/(?<=\w{2})\w/g, '*') } });
	}
});

exports.resetCode = catchAsync(async (req, res, next) => {
	const { email, type } = req.body;

	let db = type === "student" ? Student : Manager;

	let query = await db.findOne({ email });

	if (query) {

		let token = await ResetCode.findOne({ email });

		if (token) await ResetCode.deleteOne();

		let resetToken = crypto.randomBytes(3).toString("hex");

		const hash = await bcrypt.hash(resetToken, Number(10));

		await new ResetCode({ email, token: hash, createdAt: Date.now() }).save();

		const options = {
			email: email,
			subject: "Here is your Reset Code!",
			message: "Here is your confirmation code for password reset.",
			body: `Hi <b>${query?.name}!</b>
			<br>
			<br>
			Your code for password reset is <b>${resetToken}</b>. Make sure you don't share this code with others.
			<br>
			<br>
			Thank You!`
		}
		sendEmail(options).then((response) => {
			if (response) res.status(200).json({ status: 'success' });
			else return next(new APIError(`There was a problem sending code to the email.`, 200));
		}).catch((error) => {
			return next(new APIError(`There was a problem sending code to the email.`, 200, error));
		});
	}
	else {
		return next(new APIError(`User does not exist.`, 200));
	}
});

exports.codeVerify = catchAsync(async (req, res, next) => {
	const { code, email } = req.body;

	let passwordResetToken = await ResetCode.findOne({ email });

	if (!passwordResetToken)
		return next(new APIError(`Invalid or expired password reset code`, 200, { code: ['This code has expired.'] }));

	const isValid = await bcrypt.compare(code, passwordResetToken.token);

	if (!isValid)
		return next(new APIError(`Invalid or expired password reset code`, 200, { code: ['This code is incorrect.'] }));

	res.status(200).json({ status: 'success' });

})

exports.resetPassword = catchAsync(async (req, res, next) => {
	const { id, password, old_password, type, email } = req.body;

	let db = type === "student" ? Student : Manager;

	if (old_password) {

		let query = await db.findById(id).select('+password');

		if (!query) {
			return next(new APIError(`Cannot find your account in our database.`, 200));
		}
		else if (!(await query.correctPassword(old_password, query.password))) {
			return next(new APIError(`Password is not correct`, 200, { old_password: ["The password provided is incorrect."] }));
		}
		else {
			query.password = password
			query.save();

			res.status(200).json({ status: 'success' });
		}
	} else {
		let query = await db.findOne({ email }).select('+password');

		if (!query) {
			return next(new APIError(`Cannot find your account in our database.`, 200));
		}

		query.password = password
		query.save();

		res.status(200).json({ status: 'success' });
	}
});
// handlers end