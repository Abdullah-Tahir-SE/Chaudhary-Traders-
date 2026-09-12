const db = require('../config/db');

// @desc    Get aggregated real-time PostgreSQL database stats for Dashboard
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    // 1. Today's Sales & Today's Bills
    const todayQuery = `
      SELECT 
        COALESCE(SUM(grand_total), 0) AS "todaySales", 
        COUNT(*) AS "todayBills" 
      FROM sales 
      WHERE created_at >= CURRENT_DATE;
    `;
    const todayResult = await db.query(todayQuery);
    const todaySales = parseFloat(todayResult.rows[0].todaySales);
    const todayBills = parseInt(todayResult.rows[0].todayBills, 10);

    // 2. Total Sales & Total Bills Overall
    const totalQuery = `
      SELECT 
        COALESCE(SUM(grand_total), 0) AS "totalSales", 
        COUNT(*) AS "totalBills" 
      FROM sales;
    `;
    const totalResult = await db.query(totalQuery);
    const totalSales = parseFloat(totalResult.rows[0].totalSales);
    const totalBills = parseInt(totalResult.rows[0].totalBills, 10);

    // 3. Farmer Accounts Credit Balance
    const creditQuery = `
      SELECT 
        COALESCE(SUM(balance), 0) AS "totalCreditBalance", 
        COUNT(*) FILTER (WHERE balance > 0) AS "creditFarmersCount" 
      FROM customers;
    `;
    const creditResult = await db.query(creditQuery);
    const totalCreditBalance = parseFloat(creditResult.rows[0].totalCreditBalance);
    const creditFarmersCount = parseInt(creditResult.rows[0].creditFarmersCount, 10);

    // 4. Low Stock Warning Items
    const lowStockQuery = `
      SELECT 
        p.id, 
        p.name, 
        p.stock_quantity AS stock, 
        p.min_stock AS "minStock", 
        p.unit, 
        COALESCE(c.name, 'General') AS category 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.stock_quantity <= p.min_stock 
      ORDER BY p.stock_quantity ASC 
      LIMIT 5;
    `;
    const lowStockResult = await db.query(lowStockQuery);
    const lowStockItems = lowStockResult.rows;

    const lowStockCountQuery = `
      SELECT COUNT(*) AS count FROM products WHERE stock_quantity <= min_stock;
    `;
    const lowStockCountRes = await db.query(lowStockCountQuery);
    const lowStockCount = parseInt(lowStockCountRes.rows[0].count, 10);

    // 5. Recent Sales (Last 6 POS Invoices)
    const recentSalesQuery = `
      SELECT 
        s.id, 
        s.invoice_number AS "invoiceNumber", 
        COALESCE(c.name, 'Walk-in Farmer') AS "customerName", 
        COALESCE(c.phone, 'N/A') AS "customerPhone", 
        s.grand_total AS "grandTotal", 
        s.payment_method AS "paymentMethod", 
        s.created_at AS "date", 
        (SELECT COUNT(*) FROM sale_items si WHERE si.sale_id = s.id) AS "totalItems" 
      FROM sales s 
      LEFT JOIN customers c ON s.customer_id = c.id 
      ORDER BY s.id DESC 
      LIMIT 6;
    `;
    const recentSalesResult = await db.query(recentSalesQuery);

    // 6. Last 7 Days Complete Revenue Trend Series
    const weeklyQuery = `
      SELECT 
        d.day_date, 
        TO_CHAR(d.day_date, 'Dy') AS day_label, 
        COALESCE(SUM(s.grand_total), 0) AS revenue, 
        COUNT(s.id) AS bills 
      FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day'::interval) d(day_date)
      LEFT JOIN sales s ON DATE_TRUNC('day', s.created_at) = d.day_date
      GROUP BY d.day_date
      ORDER BY d.day_date ASC;
    `;
    const weeklyResult = await db.query(weeklyQuery);

    // 7. Category Revenue Distribution
    const categoryDistQuery = `
      SELECT 
        COALESCE(c.name, 'General') AS category, 
        COUNT(si.id) AS items_sold, 
        COALESCE(SUM(si.subtotal), 0) AS revenue 
      FROM sale_items si 
      JOIN products p ON si.product_id = p.id 
      LEFT JOIN categories c ON p.category_id = c.id 
      GROUP BY c.name 
      ORDER BY revenue DESC;
    `;
    const categoryDistResult = await db.query(categoryDistQuery);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          todaySales,
          todayBills,
          totalSales,
          totalBills,
          totalCreditBalance,
          creditFarmersCount,
          lowStockCount,
        },
        lowStockItems,
        recentSales: recentSalesResult.rows,
        weeklyTrend: weeklyResult.rows.map((row) => ({
          day: row.day_label,
          revenue: parseFloat(row.revenue),
          bills: parseInt(row.bills, 10),
        })),
        categoryDistribution: categoryDistResult.rows.map((row) => ({
          category: row.category,
          itemsSold: parseInt(row.items_sold, 10),
          revenue: parseFloat(row.revenue),
        })),
      },
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats.',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
