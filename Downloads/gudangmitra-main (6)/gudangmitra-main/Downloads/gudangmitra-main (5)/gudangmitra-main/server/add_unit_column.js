const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gudang1'
};

async function addUnitColumn() {
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database');
    
    // Read and execute SQL file
    const sqlPath = path.join(__dirname, 'add_unit_column.sql');
    const sqlScript = await fs.readFile(sqlPath, 'utf8');
    
    // Execute SQL statements
    await connection.query(sqlScript);
    console.log('Successfully added unit column and updated paper items');
    
  } catch (error) {
    console.error('Error updating items table:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the update
addUnitColumn();