const express = require('express');
const { registerUser, registerAdmin, loginUser, googleSignIn } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);
router.post('/login', loginUser);
router.post('/google', googleSignIn);

module.exports = router;
