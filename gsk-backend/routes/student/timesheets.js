const express = require('express');

const router = express.Router();

const {
    addTimesheet,
    updateTimesheet,
    getAllTimesheets,
    getTimesheet,
    deleteTimesheet
} = require('../../controllers/student/timesheets');

router.post('/addTimesheet', addTimesheet);
router.patch('/updateTimesheet/:id', updateTimesheet);
router.get('/getAllTimesheets', getAllTimesheets);
router.get('/getTimesheet/:id', getTimesheet);
router.delete('/deleteTimesheet/:id', deleteTimesheet);

module.exports = router;