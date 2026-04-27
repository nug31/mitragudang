const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.production') });

const pgConfig = {
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: { rejectUnauthorized: false }
};

async function checkCategoriesDetailed() {
    const pool = new Pool(pgConfig);
    try {
        const client = await pool.connect();
        
        console.log('Checking categories table detailed info...');
        const result = await client.query(`
            SELECT 
                column_name, 
                data_type, 
                is_nullable, 
                column_default,
                is_identity
            FROM information_schema.columns 
            WHERE table_name = 'categories'
            ORDER BY ordinal_position;
        `);
        
        console.table(result.rows);
        
        const constraints = await client.query(`
            SELECT conname, contype
            FROM pg_constraint
            JOIN pg_class ON pg_class.oid = pg_constraint.conrelid
            WHERE relname = 'categories';
        `);
        console.log('Constraints:', constraints.rows);

        client.release();
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

checkCategoriesDetailed();
