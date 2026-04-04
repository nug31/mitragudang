/**
 * Script to create the stock_history table in Railway MySQL
 * Run with: node create-stock-history-table.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'nozomi.proxy.rlwy.net',
    port: parseInt(process.env.DB_PORT || '21817'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'railway',
};

async function createStockHistoryTable() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected successfully');

        // Create the stock_history table
        const createTableSQL = `
      CREATE TABLE IF NOT EXISTS stock_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT NOT NULL,
        change_type ENUM('opening', 'restock', 'request', 'adjustment', 'closing') NOT NULL,
        quantity_before INT NOT NULL,
        quantity_change INT NOT NULL,
        quantity_after INT NOT NULL,
        reference_id VARCHAR(100) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        created_by VARCHAR(36) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_item_id (item_id),
        INDEX idx_change_type (change_type),
        INDEX idx_created_at (created_at),
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `;

        console.log('Creating stock_history table...');
        await connection.query(createTableSQL);
        console.log('✅ stock_history table created successfully!');

        // Verify the table was created
        const [tables] = await connection.query("SHOW TABLES LIKE 'stock_history'");
        if (tables.length > 0) {
            console.log('✅ Table verified in database');

            // Show table structure
            const [columns] = await connection.query('DESCRIBE stock_history');
            console.log('\nTable structure:');
            columns.forEach(col => {
                console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
            });
        }

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\nConnection closed');
        }
    }
}

createStockHistoryTable();
