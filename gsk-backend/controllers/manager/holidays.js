const asyncHandler = require('../../utils/catchAsync');
const Holidays = require('../../models/Holidays');

// Get Holidays of students
exports.getHolidayRequests = asyncHandler(async (req, res, next) => {

    let holidays = await Holidays.find().populate({
        path: 'student_id',
        match: { manager_id: req.params.id }
    })

    holidays = holidays.filter(function (user) {
        return user.student_id; // return only holidays with managers students
    });

    res.status(200).json({ status: "success", data: holidays });
});

// Update Holidays request status
exports.updateHolidayRequest = asyncHandler(async (req, res, next) => {

    const updatedHoliday = await Holidays.findOneAndUpdate(
        { _id: req.params.id },
        { status: req.body.status },
        { new: true }
    );

    res.status(200).json({ status: "success", data: updatedHoliday });
});
