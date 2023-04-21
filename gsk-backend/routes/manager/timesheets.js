const express = require('express');

const router = express.Router();

const {
    getTimesheets,
    updateTimesheets,
} = require('../../controllers/manager/timesheets');

router.get('/getTimesheets/:id', getTimesheets);
router.patch('/updateTimesheets/:id', updateTimesheets);

module.exports = router;