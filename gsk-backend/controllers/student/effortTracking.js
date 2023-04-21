const asyncHandler = require('../../utils/catchAsync');
const EffortTracking = require('../../models/EffortTracking');
const APIError = require('../../utils/APIError');

// Add A New EffortTracking
exports.addEffortTracking = asyncHandler(async (req, res, next) => {
    const record = await EffortTracking.findOne({
        student_id: req.body.student_id,
        $and: [
            { mode: req.body.mode },
            { project_code: req.body.project_code }
        ]
    })

    if (record)
        return next(new APIError(`Effort is already logged for the same project under same ${req.body.mode} period`, 400, { project_name: ["Effort for this project is already logged."] }));


    const newEffortTracking = await EffortTracking.create({
        student_id: req.body.student_id,
        hours: req.body.hours,
        hours_against: req.body.hours_against,
        mode: req.body.mode,
        project_code: req.body.project_code,
        project_name: req.body.project_name,
        status: req.body.status
    });

    res.status(201).json({ status: "success", data: newEffortTracking });
});

// Get EffortTracking of students
exports.getEffortTracking = asyncHandler(async (req, res, next) => {
    const effortTracking = await EffortTracking.find({
        student_id: req.params.id,
        mode: req.query.mode
    }).populate('student_id').sort({ project_code: 1 });

    res.status(200).json({ status: "success", data: effortTracking });
});

// Get All EffortTracking
exports.getAllEffortTrackings = asyncHandler(async (req, res, next) => {
    const effortTrackings = await EffortTracking.find();

    res.status(200).json({ status: "success", data: effortTrackings });
});

// Update EffortTracking
exports.updateEffortTracking = asyncHandler(async (req, res, next) => {

    const updatedEffortTracking = await EffortTracking.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
    );

    res.status(200).json({ status: "success", data: updatedEffortTracking });
});

// Delete holidays
exports.deleteEffortTracking = asyncHandler(async (req, res, next) => {
    // Delete EffortTracking against the id of student
    await EffortTracking.findByIdAndDelete(req.params.id);

    res.status(200).json({ status: "success" });
});
