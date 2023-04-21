const express = require('express');

const router = express.Router();

const {
    getEffortData,
} = require('../../controllers/manager/effortTracking');

router.get('/getEffortData/:id', getEffortData);

module.exports = router;