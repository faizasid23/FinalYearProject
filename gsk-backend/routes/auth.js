const express = require('express');

const { RegisterManager, LoginManager, RegisterStudent, LoginStudent, protectManager, protectStudent } = require('../middleware/auth');

const router = express.Router();

router.post('/manager/register', RegisterManager);
router.post('/manager/login', LoginManager);
router.post('/student/register', RegisterStudent);
router.post('/student/login', LoginStudent);
router.get('/manager/validate-token', protectManager);
router.get('/student/validate-token', protectStudent);
// router.get('/logout', logOut);
// router.get('/home', home);

module.exports = router;
