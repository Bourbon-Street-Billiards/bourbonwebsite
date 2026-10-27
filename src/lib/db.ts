import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon serves publicly trusted certificates, so verify them.
    ssl: true,
    // Fail fast instead of hanging a page render when the database is slow or unreachable,
    // so callers like readOrEmpty can fall back to empty content.
    connectionTimeoutMillis: 5000,
    query_timeout: 10000,
    statement_timeout: 10000,
});

export default pool;
