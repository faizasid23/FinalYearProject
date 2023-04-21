const asyncHandler = require('../../utils/catchAsync');
const Student = require('../../models/Student');

// Get student by his/her mudid
exports.getStudentById = asyncHandler(async (req, res, next) => {

    const query = await Student.findOne({ mudid: req.params.id });

    res.status(200).json({ status: "success", data: query });
});

// Get managers students
exports.getStudents = asyncHandler(async (req, res, next) => {

    const query = await Student.find({ manager_id: req.params.id });

    res.status(200).json({ status: "success", data: query });
});

// Assign a manager to the student
exports.assignStudentToManager = asyncHandler(async (req, res, next) => {

    const query = await Student.findOneAndUpdate(
        { _id: req.body.student_id },
        { manager_id: req.body.manager_id },
        { new: true }
    );

    res.status(200).json({ status: "success", data: query });
});

// Remove a manager to the student
exports.removeStudentToManager = asyncHandler(async (req, res, next) => {

    const query = await Student.findOneAndUpdate(
        { _id: req.body.student_id },
        { manager_id: null },
        { new: true }
    );

    res.status(200).json({ status: "success", data: query });
});