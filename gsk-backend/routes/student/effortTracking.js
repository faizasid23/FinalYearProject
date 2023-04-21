const express = require('express');

const router = express.Router();

const {
    addEffortTracking,
    updateEffortTracking,
    getAllEffortTrackings,
    getEffortTracking,
    deleteEffortTracking
} = require('../../controllers/student/effortTracking');

router.post('/addEffortTracking', addEffortTracking);
router.patch('/updateEffortTracking/:id', updateEffortTracking);
router.get('/getAllEffortTrackings', getAllEffortTrackings);
router.get('/getEffortTracking/:id', getEffortTracking);
router.delete('/deleteEffortTracking/:id', deleteEffortTracking);

module.exports = router;