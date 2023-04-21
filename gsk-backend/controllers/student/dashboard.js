const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const asyncHandler = require('../../utils/catchAsync');
const Holidays = require('../../models/Holidays');
const Timesheets = require('../../models/Timesheets');
const EffortTracking = require('../../models/EffortTracking');
const Student = require('../../models/Student');
const moment = require('moment');

const getStudentId = async (req, res, next) => {
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

    const currentUser = await Student.findById(decoded.id);

    return currentUser?._id
};

// Get Holidays of students
exports.getData = asyncHandler(async (req, res, next) => {

    getStudentId(req, res, next).then(async (id) => {
        // calculation of holidays data here
        const holidays = await Holidays.find({ student_id: id });

        let holidaysCount = 0;
        holidays.forEach((holiday) => {
            holidaysCount += moment(holiday.end_date).diff(moment(holiday.start_date), 'days') + 1
        })

        // calculation of timesheet data here
        const timesheets = await Timesheets.find({ student_id: id });

        let timesheetHours = 0;
        timesheets.forEach((item) => {
            timesheetHours += parseFloat(item.hours)
        })

        // calculation of effort data here
        const effort = await EffortTracking.find({ student_id: id, mode: 'monthly' });

        let effortHours = 0;
        effort.forEach((item) => {
            effortHours += parseFloat(item.hours)
        })

        // console.log("holiday count ", holidaysCount)
        // console.log("timesheets count", timesheetHours.toFixed(2))
        // console.log("effortHours", effortHours.toFixed(2))

        let data = {
            holidays: holidaysCount,
            timesheet: timesheetHours.toFixed(2),
            etrack: effortHours.toFixed(2)
        }
        res.status(200).json({ status: "success", data });
    })

});


// Get Holidays of students
exports.getRecentHolidays = asyncHandler(async (req, res, next) => {

    getStudentId(req, res, next).then(async (id) => {
        const holidays = await Holidays.find({
            student_id: id,
            date_applied: {
                $gte: moment().subtract(7, 'days')
            }
        });

        res.status(200).json({ status: "success", data: holidays });
    })
});


// Get Holidays of students
exports.getRecentTimesheet = asyncHandler(async (req, res, next) => {

    getStudentId(req, res, next).then(async (id) => {
        const timesheets = await Timesheets.find({
            student_id: id,
            date: {
                $gte: moment().subtract(7, 'days')
            }
        });

        res.status(200).json({ status: "success", data: timesheets });
    })
});


// Get Holidays of students
exports.getRecentEffortTracking = asyncHandler(async (req, res, next) => {

    getStudentId(req, res, next).then(async (id) => {

        await EffortTracking.find({
            student_id: id,
            mode: 'weekly'
        }).then(function (data) {
            let filteredData = data.filter(d => moment(d.hours_against.split(' - ')[0], "MM/DD/YYYY").isSame(moment(new Date(), 'MM/DD/YYYY').startOf('isoWeek'))
                // if (moment(d.hours_against.split(' - ')[0], "MM/DD/YYYY").isSame(moment(new Date(), 'MM/DD/YYYY').startOf('isoWeek'))) {
                //     console.log(moment(d.hours_against.split(' - ')[0], "MM/DD/YYYY"))
                //     console.log(moment(new Date(), "MM/DD/YYYY").startOf('isoWeek'))
                // }
            );
            res.status(200).json({ status: "success", data: filteredData });
        });
    })
});
