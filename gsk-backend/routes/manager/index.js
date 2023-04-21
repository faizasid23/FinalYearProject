const express = require('express');
const router = express.Router();

router.use('/students', require('./students'));
router.use('/dashboard', require('./dashboard'));
router.use('/holidays', require('./holidays'));
router.use('/timesheets', require('./timesheets'));
router.use('/effort-tracking', require('./effortTracking'));

module.exports = router;