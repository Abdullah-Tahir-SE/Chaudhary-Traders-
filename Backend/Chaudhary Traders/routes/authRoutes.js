const express = require('express');
const router = express.Router();
const { adminLogin, customerRegister, customerLogin, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/admin-login', adminLogin);
router.post('/customer-register', customerRegister);
router.post('/customer-login', customerLogin);
router.get('/me', verifyToken, getMe);

module.exports = router;
