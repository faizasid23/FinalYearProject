const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const asyncHandler = require('../../utils/catchAsync');
const Holidays = require('../../models/Holidays');
const Timesheets = require('../../models/Timesheets');
const EffortTracking = require('../../models/EffortTracking');
const Manager = require('../../models/Manager');
const Student = require('../../models/Student');
const moment = require('moment');

const getManagersId = async (req, res, next) => {
    let token;
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

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await Manager.findById(decoded.id);

    return currentUser?._id
};

// Get recent holiday request data from students
exports.getStudentHolidays = asyncHandler(async (req, res, next) => {

    getManagersId(req, res, next).then(async (id) => {

        let holidays = await Holidays.find({ status: 0 }).populate({
            path: 'student_id',
            match: { manager_id: id }
        })

        holidays = holidays.filter(function (user) {
            return user.student_id; // return only holidays with managers students
        });

        res.status(200).json({ status: "success", data: holidays });

    })
});


// Get Timesheets of manager's students
exports.getStudentTimesheets = asyncHandler(async (req, res, next) => {

    getManagersId(req, res, next).then(async (id) => {

        let timesheets = await Timesheets.find({ status: 0 }).populate({
            path: 'student_id',
            match: { manager_id: id }
        })

        timesheets = timesheets.filter(function (user) {
            return user.student_id; // return only holidays with managers students
        });

        res.status(200).json({ status: "success", data: timesheets });

    })
});


// Get students / active students
exports.getActiveStudents = asyncHandler(async (req, res, next) => {

    getManagersId(req, res, next).then(async (id) => {

        let query = await Student.find({ manager_id: id }).select('name');

        res.status(200).json({ status: "success", data: query });
    })
});
