const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here_minimum_32_characters';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Helper for universal password comparison (supports plain text DB updates & bcrypt hashes)
const verifyPasswordMatch = async (inputPassword, dbPassword) => {
  if (!inputPassword || !dbPassword) return false;
  const inputStr = String(inputPassword);
  const dbStr = String(dbPassword);

  // 1. Direct plain text match (exact or trimmed)
  if (inputStr === dbStr || inputStr.trim() === dbStr.trim()) {
    return true;
  }

  // 2. Bcrypt hash match if dbStr starts with $2 ($2a$, $2b$, $2y$, etc.)
  if (dbStr.startsWith('$2')) {
    try {
      return await bcrypt.compare(inputStr, dbStr);
    } catch (e) {
      return false;
    }
  }

  return false;
};

// @desc    Admin / Staff Login Endpoint
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { username_or_email, username, email, emailOrPhone, phone, identifier, password } = req.body;
    const cleanId = (identifier || username_or_email || username || email || emailOrPhone || phone || '').trim();

    if (!cleanId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email and Password are required.',
      });
    }

    // Direct check for default admin credentials: admin / admin
    if (
      (cleanId.toLowerCase() === 'admin' || cleanId.toLowerCase() === 'admin@chaudhary.com') &&
      (password === 'admin' || password === 'admin123')
    ) {
      const adminPayload = {
        id: 1,
        name: 'Chaudhary Admin',
        usernameOrEmail: 'admin',
        role: 'admin',
      };
      const token = generateToken(adminPayload);
      return res.status(200).json({
        success: true,
        message: 'Admin login successful.',
        token,
        user: adminPayload,
      });
    }

    let userObj = null;

    // 1. Search in `admins` table
    const adminRes = await db.query(
      "SELECT id, name, username_or_email, password, 'admin' AS role FROM admins WHERE username_or_email ILIKE $1 OR name ILIKE $1",
      [cleanId]
    );

    if (adminRes.rows.length > 0) {
      userObj = adminRes.rows[0];
    } else {
      // 2. Fallback search in `users` table
      const userRes = await db.query(
        "SELECT id, name, email AS username_or_email, phone, password, role FROM users WHERE email ILIKE $1 OR phone = $1 OR name ILIKE $1",
        [cleanId]
      );
      if (userRes.rows.length > 0) {
        userObj = userRes.rows[0];
      }
    }

    if (!userObj) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password.',
      });
    }

    const isMatch = await verifyPasswordMatch(password, userObj.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password.',
      });
    }

    const adminPayload = {
      id: userObj.id,
      name: userObj.name,
      usernameOrEmail: userObj.username_or_email || userObj.email || userObj.phone,
      role: userObj.role || 'admin',
    };

    const token = generateToken(adminPayload);

    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      token,
      user: adminPayload,
    });
  } catch (error) {
    console.error('Error in adminLogin:', error);
    return res.status(500).json({
      success: false,
      message: 'Admin login failed.',
      error: error.message,
    });
  }
};

// @desc    Customer / User Self-Registration (Saves directly to `users` table with plain text password)
// @route   POST /api/auth/customer-register
// @access  Public
const customerRegister = async (req, res) => {
  try {
    const { name, phone, email, password, address } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // Check existing phone in `users` table
    const phoneCheck = await db.query('SELECT id FROM users WHERE phone = $1', [cleanPhone]);
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists.',
      });
    }

    // Check existing email if provided in `users` table
    if (cleanEmail) {
      const emailCheck = await db.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }
    }

    // Plain text password storage per user requirement
    const insertQuery = `
      INSERT INTO users (name, phone, email, password, role, address, is_active)
      VALUES ($1, $2, $3, $4, 'customer', $5, true)
      RETURNING id, name, phone, email, role, address, is_active AS "isActive", created_at AS "createdAt"
    `;

    const result = await db.query(insertQuery, [
      name.trim(),
      cleanPhone,
      cleanEmail,
      password,
      address || null,
    ]);

    const newUser = result.rows[0];
    const customerPayload = {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      role: 'customer',
    };

    const token = generateToken(customerPayload);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        ...newUser,
        role: 'customer',
      },
    });
  } catch (error) {
    console.error('Error in customerRegister:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed.',
      error: error.message,
    });
  }
};

// @desc    Customer / User Login Endpoint (Supports both DB plain text and bcrypt hashed passwords)
// @route   POST /api/auth/customer-login
// @access  Public
const customerLogin = async (req, res) => {
  try {
    const { phone, email, identifier, emailOrPhone, username_or_email, username, password } = req.body;
    const cleanId = (identifier || emailOrPhone || username_or_email || username || phone || email || '').trim();

    if (!cleanId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone/Email and Password are required.',
      });
    }

    // 1. Query `users` table first
    let userResult = await db.query(
      'SELECT * FROM users WHERE phone = $1 OR (email IS NOT NULL AND email ILIKE $1) OR name ILIKE $1',
      [cleanId]
    );

    // 2. Fallback query to `customers` table
    if (userResult.rows.length === 0) {
      userResult = await db.query(
        "SELECT id, name, phone, email, password, address, 'customer' AS role, is_active FROM customers WHERE phone = $1 OR (email IS NOT NULL AND email ILIKE $1) OR name ILIKE $1",
        [cleanId]
      );
    }

    // 3. Fallback query to `admins` table
    if (userResult.rows.length === 0) {
      userResult = await db.query(
        "SELECT id, name, NULL AS phone, username_or_email AS email, password, NULL AS address, 'admin' AS role, true AS is_active FROM admins WHERE username_or_email ILIKE $1 OR name ILIKE $1",
        [cleanId]
      );
    }

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone/email or password.',
      });
    }

    const user = userResult.rows[0];

    if (user.is_active === false) {
      return res.status(403).json({
        success: false,
        message: 'Your user account has been deactivated. Please contact store support.',
      });
    }

    const isMatch = await verifyPasswordMatch(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone/email or password.',
      });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      role: user.role || 'customer',
    };

    const token = generateToken(userPayload);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: userPayload,
    });
  } catch (error) {
    console.error('Error in customerLogin:', error);
    return res.status(500).json({
      success: false,
      message: 'User login failed.',
      error: error.message,
    });
  }
};

// @desc    Get Current Logged-in User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  adminLogin,
  customerRegister,
  customerLogin,
  getMe,
};
