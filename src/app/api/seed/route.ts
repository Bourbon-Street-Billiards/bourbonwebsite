import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

        await pool.query(schemaSql);

        // Check if admin exists
        const adminCheck = await pool.query('SELECT * FROM users WHERE username = $1', ['admin']);

        if (adminCheck.rows.length === 0) {
            // Create default admin
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await pool.query(
                'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
                ['admin', hashedPassword]
            );
            console.log('Default admin user created');
        }

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database', details: error }, { status: 500 });
    }
}
