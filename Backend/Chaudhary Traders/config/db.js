const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'Abii0827',
  database: process.env.DB_NAME || 'chaudhary_traders_db',
  max: parseInt(process.env.DB_POOL_MAX || '5', 10),
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE || '10000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

// Auto-initialize database tables and initial seed data if not exists
const initDb = async () => {
  try {
    const client = await pool.connect();
    try {
      // 1. Create Users Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          phone VARCHAR(30) UNIQUE,
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(30) NOT NULL DEFAULT 'customer',
          address TEXT,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Create Dedicated Admins Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          username_or_email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. Create / Upgrade Customers Table (for POS ledger integration)
      await client.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          phone VARCHAR(30) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255) NOT NULL DEFAULT 'Farmer@123',
          address TEXT,
          balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 4. Create Core POS Product & Sales Tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS products (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category_id BIGINT REFERENCES categories(id) ON DELETE RESTRICT,
          sku VARCHAR(100) UNIQUE,
          supplier VARCHAR(255) DEFAULT 'Sungro Crop Care Ltd',
          invoice_number VARCHAR(100),
          batch_number VARCHAR(100),
          expiry_date DATE,
          cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (cost_price >= 0),
          sale_price NUMERIC(12, 2) NOT NULL CHECK (sale_price >= 0),
          stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
          min_stock INT NOT NULL DEFAULT 10 CHECK (min_stock >= 0),
          unit VARCHAR(50) NOT NULL DEFAULT 'Bag',
          image_url TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sales (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          invoice_number VARCHAR(50) NOT NULL UNIQUE,
          customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
          total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
          discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
          grand_total NUMERIC(12, 2) NOT NULL CHECK (grand_total >= 0),
          payment_method VARCHAR(30) NOT NULL DEFAULT 'Cash',
          sync_status BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sale_items (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
          product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
          unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
          quantity INT NOT NULL CHECK (quantity > 0),
          item_discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (item_discount >= 0),
          subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0)
        );
      `);

      // 5. Seed Default Admin in `admins` Table with PLAIN TEXT password
      const adminCheck = await client.query(
        "SELECT * FROM admins WHERE username_or_email IN ('admin@chaudharytraders.com', 'admin')"
      );
      if (adminCheck.rows.length === 0) {
        await client.query(
          `INSERT INTO admins (name, username_or_email, password)
           VALUES ($1, $2, $3), ($4, $5, $6)`,
          [
            'Chaudhary Admin',
            'admin@chaudharytraders.com',
            'Admin@123',
            'Chaudhary Admin',
            'admin',
            'Admin@123',
          ]
        );
        console.log('👑 Default Dedicated Admin Account created in PostgreSQL with plain text password (admin@chaudharytraders.com / Admin@123)');
      }

      // Seed categories if empty
      const catCheck = await client.query('SELECT COUNT(*) FROM categories');
      if (parseInt(catCheck.rows[0].count, 10) === 0) {
        await client.query(`
          INSERT INTO categories (name, description) VALUES
          ('Fertilizers', 'Chemical and organic fertilizers including DAP, Urea, CAN'),
          ('Pesticides', 'Insecticides, fungicides, and herbicides for crop protection'),
          ('Seeds', 'Certified hybrid seeds for corn, wheat, cotton, and vegetables'),
          ('Micronutrients', 'Zinc, Boron, Sulfur, and foliar spray micro-nutrients'),
          ('Tools & Machinery', 'Sprayer pumps and farm equipment');
        `);
      }

      // Seed initial users if empty
      const userCheck = await client.query('SELECT COUNT(*) FROM users');
      if (parseInt(userCheck.rows[0].count, 10) === 0) {
        await client.query(
          `INSERT INTO users (name, phone, email, password, role, address) VALUES
          ('Chaudhry Tariq Mehmood', '0300-6912345', 'tariq@gmail.com', 'Farmer@123', 'customer', 'Chak 90/9-L, Sahiwal'),
          ('Malik Imran Ali', '0345-7823910', 'imran@gmail.com', 'Farmer@123', 'customer', 'Adda Sang Noor Shah, Sahiwal'),
          ('Rana Zulqarnain', '0312-4512900', 'rana@gmail.com', 'Farmer@123', 'customer', 'Chak 86/9-L, Sahiwal');`
        );
      }

      console.log('✅ PostgreSQL Database schema & initial seed data verified.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Error initializing PostgreSQL schema:', err.message);
  }
};

initDb();

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
