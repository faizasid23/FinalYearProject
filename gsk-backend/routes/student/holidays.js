const express = require('express');

const router = express.Router();

const {
    addHoliday,
    updateHoliday,
    getAllHolidays,
    getHoliday,
    deleteHoliday
} = require('../../controllers/student/holidays');

router.post('/addHoliday', addHoliday);
router.patch('/updateHoliday/:id', updateHoliday);
router.get('/getAllHolidays', getAllHolidays);
router.get('/getHoliday/:id', getHoliday);
router.delete('/deleteHoliday/:id', deleteHoliday);

module.exports = router;