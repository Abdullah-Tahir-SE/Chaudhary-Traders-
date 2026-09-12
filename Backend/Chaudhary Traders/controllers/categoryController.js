const db = require('../config/db');

// @desc    Get all product categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in getCategories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories.',
      error: error.message,
    });
  }
};

// @desc    Create a new product category
// @route   POST /api/categories
// @access  Public
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const result = await db.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name.trim(), description || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in createCategory:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create category.',
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
};
