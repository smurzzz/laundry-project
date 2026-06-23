const express = require('express');
const {
  registerUser,
  registerAdmin,
  loginUser,
  googleSignIn,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);
router.post('/login', loginUser);
router.post('/google', googleSignIn);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
