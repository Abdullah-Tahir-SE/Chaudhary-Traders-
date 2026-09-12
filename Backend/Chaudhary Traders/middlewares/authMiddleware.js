const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here_minimum_32_characters';

// Middleware to verify JWT token for both Admin and Customer
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Token missing or invalid format.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role === 'admin') {
      const adminResult = await db.query(
        'SELECT id, name, username_or_email AS "usernameOrEmail" FROM admins WHERE id = $1',
        [decoded.id]
      );
      if (adminResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Admin account no longer exists.' });
      }
      req.user = {
        ...adminResult.rows[0],
        role: 'admin',
      };
    } else {
      const custResult = await db.query(
        'SELECT id, name, phone, email, address, balance, is_active AS "isActive" FROM customers WHERE id = $1',
        [decoded.id]
      );
      if (custResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Customer account no longer exists.' });
      }
      const customer = custResult.rows[0];
      if (!customer.isActive) {
        return res.status(403).json({ success: false, message: 'Account deactivated. Contact store management.' });
      }
      req.user = {
        ...customer,
        role: 'customer',
      };
    }

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token.',
    });
  }
};

// Middleware to enforce Admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
};
