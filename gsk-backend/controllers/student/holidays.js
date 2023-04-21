const asyncHandler = require('../../utils/catchAsync');
const Holidays = require('../../models/Holidays');

// Add A New Holiday
exports.addHoliday = asyncHandler(async (req, res, next) => {

    const newHoliday = await Holidays.create({
        student_id: req.body.student_id,
        leave_type: req.body.leave_type,
        reason: req.body.reason,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        date_applied: req.body.date_applied,
        status: req.body.status
    });

    res.status(201).json({ status: "success", data: newHoliday });
});

// Get Holidays of students
exports.getHoliday = asyncHandler(async (req, res, next) => {
    const holidays = await Holidays.find({ student_id: req.params.id }).populate('student_id');

    res.status(200).json({ status: "success", data: holidays });
});

// Get All Holidays
exports.getAllHolidays = asyncHandler(async (req, res, next) => {
    const holidays = await Holidays.find();

    res.status(200).json({ status: "success", data: holidays });
});

// Update Holidays
exports.updateHoliday = asyncHandler(async (req, res, next) => {

    const updatedHoliday = await Holidays.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
    );

    res.status(200).json({ status: "success", data: updatedHoliday });
});

// Delete holidays
exports.deleteHoliday = asyncHandler(async (req, res, next) => {
    // Delete Holiday against the id of student
    await Holidays.findByIdAndDelete(req.params.id);

    res.status(200).json({ status: "success" });
});
