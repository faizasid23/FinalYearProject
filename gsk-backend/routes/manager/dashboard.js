const express = require('express');

const router = express.Router();

const {
    getStudentHolidays,
    getActiveStudents,
    getStudentTimesheets
} = require('../../controllers/manager/dashboard');

router.get('/student-holidays', getStudentHolidays);
router.get('/student-timesheets', getStudentTimesheets);
router.get('/students', getActiveStudents);

module.exports = router;