const { Pool } = require('pg');

class PgShimPool {
    constructor(config) {
        // Convert mysql config to pg config if needed, 
        // but we'll use connection string from env
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            ssl: { rejectUnauthorized: false }
        });
    }

    async query(sql, params = []) {
        // Convert ? to $1, $2, etc.
        let pgSql = sql;
        let count = 1;
        while (pgSql.includes('?')) {
            pgSql = pgSql.replace('?', `$${count++}`);
        }

        // Handle MySQL specific syntax if necessary (e.g., DESCRIBE -> SELECT * FROM information_schema.columns)
        if (pgSql.trim().toUpperCase().startsWith('DESCRIBE')) {
            const tableName = pgSql.trim().split(' ')[1];
            pgSql = `SELECT column_name as "Field", data_type as "Type", is_nullable as "Null" FROM information_schema.columns WHERE table_name = $1`;
            params = [tableName];
        }

        if (pgSql.trim().toUpperCase().startsWith('SHOW TABLES LIKE')) {
            const pattern = params[0].replace(/%/g, '');
            pgSql = `SELECT table_name FROM information_schema.tables WHERE table_name = $1`;
            params = [pattern];
        }

        const result = await this.pool.query(pgSql, params);

        // Return in [rows, fields] format for mysql2 compatibility
        return [result.rows, result.fields];
    }

    async getConnection() {
        const client = await this.pool.connect();
        return {
            query: async (sql, params = []) => {
                let pgSql = sql;
                let count = 1;
                while (pgSql.includes('?')) {
                    pgSql = pgSql.replace('?', `$${count++}`);
                }
                const result = await client.query(pgSql, params);
                return [result.rows, result.fields];
            },
            beginTransaction: () => client.query('BEGIN'),
            commit: () => client.query('COMMIT'),
            rollback: () => client.query('ROLLBACK'),
            release: () => client.release(),
            end: () => client.release()
        };
    }

    async end() {
        await this.pool.end();
    }
}

module.exports = {
    createPool: (config) => new PgShimPool(config)
};
