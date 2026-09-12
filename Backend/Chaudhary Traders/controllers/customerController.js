const bcrypt = require('bcryptjs');
const db = require('../config/db');

// @desc    Fetch POS customers dropdown list
// @route   GET /api/customers
// @access  Public
const getCustomers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, phone, address, balance FROM customers WHERE is_active = true ORDER BY name ASC'
    );
    return res.status(200).json({
      success: true,
      data: result.rows.map((c) => ({ ...c, balance: parseFloat(c.balance) })),
    });
  } catch (error) {
    console.error('Error in getCustomers:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch customers.', error: error.message });
  }
};

// @desc    Create POS customer
// @route   POST /api/customers
// @access  Public
const createCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }

    const cleanPhone = phone ? phone.trim() : `0300${Math.floor(1000000 + Math.random() * 9000000)}`;

    const result = await db.query(
      `INSERT INTO customers (name, phone, password, address, balance, is_active)
       VALUES ($1, $2, 'Farmer@123', $3, 0.00, true)
       RETURNING id, name, phone, address, balance`,
      [name.trim(), cleanPhone, address || null]
    );

    // Also insert into users table for login capability
    await db.query(
      `INSERT INTO users (name, phone, password, role, address, is_active)
       VALUES ($1, $2, 'Farmer@123', 'customer', $3, true)
       ON CONFLICT (phone) DO NOTHING`,
      [name.trim(), cleanPhone, address || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Customer created successfully.',
      data: { ...result.rows[0], balance: parseFloat(result.rows[0].balance) },
    });
  } catch (error) {
    console.error('Error in createCustomer:', error);
    return res.status(500).json({ success: false, message: 'Failed to create customer.', error: error.message });
  }
};

// @desc    User / Customer Self Profile & Password Update
// @route   PUT /api/customer/profile
// @access  Private
const updateCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, email, address, currentPassword, newPassword } = req.body;

    // Check `users` table first
    let userRes = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    let tableName = 'users';

    if (userRes.rows.length === 0) {
      userRes = await db.query('SELECT * FROM customers WHERE id = $1', [userId]);
      tableName = 'customers';
    }

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const currentUser = userRes.rows[0];

    const finalName = name !== undefined && name.trim() ? name.trim() : currentUser.name;
    const finalPhone = phone !== undefined && phone.trim() ? phone.trim() : currentUser.phone;
    const finalEmail = email !== undefined ? (email && email.trim() ? email.trim().toLowerCase() : null) : currentUser.email;
    const finalAddress = address !== undefined ? address : currentUser.address;

    // Check phone collision
    if (finalPhone && finalPhone !== currentUser.phone) {
      const phoneCollision = await db.query(`SELECT id FROM ${tableName} WHERE phone = $1 AND id != $2`, [
        finalPhone,
        userId,
      ]);
      if (phoneCollision.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Another account is already using this phone number.',
        });
      }
    }

    // Check email collision
    if (finalEmail && finalEmail !== currentUser.email) {
      const emailCollision = await db.query(`SELECT id FROM ${tableName} WHERE email = $1 AND id != $2`, [
        finalEmail,
        userId,
      ]);
      if (emailCollision.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Another account is already using this email address.',
        });
      }
    }

    let finalPassword = currentUser.password;

    // Password Update Logic (Plain text comparison and update)
    if (newPassword && newPassword.trim()) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password.',
        });
      }

      let isMatch = currentPassword === currentUser.password;
      if (!isMatch && currentUser.password && currentUser.password.startsWith('$2a$')) {
        isMatch = await bcrypt.compare(currentPassword, currentUser.password);
      }

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match.',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long.',
        });
      }

      finalPassword = newPassword;
    }

    const updateQuery = `
      UPDATE ${tableName} SET
        name = $1,
        phone = $2,
        email = $3,
        address = $4,
        password = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, name, phone, email, address, is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"
    `;

    const result = await db.query(updateQuery, [
      finalName,
      finalPhone,
      finalEmail,
      finalAddress,
      finalPassword,
      userId,
    ]);

    const updatedUser = result.rows[0];

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        ...updatedUser,
        role: currentUser.role || 'customer',
      },
    });
  } catch (error) {
    console.error('Error in updateCustomerProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message,
    });
  }
};

// @desc    Admin: Fetch All Registered Users & Farmers List (Queries `users` table)
// @route   GET /api/admin/customers-list
// @access  Private (Admin Only)
const getAllCustomersAdmin = async (req, res) => {
  try {
    const { search } = req.query;
    let queryText = `
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        address, 
        role,
        is_active AS "isActive", 
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      queryText += ` AND (name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1 OR address ILIKE $1)`;
    }

    queryText += ' ORDER BY id DESC';

    let result = await db.query(queryText, params);

    // If users table has 0 results, query customers table
    if (result.rows.length === 0) {
      let fallbackQuery = `
        SELECT id, name, phone, email, address, 'customer' AS role, balance, is_active AS "isActive", created_at AS "createdAt"
        FROM customers WHERE 1=1
      `;
      if (search && search.trim()) {
        fallbackQuery += ` AND (name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1 OR address ILIKE $1)`;
      }
      fallbackQuery += ' ORDER BY id DESC';
      result = await db.query(fallbackQuery, params);
    }

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in getAllCustomersAdmin:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user accounts.',
      error: error.message,
    });
  }
};

// @desc    Admin: Delete User Account
// @route   DELETE /api/admin/customers-list/:id
// @access  Private (Admin Only)
const deleteCustomerAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    let deleteResult = await db.query('DELETE FROM users WHERE id = $1 RETURNING id, name, phone', [id]);
    if (deleteResult.rows.length === 0) {
      deleteResult = await db.query('DELETE FROM customers WHERE id = $1 RETURNING id, name, phone', [id]);
    }

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'User account deleted successfully.',
      data: deleteResult.rows[0],
    });
  } catch (error) {
    console.error('Error in deleteCustomerAdmin:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user account.',
      error: error.message,
    });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomerProfile,
  getAllCustomersAdmin,
  deleteCustomerAdmin,
};
