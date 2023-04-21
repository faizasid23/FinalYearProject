const express = require('express');

const router = express.Router();

const {
    getData,
    getRecentHolidays,
    getRecentTimesheet,
    getRecentEffortTracking
} = require('../../controllers/student/dashboard');

router.get('/data', getData);
router.get('/recentHolidays', getRecentHolidays);
router.get('/recentTimesheet', getRecentTimesheet);
router.get('/recentEffortTracking', getRecentEffortTracking);

module.exports = router;