const asyncHandler = require('../../utils/catchAsync');
const Timesheets = require('../../models/Timesheets');

// Add A New Timesheet
exports.addTimesheet = asyncHandler(async (req, res, next) => {

    const newTimesheet = await Timesheets.create({
        student_id: req.body.student_id,
        date: req.body.date,
        checkin: req.body.checkin,
        checkout: req.body.checkout,
        hours: req.body.hours,
        student_earned_amount: req.body.student_earned_amount,
        status: req.body.status
    });

    res.status(201).json({ status: "success", data: newTimesheet });
});

// Get Timesheets of students
exports.getTimesheet = asyncHandler(async (req, res, next) => {

    let timesheet;
    if (Object.keys(req.query).length !== 0)
        timesheet = await Timesheets.find({
            student_id: req.params.id,
            date: {
                $gte: req.query.from_date,
                $lte: req.query.to_date
            }
        }).populate('student_id').sort({ date: -1 });
    else
        timesheet = await Timesheets.find({ student_id: req.params.id }).populate('student_id').sort({ date: -1 });


    res.status(200).json({ status: "success", data: timesheet });
});

// Get All Timesheets
exports.getAllTimesheets = asyncHandler(async (req, res, next) => {
    const timesheets = await Timesheets.find();

    res.status(200).json({ status: "success", data: timesheets });
});

// Update Timesheets
exports.updateTimesheet = asyncHandler(async (req, res, next) => {

    const updatedTimesheet = await Timesheets.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
    );

    res.status(200).json({ status: "success", data: updatedTimesheet });
});

// Delete holidays
exports.deleteTimesheet = asyncHandler(async (req, res, next) => {
    // Delete Timesheet against the id of student
    await Timesheets.findByIdAndDelete(req.params.id);

    res.status(200).json({ status: "success" });
});
