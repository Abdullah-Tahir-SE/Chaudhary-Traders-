const db = require('../config/db');

// @desc    Fetch all registered users/farmers (Admin Only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let queryText = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.role, 
        u.address, 
        u.is_active AS "isActive", 
        u.created_at AS "createdAt", 
        u.updated_at AS "updatedAt"
      FROM users u
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      params.push(role);
      queryText += ` AND u.role = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      const idx = params.length;
      queryText += ` AND (u.name ILIKE $${idx} OR u.email ILIKE $${idx} OR u.phone ILIKE $${idx})`;
    }

    queryText += ' ORDER BY u.id DESC';

    const result = await db.query(queryText, params);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users.',
      error: error.message,
    });
  }
};

// @desc    Get single user details & transaction stats (Admin Only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await db.query(
      `SELECT id, name, email, phone, role, address, is_active AS "isActive", created_at AS "createdAt"
       FROM users WHERE id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: userResult.rows[0],
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user details.',
      error: error.message,
    });
  }
};

// @desc    Update user profile or status (Admin Only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, address, is_active, isActive } = req.body;

    const checkResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const current = checkResult.rows[0];

    const finalName = name !== undefined ? name.trim() : current.name;
    const finalEmail = email !== undefined ? (email ? email.trim().toLowerCase() : null) : current.email;
    const finalPhone = phone !== undefined ? (phone ? phone.trim() : null) : current.phone;
    const finalRole = role !== undefined ? role : current.role;
    const finalAddress = address !== undefined ? address : current.address;
    const finalActive = is_active !== undefined ? Boolean(is_active) : isActive !== undefined ? Boolean(isActive) : current.is_active;

    const updateQuery = `
      UPDATE users SET
        name = $1,
        email = $2,
        phone = $3,
        role = $4,
        address = $5,
        is_active = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, name, email, phone, role, address, is_active AS "isActive", updated_at AS "updatedAt"
    `;

    const result = await db.query(updateQuery, [
      finalName,
      finalEmail,
      finalPhone,
      finalRole,
      finalAddress,
      finalActive,
      id,
    ]);

    return res.status(200).json({
      success: true,
      message: 'User details updated successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user.',
      error: error.message,
    });
  }
};

// @desc    Delete user account (Admin Only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the primary admin account
    const checkResult = await db.query('SELECT role FROM users WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (parseInt(id, 10) === parseInt(req.user.id, 10)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own logged-in admin account.',
      });
    }

    const deleteResult = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
      data: deleteResult.rows[0],
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
