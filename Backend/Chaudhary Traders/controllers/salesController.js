const db = require('../config/db');

// @desc    Process a new checkout / POS invoice
// @route   POST /api/sales
// @access  Public
const createSale = async (req, res) => {
  const client = await db.getClient();
  try {
    const {
      customer_id,
      customerId,
      customerName,
      customerPhone,
      items,
      total_amount,
      grossSubtotal,
      discount,
      totalItemDiscounts,
      grand_total,
      finalTotal,
      payment_method,
      paymentMethod,
    } = req.body;

    const finalItems = items || [];
    if (!Array.isArray(finalItems) || finalItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Cannot process sale.',
      });
    }

    const finalCustomerId = customer_id || customerId || null;
    const finalTotalAmount = parseFloat(total_amount || grossSubtotal || 0);
    const finalDiscount = parseFloat(discount || totalItemDiscounts || 0);
    const finalGrandTotal = parseFloat(grand_total || finalTotal || (finalTotalAmount - finalDiscount));
    const finalPaymentMethod = payment_method || paymentMethod || 'Cash';

    // BEGIN TRANSACTION
    await client.query('BEGIN');

    // Generate Daily Sequential Invoice Number (e.g., INV-20260821-0001)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `INV-${dateStr}-`;

    const countResult = await client.query(
      'SELECT COUNT(*) AS count FROM sales WHERE invoice_number LIKE $1',
      [`${prefix}%`]
    );
    const todayCount = parseInt(countResult.rows[0]?.count || 0, 10);
    const nextSeq = (todayCount + 1).toString().padStart(4, '0');
    const invoiceNumber = `${prefix}${nextSeq}`;

    // Step 1: Create sales record
    const salesQuery = `
      INSERT INTO sales (invoice_number, customer_id, total_amount, discount, grand_total, payment_method, sync_status)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING *
    `;
    const salesValues = [invoiceNumber, finalCustomerId, finalTotalAmount, finalDiscount, finalGrandTotal, finalPaymentMethod];
    const salesResult = await client.query(salesQuery, salesValues);
    const createdSale = salesResult.rows[0];

    // Step 2: Process line items & deduct stock
    const createdItems = [];
    for (const item of finalItems) {
      const prodId = item.product_id || item.id;
      const qty = parseInt(item.quantity || item.qty || 1, 10);
      const unitPrice = parseFloat(item.unit_price || item.price || 0);
      const itemDisc = parseFloat(item.itemDiscount || item.discount || 0);
      const subtotal = Math.max(0, unitPrice * qty - itemDisc);

      // Validate stock availability with row lock
      const stockCheck = await client.query(
        'SELECT id, name, stock_quantity FROM products WHERE id = $1 FOR UPDATE',
        [prodId]
      );

      if (stockCheck.rows.length === 0) {
        throw new Error(`Product ID ${prodId} not found in inventory.`);
      }

      const product = stockCheck.rows[0];
      if (product.stock_quantity < qty) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock_quantity}, Requested: ${qty}`);
      }

      // Deduct stock
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [qty, prodId]
      );

      // Insert line item
      const itemQuery = `
        INSERT INTO sale_items (sale_id, product_id, unit_price, quantity, item_discount, subtotal)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const itemValues = [createdSale.id, prodId, unitPrice, qty, itemDisc, subtotal];
      const itemResult = await client.query(itemQuery, itemValues);

      createdItems.push({
        ...itemResult.rows[0],
        name: product.name,
        unit: item.unit || 'Unit',
      });
    }

    // Step 3: If Credit sale to registered farmer, update ledger balance
    if (finalPaymentMethod === 'Credit' && finalCustomerId) {
      await client.query(
        'UPDATE customers SET balance = balance + $1 WHERE id = $2',
        [finalGrandTotal, finalCustomerId]
      );
    }

    // COMMIT TRANSACTION
    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Sale transaction processed successfully.',
      data: {
        id: createdSale.id,
        invoice_number: createdSale.invoice_number,
        invoiceNo: createdSale.invoice_number,
        date: new Date(createdSale.created_at).toLocaleString(),
        customerName: customerName || 'Walk-in Farmer',
        customerPhone: customerPhone || 'N/A',
        items: createdItems,
        grossSubtotal: finalTotalAmount,
        totalItemDiscounts: finalDiscount,
        finalTotal: finalGrandTotal,
        payment_method: finalPaymentMethod,
      },
    });
  } catch (error) {
    // ROLLBACK TRANSACTION ON ERROR
    await client.query('ROLLBACK');
    console.error('Error in createSale transaction:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process checkout transaction.',
    });
  } finally {
    client.release();
  }
};

// @desc    Fetch past sales transaction history
// @route   GET /api/sales
// @access  Public
const getSales = async (req, res) => {
  try {
    const queryText = `
      SELECT 
        s.id,
        s.invoice_number AS "invoiceNumber",
        s.customer_id AS "customerId",
        COALESCE(c.name, 'Walk-in Farmer') AS "customerName",
        COALESCE(c.phone, 'N/A') AS "customerPhone",
        s.total_amount AS "totalAmount",
        s.discount,
        s.grand_total AS "grandTotal",
        s.payment_method AS "paymentMethod",
        s.sync_status AS "syncStatus",
        s.created_at AS "date",
        (SELECT COUNT(*) FROM sale_items si WHERE si.sale_id = s.id) AS "totalItems"
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      ORDER BY s.id DESC
    `;

    const result = await db.query(queryText);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in getSales:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales history.',
      error: error.message,
    });
  }
};

// @desc    Fetch single invoice formatted for 80mm thermal receipt
// @route   GET /api/sales/:id
// @access  Public
const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const saleQuery = `
      SELECT 
        s.id,
        s.invoice_number AS "invoiceNo",
        s.customer_id AS "customerId",
        COALESCE(c.name, 'Walk-in Farmer') AS "customerName",
        COALESCE(c.phone, 'N/A') AS "customerPhone",
        s.total_amount AS "grossSubtotal",
        s.discount AS "totalItemDiscounts",
        s.grand_total AS "finalTotal",
        s.payment_method AS "paymentMethod",
        s.created_at AS "date"
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE s.id = $1 OR s.invoice_number = $1
    `;

    const saleResult = await db.query(saleQuery, [id]);

    if (saleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    const sale = saleResult.rows[0];

    const itemsQuery = `
      SELECT 
        si.id,
        si.product_id AS "productId",
        p.name,
        p.unit,
        si.unit_price AS price,
        si.quantity AS qty,
        si.item_discount AS "itemDiscount",
        si.subtotal AS "itemTotal"
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      WHERE si.sale_id = $1
    `;

    const itemsResult = await db.query(itemsQuery, [sale.id]);

    return res.status(200).json({
      success: true,
      data: {
        ...sale,
        date: new Date(sale.date).toLocaleString(),
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    console.error('Error in getSaleById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice details.',
      error: error.message,
    });
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
};
