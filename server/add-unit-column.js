const mysql = require('mysql2/promise');
require('dotenv').config();

async function addUnitColumn() {
  let connection;

  try {
    console.log('🔌 Connecting to Railway MySQL...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);

    // Connect to Railway MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      connectTimeout: 30000
    });

    console.log('✅ Connected to Railway MySQL');
    
    // Check if unit column exists
    console.log('\n📋 Checking if unit column exists in items table...');
    const [columns] = await connection.query('DESCRIBE items');
    const hasUnitColumn = columns.some(col => col.Field === 'unit');
    
    if (hasUnitColumn) {
      console.log('✅ Unit column already exists!');
      console.log('\n📊 Current unit column info:');
      const unitColumn = columns.find(col => col.Field === 'unit');
      console.log(unitColumn);
    } else {
      console.log('❌ Unit column does NOT exist');
      console.log('\n🔧 Adding unit column to items table...');
      
      await connection.query(`
        ALTER TABLE items 
        ADD COLUMN unit VARCHAR(50) DEFAULT 'pcs' AFTER quantity
      `);
      
      console.log('✅ Unit column added successfully!');
      
      // Verify the column was added
      const [newColumns] = await connection.query('DESCRIBE items');
      const unitColumn = newColumns.find(col => col.Field === 'unit');
      console.log('\n📊 New unit column info:');
      console.log(unitColumn);
    }
    
    // Show sample items with unit
    console.log('\n📦 Sample items with unit field:');
    const [items] = await connection.query('SELECT id, name, quantity, unit FROM items LIMIT 5');
    console.table(items);
    
    console.log('\n✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

// Run the script
addUnitColumn();

