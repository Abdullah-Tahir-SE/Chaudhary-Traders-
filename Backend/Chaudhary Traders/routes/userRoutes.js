const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

// All user management routes require JWT authentication and Admin role
router.use(verifyToken, requireAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
