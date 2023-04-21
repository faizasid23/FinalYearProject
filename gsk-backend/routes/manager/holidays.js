const express = require('express');

const router = express.Router();

const {
    getHolidayRequests,
    updateHolidayRequest,
} = require('../../controllers/manager/holidays');

router.get('/getHolidayRequests/:id', getHolidayRequests);
router.patch('/updateHolidayRequest/:id', updateHolidayRequest);

module.exports = router;