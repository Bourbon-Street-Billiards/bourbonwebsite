import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon serves publicly trusted certificates, so verify them.
    ssl: true,
});

export default pool;
