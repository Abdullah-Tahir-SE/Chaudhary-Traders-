const db = require('../config/db');

// @desc    Get all products with category names and stock status
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let queryText = `
      SELECT 
        p.id,
        p.name,
        p.category_id,
        c.name AS category,
        p.sku,
        p.supplier,
        p.invoice_number AS "invoiceNo",
        p.batch_number AS "batchNo",
        p.expiry_date AS "expiryDate",
        p.cost_price AS "costPrice",
        p.sale_price AS price,
        p.stock_quantity AS stock,
        p.min_stock AS "minStock",
        p.unit,
        p.image_url AS image,
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    const queryParams = [];

    if (category && category !== 'ALL' && category !== 'All') {
      queryParams.push(category);
      queryText += ` AND (c.name ILIKE $${queryParams.length})`;
    }

    if (search && search.trim()) {
      queryParams.push(`%${search.trim()}%`);
      const paramIndex = queryParams.length;
      queryText += ` AND (p.name ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex} OR p.batch_number ILIKE $${paramIndex} OR p.invoice_number ILIKE $${paramIndex})`;
    }

    queryText += ' ORDER BY p.id DESC';

    const result = await db.query(queryText, queryParams);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products.',
      error: error.message,
    });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const queryText = `
      SELECT 
        p.id,
        p.name,
        p.category_id,
        c.name AS category,
        p.sku,
        p.supplier,
        p.invoice_number AS "invoiceNo",
        p.batch_number AS "batchNo",
        p.expiry_date AS "expiryDate",
        p.cost_price AS "costPrice",
        p.sale_price AS price,
        p.stock_quantity AS stock,
        p.min_stock AS "minStock",
        p.unit,
        p.image_url AS image,
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;

    const result = await db.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in getProductById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product details.',
      error: error.message,
    });
  }
};

// @desc    Create a new product SKU
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category_id,
      categoryId,
      sku,
      supplier,
      invoice_number,
      invoiceNo,
      batch_number,
      batchNo,
      expiry_date,
      expiryDate,
      cost_price,
      costPrice,
      sale_price,
      price,
      stock_quantity,
      stock,
      min_stock,
      minStock,
      unit,
      image_url,
      image,
    } = req.body;

    const finalName = name;
    const finalCatId = category_id || categoryId || 1;
    const finalSku = sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalSupplier = supplier || 'Sungro Crop Care Ltd';
    const finalInvoiceNo = invoice_number || invoiceNo || null;
    const finalBatchNo = batch_number || batchNo || null;
    const finalExpiryDate = expiry_date || expiryDate || null;
    const finalCostPrice = parseFloat(cost_price || costPrice || 0);
    const finalSalePrice = parseFloat(sale_price || price || 0);
    const finalStock = parseInt(stock_quantity || stock || 0, 10);
    const finalMinStock = parseInt(min_stock || minStock || 10, 10);
    const finalUnit = unit || 'Bag';
    const finalImage = image_url || image || null;

    if (!finalName || !finalName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required.',
      });
    }

    const insertQuery = `
      INSERT INTO products (
        name, category_id, sku, supplier, invoice_number, batch_number, expiry_date,
        cost_price, sale_price, stock_quantity, min_stock, unit, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      finalName.trim(),
      finalCatId,
      finalSku,
      finalSupplier,
      finalInvoiceNo,
      finalBatchNo,
      finalExpiryDate,
      finalCostPrice,
      finalSalePrice,
      finalStock,
      finalMinStock,
      finalUnit,
      finalImage,
    ];

    const result = await db.query(insertQuery, values);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Product SKU code already exists.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create product.',
      error: error.message,
    });
  }
};

// @desc    Update product details & prices
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category_id,
      categoryId,
      sku,
      supplier,
      invoice_number,
      invoiceNo,
      batch_number,
      batchNo,
      expiry_date,
      expiryDate,
      cost_price,
      costPrice,
      sale_price,
      price,
      stock_quantity,
      stock,
      min_stock,
      minStock,
      unit,
      image_url,
      image,
    } = req.body;

    const checkResult = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const current = checkResult.rows[0];

    const finalName = name !== undefined ? name : current.name;
    const finalCatId = category_id || categoryId || current.category_id;
    const finalSku = sku !== undefined ? sku : current.sku;
    const finalSupplier = supplier !== undefined ? supplier : current.supplier;
    const finalInvoiceNo = invoice_number || invoiceNo || current.invoice_number;
    const finalBatchNo = batch_number || batchNo || current.batch_number;
    const finalExpiryDate = expiry_date || expiryDate || current.expiry_date;
    const finalCostPrice = cost_price !== undefined || costPrice !== undefined ? parseFloat(cost_price || costPrice) : current.cost_price;
    const finalSalePrice = sale_price !== undefined || price !== undefined ? parseFloat(sale_price || price) : current.sale_price;
    const finalStock = stock_quantity !== undefined || stock !== undefined ? parseInt(stock_quantity || stock, 10) : current.stock_quantity;
    const finalMinStock = min_stock !== undefined || minStock !== undefined ? parseInt(min_stock || minStock, 10) : current.min_stock;
    const finalUnit = unit !== undefined ? unit : current.unit;
    const finalImage = image_url !== undefined || image !== undefined ? (image_url || image) : current.image_url;

    const updateQuery = `
      UPDATE products SET
        name = $1,
        category_id = $2,
        sku = $3,
        supplier = $4,
        invoice_number = $5,
        batch_number = $6,
        expiry_date = $7,
        cost_price = $8,
        sale_price = $9,
        stock_quantity = $10,
        min_stock = $11,
        unit = $12,
        image_url = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      finalName,
      finalCatId,
      finalSku,
      finalSupplier,
      finalInvoiceNo,
      finalBatchNo,
      finalExpiryDate,
      finalCostPrice,
      finalSalePrice,
      finalStock,
      finalMinStock,
      finalUnit,
      finalImage,
      id,
    ];

    const result = await db.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product.',
      error: error.message,
    });
  }
};

// @desc    Direct stock adjustment (manual restock or audit)
// @route   PATCH /api/products/:id/stock
// @access  Public
const adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity, stock } = req.body;

    const newStock = parseInt(stock_quantity !== undefined ? stock_quantity : stock, 10);

    if (isNaN(newStock) || newStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid non-negative stock quantity is required.',
      });
    }

    const result = await db.query(
      'UPDATE products SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [newStock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product stock updated successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in adjustStock:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to adjust stock.',
      error: error.message,
    });
  }
};

// @desc    Delete a product SKU
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
};
