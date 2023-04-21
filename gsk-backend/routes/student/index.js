const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./dashboard'));
router.use('/holidays', require('./holidays'));
router.use('/timesheet', require('./timesheets'));
router.use('/effort_tracking', require('./effortTracking'));

module.exports = router;