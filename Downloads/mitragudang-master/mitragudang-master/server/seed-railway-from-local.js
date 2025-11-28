/**
 * Seed Railway Database from Local
 * 
 * This script connects to Railway MySQL and populates it with initial data.
 * Run this AFTER you've set environment variables in Railway.
 */

const mysql = require('mysql2/promise');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function warning(message) {
  log(`⚠️ ${message}`, colors.yellow);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️ ${message}`, colors.blue);
}

function heading(message) {
  log(`\n${colors.bright}${colors.cyan}${message}${colors.reset}\n`);
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  heading('🌱 Seed Railway Database');
  
  info('This script will populate your Railway MySQL database with initial data.');
  info('Make sure you have the following information ready:');
  info('  - MySQL Host (from Railway MySQL service)');
  info('  - MySQL Password (from Railway MySQL service)');
  info('  - MySQL Port (usually 3306)');
  
  console.log('');
  
  // Get database credentials from user
  const dbHost = await question('Enter MySQL Host (e.g., nozomi.proxy.rlwy.net): ');
  const dbPort = await question('Enter MySQL Port (default: 3306): ') || '3306';
  const dbUser = await question('Enter MySQL User (default: root): ') || 'root';
  const dbPassword = await question('Enter MySQL Password: ');
  const dbName = await question('Enter Database Name (default: railway): ') || 'railway';
  
  rl.close();
  
  console.log('');
  heading('🔗 Connecting to Railway MySQL...');
  
  const dbConfig = {
    host: dbHost,
    port: parseInt(dbPort),
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    success('Connected to Railway MySQL!');
    
    // Create users table
    heading('📋 Creating users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    success('Users table created!');
    
    // Insert sample users
    info('Inserting sample users...');
    await connection.execute(`
      INSERT IGNORE INTO users (id, username, email, password, role) VALUES 
      ('admin-1', 'Admin', 'admin@gudangmitra.com', 'password123', 'admin'),
      ('manager-1', 'Manager', 'manager@gudangmitra.com', 'password123', 'manager'),
      ('user-1', 'User', 'user@gudangmitra.com', 'password123', 'user')
    `);
    success('Sample users inserted!');
    
    // Create categories table
    heading('📋 Creating categories table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    success('Categories table created!');
    
    // Insert sample categories
    info('Inserting sample categories...');
    await connection.execute(`
      INSERT IGNORE INTO categories (id, name, description) VALUES 
      (1, 'Electronics', 'Electronic devices and components'),
      (2, 'Office Supplies', 'Office equipment and supplies'),
      (3, 'Tools', 'Various tools and equipment'),
      (4, 'Furniture', 'Office and warehouse furniture'),
      (5, 'Safety Equipment', 'Safety gear and equipment')
    `);
    success('Sample categories inserted!');
    
    // Create items table
    heading('📋 Creating items table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        quantity INT DEFAULT 0,
        minQuantity INT DEFAULT 0,
        borrowed_quantity INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'in-stock',
        isActive BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    success('Items table created!');
    
    // Insert sample items
    info('Inserting sample items...');
    await connection.execute(`
      INSERT IGNORE INTO items (name, description, category, quantity, minQuantity, status) VALUES
      ('Laptop Dell XPS 13', 'High-performance laptop with 16GB RAM', 'Electronics', 10, 2, 'in-stock'),
      ('Office Chair Ergonomic', 'Comfortable ergonomic office chair', 'Furniture', 20, 5, 'in-stock'),
      ('Wireless Mouse Logitech', 'Logitech MX Master 3 wireless mouse', 'Electronics', 50, 10, 'in-stock'),
      ('Whiteboard Large', 'Large whiteboard for meetings', 'Office Supplies', 5, 1, 'in-stock'),
      ('Safety Helmet', 'Construction safety helmet', 'Safety Equipment', 30, 10, 'in-stock'),
      ('Desk Lamp LED', 'LED desk lamp with adjustable brightness', 'Electronics', 15, 3, 'in-stock'),
      ('Filing Cabinet', '4-drawer filing cabinet', 'Furniture', 8, 2, 'in-stock'),
      ('Printer HP LaserJet', 'HP LaserJet Pro printer', 'Electronics', 3, 1, 'in-stock'),
      ('Stapler Heavy Duty', 'Heavy duty stapler', 'Office Supplies', 25, 5, 'in-stock'),
      ('Fire Extinguisher', 'ABC fire extinguisher', 'Safety Equipment', 12, 3, 'in-stock')
    `);
    success('Sample items inserted!');
    
    // Create requests table
    heading('📋 Creating requests table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS requests (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    success('Requests table created!');
    
    // Create request_items table
    heading('📋 Creating request_items table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS request_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id VARCHAR(36) NOT NULL,
        item_id INT NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (request_id) REFERENCES requests(id),
        FOREIGN KEY (item_id) REFERENCES items(id)
      )
    `);
    success('Request_items table created!');
    
    // Create notifications table
    heading('📋 Creating notifications table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    success('Notifications table created!');
    
    // Create loans table
    heading('📋 Creating loans table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS loans (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        item_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        status ENUM('active', 'returned', 'overdue') NOT NULL DEFAULT 'active',
        borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date DATE NOT NULL,
        returned_date TIMESTAMP NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (item_id) REFERENCES items(id)
      )
    `);
    success('Loans table created!');
    
    // Verify data
    heading('🔍 Verifying data...');
    
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    success(`Users: ${users[0].count} records`);
    
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    success(`Categories: ${categories[0].count} records`);
    
    const [items] = await connection.execute('SELECT COUNT(*) as count FROM items');
    success(`Items: ${items[0].count} records`);
    
    heading('🎉 Database seeded successfully!');
    
    info('You can now:');
    info('  1. Test backend: https://mitragudang-production.up.railway.app/health');
    info('  2. Login to frontend: https://gudang-mitra-app.netlify.app');
    info('  3. Use credentials:');
    info('     - Email: manager@gudangmitra.com');
    info('     - Password: password123');
    
  } catch (err) {
    error('Error seeding database:');
    console.error(err);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();

