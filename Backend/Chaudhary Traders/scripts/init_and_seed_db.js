const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'Abii0827',
  database: process.env.DB_NAME || 'chaudhary_traders_db',
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting PostgreSQL Database Setup & Migration for Chaudhary Traders...');
    console.log(`📡 Connected to Database: ${process.env.DB_NAME || 'chaudhary_traders_db'} on Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);

    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // 1. Create Tables
    console.log('🔨 Creating database tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customers (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
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

      -- B-Tree Performance Indexes
      CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku) WHERE sku IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
      CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
    `);
    console.log('✅ Tables created successfully (categories, customers, products, sales, sale_items).');

    // 2. Populate Seed Data
    console.log('🌱 Seeding initial records for Chaudhary Traders...');

    // Categories
    await client.query(`
      INSERT INTO categories (name, description) VALUES
      ('Fertilizers', 'Chemical and organic fertilizers including DAP, Urea, CAN'),
      ('Pesticides', 'Insecticides, fungicides, and herbicides for crop protection'),
      ('Seeds', 'Certified hybrid seeds for corn, wheat, cotton, and vegetables'),
      ('Micronutrients', 'Zinc, Boron, Sulfur, and foliar spray micro-nutrients'),
      ('Tools & Machinery', 'Sprayer pumps and farm equipment')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Customers
    await client.query(`
      INSERT INTO customers (name, phone, address, balance) VALUES
      ('Walk-in Farmer', 'N/A', 'Adda Sang Noor Shah, Sahiwal', 0.00),
      ('Chaudhry Tariq Mehmood', '0300-6912345', 'Chak 90/9-L, Sahiwal', 45000.00),
      ('Malik Imran Ali', '0345-7823910', 'Adda Sang Noor Shah, Sahiwal', 0.00),
      ('Rana Zulqarnain', '0312-4512900', 'Chak 86/9-L, Sahiwal', 18500.00),
      ('Mian Bashir Ahmed', '0333-8901122', 'Harappa Road, Sahiwal', 0.00)
      ON CONFLICT DO NOTHING;
    `);

    // Products
    await client.query(`
      INSERT INTO products (name, category_id, sku, supplier, invoice_number, batch_number, expiry_date, cost_price, sale_price, stock_quantity, min_stock, unit) VALUES
      ('Sungro DAP Fertilizer (50kg)', 1, 'SKU-DAP-01', 'Sungro Crop Care Ltd', 'INV-SUP-90412', 'BATCH-DAP-88', '2028-11-30', 11800.00, 12500.00, 145, 20, '50kg Bag'),
      ('Sungro Sona Urea (50kg)', 1, 'SKU-UREA-02', 'Sungro Crop Care Ltd', 'INV-SUP-90413', 'BATCH-UREA-12', '2029-05-15', 4300.00, 4600.00, 220, 50, '50kg Bag'),
      ('Sungro Coragen Insecticide (100ml)', 2, 'SKU-COR-03', 'Sungro Crop Care Ltd', 'INV-SUP-88120', 'LOT-COR-55', '2027-08-20', 2900.00, 3200.00, 30, 15, '100ml Bottle'),
      ('Sungro Amistar Fungicide (250ml)', 2, 'SKU-AMI-04', 'Sungro Crop Care Ltd', 'INV-SUP-88121', 'LOT-AMI-99', '2027-10-10', 3800.00, 4200.00, 35, 10, '250ml Bottle'),
      ('Sungro CAN Calcium Fertilizer (50kg)', 1, 'SKU-CAN-05', 'Sungro Crop Care Ltd', 'INV-SUP-90500', 'BATCH-CAN-34', '2028-04-18', 3500.00, 3800.00, 85, 25, '50kg Bag'),
      ('Sungro Hybrid Maize Seed (10kg)', 3, 'SKU-SEED-06', 'Sungro Crop Care Ltd', 'INV-SUP-77301', 'SEED-MZ-01', '2027-01-15', 10500.00, 11500.00, 25, 10, '10kg Bag'),
      ('Sungro Belt Expert Insecticide (50ml)', 2, 'SKU-BLT-07', 'Sungro Crop Care Ltd', 'INV-SUP-88145', 'LOT-BLT-78', '2027-12-01', 2600.00, 2900.00, 50, 15, '50ml Bottle'),
      ('Sungro Zinc 33% Powder (1kg)', 4, 'SKU-ZNC-08', 'Sungro Crop Care Ltd', 'INV-SUP-66200', 'NUT-ZN-45', '2029-09-30', 820.00, 950.00, 95, 20, '1kg Packet')
      ON CONFLICT (sku) DO NOTHING;
    `);

    console.log('✅ Seed records populated successfully.');
    console.log('🎉 Database migration finished! All tables and records are live in PostgreSQL / pgAdmin.');
  } catch (err) {
    console.error('❌ Migration Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
