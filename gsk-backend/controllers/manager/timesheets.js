const asyncHandler = require('../../utils/catchAsync');
const Timesheets = require('../../models/Timesheets');

// Get Timesheets of students
exports.getTimesheets = asyncHandler(async (req, res, next) => {

    let timesheets = await Timesheets.find().sort({ date: -1 }).populate({
        path: 'student_id',
        match: { manager_id: req.params.id }
    })

    timesheets = timesheets.filter(function (user) {
        return user.student_id; // return only timesheets with managers students
    });

    res.status(200).json({ status: "success", data: timesheets });
});

// Update Timesheets request status
exports.updateTimesheets = asyncHandler(async (req, res, next) => {

    const updatedHoliday = await Timesheets.findOneAndUpdate(
        { _id: req.params.id },
        { status: req.body.status },
        { new: true }
    );

    res.status(200).json({ status: "success", data: updatedHoliday });
});
