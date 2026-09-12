const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomerProfile } = require('../controllers/customerController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', getCustomers);
router.post('/', createCustomer);
router.put('/profile', verifyToken, updateCustomerProfile);

module.exports = router;
