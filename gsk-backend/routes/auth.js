const express = require('express');

const { RegisterManager, LoginManager,
    RegisterStudent, LoginStudent,
    protectManager, protectStudent,
    resetPassword, forgetPassword,
    resetCode, codeVerify
} = require('../middleware/auth');

const router = express.Router();

router.post('/manager/register', RegisterManager);
router.post('/manager/login', LoginManager);
router.post('/student/register', RegisterStudent);
router.post('/student/login', LoginStudent);
router.get('/manager/validate-token', protectManager);
router.get('/student/validate-token', protectStudent);
router.post('/reset-password', resetPassword);
router.post('/forget-password', forgetPassword);
router.post('/reset-code', resetCode);
router.post('/reset-code-verify', codeVerify);

module.exports = router;
