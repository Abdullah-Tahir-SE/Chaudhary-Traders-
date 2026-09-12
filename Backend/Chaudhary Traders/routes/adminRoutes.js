const express = require('express');
const router = express.Router();
const { getAllCustomersAdmin, deleteCustomerAdmin } = require('../controllers/customerController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken, requireAdmin);

router.get('/customers-list', getAllCustomersAdmin);
router.delete('/customers-list/:id', deleteCustomerAdmin);

module.exports = router;
