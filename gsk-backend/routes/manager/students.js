const express = require('express');

const router = express.Router();

const {
    getStudentById, assignStudentToManager,
    getStudents, removeStudentToManager
} = require('../../controllers/manager/students');

router.get('/:id', getStudentById);
router.get('/get-all/:id', getStudents);
router.patch('/assign', assignStudentToManager);
router.patch('/remove', removeStudentToManager);

module.exports = router;