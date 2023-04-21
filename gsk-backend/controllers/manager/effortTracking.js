const asyncHandler = require('../../utils/catchAsync');
const EffortTracking = require('../../models/EffortTracking');

// Get EffortTracking of students
exports.getEffortData = asyncHandler(async (req, res, next) => {

    let effortTracking = await EffortTracking.find().populate({
        path: 'student_id',
        match: { manager_id: req.params.id }
    })

    effortTracking = effortTracking.filter(function (user) {
        return user.student_id; // return only effortTracking with managers students
    });

    res.status(200).json({ status: "success", data: effortTracking });
});
