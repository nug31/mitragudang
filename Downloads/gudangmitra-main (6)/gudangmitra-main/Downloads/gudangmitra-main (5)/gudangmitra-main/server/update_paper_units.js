const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gudang1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

async function updatePaperUnits() {
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database');
    
    // Read and execute SQL file
    const sqlPath = path.join(__dirname, 'update_paper_units.sql');
    const sqlScript = await fs.readFile(sqlPath, 'utf8');
    
    // Execute SQL statements
    const [result] = await connection.query(sqlScript);
    console.log(`Successfully updated ${result.affectedRows} paper items to use 'lembar' as unit`);
    
  } catch (error) {
    console.error('Error updating paper units:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the update
updatePaperUnits();