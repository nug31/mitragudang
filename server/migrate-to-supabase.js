const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.production') });

// MySQL Configuration (Old)
const mysqlConfig = {
    host: process.env.OLD_DB_HOST,
    port: parseInt(process.env.OLD_DB_PORT || '3306', 10),
    user: process.env.OLD_DB_USER,
    password: process.env.OLD_DB_PASSWORD,
    database: process.env.OLD_DB_NAME,
};

// PostgreSQL Configuration (New)
const pgConfig = {
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: { rejectUnauthorized: false }
};

async function migrate() {
    let mysqlConn;
    const pgPool = new Pool(pgConfig);

    try {
        console.log('🔗 Connecting to MySQL...');
        mysqlConn = await mysql.createConnection(mysqlConfig);
        console.log('✅ Connected to MySQL');

        console.log('🔗 Connecting to PostgreSQL...');
        const pgClient = await pgPool.connect();
        console.log('✅ Connected to PostgreSQL');

        // Helper to format dates for PG
        const formatDate = (date) => {
            if (!date) return null;
            const d = new Date(date);
            return isNaN(d.getTime()) ? null : d.toISOString();
        };

        // 1. Migrate Users
        console.log('👤 Migrating users...');
        const [users] = await mysqlConn.query('SELECT * FROM users');
        for (const user of users) {
            try {
                await pgClient.query(
                    'INSERT INTO users (id, name, email, password, role, "createdAt") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email',
                    [user.id, user.name || user.username, user.email, user.password, user.role, formatDate(user.createdAt || user.created_at || new Date())]
                );
            } catch (err) {
                console.error(`❌ User ${user.email} failed:`, err.message);
                throw err;
            }
        }
        console.log(`✅ Migrated ${users.length} users`);

        // 2. Migrate Items
        console.log('📦 Migrating items...');
        const [items] = await mysqlConn.query('SELECT * FROM items');
        for (const item of items) {
            try {
                await pgClient.query(
                    `INSERT INTO items (id, name, description, category, quantity, "minQuantity", unit, status, price, "isActive", "lastRestocked", "createdAt") 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING`,
                    [item.id, item.name, item.description, item.category, item.quantity, item.minQuantity || 0, item.unit || 'pcs', item.status, item.price || 0, item.isActive === undefined ? 1 : item.isActive, formatDate(item.lastRestocked), formatDate(item.createdAt || item.created_at || new Date())]
                );
            } catch (err) {
                console.error(`❌ Item ${item.name} failed:`, err.message);
                throw err;
            }
        }
        console.log(`✅ Migrated ${items.length} items`);

        // 3. Migrate Requests
        console.log('📋 Migrating requests...');
        const [requests] = await mysqlConn.query('SELECT * FROM requests');
        for (const req of requests) {
            try {
                const requestId = req.id.toString();
                await pgClient.query(
                    `INSERT INTO requests (id, "project_name", "requester_id", reason, priority, "due_date", status, "createdAt") 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
                    [requestId, req.project_name || req.itemName || 'Untitled Project', req.requester_id || req.userId, req.reason || req.description, req.priority, formatDate(req.due_date || req.requestedDeliveryDate), req.status, formatDate(req.created_at || req.createdAt || new Date())]
                );
            } catch (err) {
                console.error(`❌ Request ${req.id} failed:`, err.message);
                throw err;
            }
        }
        console.log(`✅ Migrated ${requests.length} requests`);

        // 4. Migrate Request Items
        console.log('🔗 Migrating request items...');
        // Check if table exists in MySQL
        const [riTables] = await mysqlConn.query("SHOW TABLES LIKE 'request_items'");
        if (riTables.length > 0) {
            const [reqItems] = await mysqlConn.query('SELECT * FROM request_items');
            for (const ri of reqItems) {
                try {
                    await pgClient.query(
                        'INSERT INTO request_items ("request_id", "item_id", quantity) VALUES ($1, $2, $3)',
                        [ri.request_id, ri.item_id, ri.quantity]
                    );
                } catch (err) {
                    console.error(`❌ Request Item for ${ri.request_id} failed:`, err.message);
                    throw err;
                }
            }
            console.log(`✅ Migrated ${reqItems.length} request items`);
        } else {
            console.log('ℹ️ No request_items table found in MySQL, skipping.');
        }

        // 5. Migrate Stock History
        console.log('📜 Migrating stock history...');
        const [shTables] = await mysqlConn.query("SHOW TABLES LIKE 'stock_history'");
        if (shTables.length > 0) {
            const [history] = await mysqlConn.query('SELECT * FROM stock_history');
            for (const h of history) {
                try {
                    await pgClient.query(
                        `INSERT INTO stock_history ("item_id", "change_type", "quantity_before", "quantity_change", "quantity_after", notes, "created_by", "createdAt") 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [h.item_id, h.change_type, h.quantity_before, h.quantity_change, h.quantity_after, h.notes, h.created_by, formatDate(h.created_at || h.createdAt || new Date())]
                    );
                } catch (err) {
                    console.error(`❌ Stock history entries failed:`, err.message);
                    throw err;
                }
            }
            console.log(`✅ Migrated ${history.length} stock history entries`);
        }

        console.log('🎉 Migration completed successfully!');

        // Update sequences for SERIAL columns
        console.log('🔄 Updating PostgreSQL sequences...');
        // Users is no longer SERIAL if it uses UUID strings
        await pgClient.query("SELECT setval(pg_get_serial_sequence('items', 'id'), (SELECT MAX(id) FROM items))");
        console.log('✅ Sequences updated');

        pgClient.release();
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        if (mysqlConn) await mysqlConn.end();
        await pgPool.end();
    }
}

migrate();
