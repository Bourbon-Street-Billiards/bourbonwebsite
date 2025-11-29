import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Define the structure for the application data
interface AppData {
    events: { id: number; title: string; date: string; description: string }[];
    menu: {
        title: string;
        items: { name: string; price: string; description: string }[];
    }[];
    league: { rank: number; team: string; played: number; won: number; lost: number; points: number }[];
    rates: { id: number; title: string; price: string; description: string }[];
}

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

        // Define default application data
        const data: AppData = {
            events: [
                { id: 1, title: 'Friday Night Tournament', date: 'Every Friday, 7PM', description: 'Weekly 8-ball tournament. $20 entry fee.' },
                { id: 2, title: 'Live Music: The Rollers', date: 'Oct 25, 9PM', description: 'Local rock band playing classic hits.' }
            ],
            menu: [
                {
                    title: 'Starters',
                    items: [
                        { name: 'Nachos Supreme', price: '16.00', description: 'Tortilla chips, cheese, jalapeños, olives, salsa, sour cream.' },
                        { name: 'Chicken Wings', price: '14.00', description: '1lb of wings with your choice of sauce.' }
                    ]
                },
                {
                    title: 'Mains',
                    items: [
                        { name: 'Bourbon Burger', price: '18.00', description: 'Homemade patty, bourbon BBQ sauce, onion rings, cheddar.' },
                        { name: 'Steak Sandwich', price: '22.00', description: '6oz sirloin on garlic toast with fries.' }
                    ]
                }
            ],
            league: [
                { rank: 1, team: 'Cue Masters', played: 10, won: 8, lost: 2, points: 24 },
                { rank: 2, team: 'Rack & Roll', played: 10, won: 7, lost: 3, points: 21 },
                { rank: 3, team: 'Chalk It Up', played: 10, won: 5, lost: 5, points: 15 }
            ],
            rates: [
                { id: 1, title: 'Standard Rate', price: '$12.00/hr', description: 'Per table. Prorated by the minute.' },
                { id: 2, title: 'Student Rate', price: '$10.00/hr', description: 'Valid with student ID. Mon-Thu only.' },
                { id: 3, title: 'League Practice', price: '$8.00/hr', description: 'For registered league members.' }
            ]
        };

        // Insert default rates if they don't exist
        for (const rate of data.rates) {
            const rateCheck = await pool.query('SELECT * FROM billiard_rates WHERE id = $1', [rate.id]);
            if (rateCheck.rows.length === 0) {
                await pool.query(
                    'INSERT INTO billiard_rates (id, title, price, description) VALUES ($1, $2, $3, $4)',
                    [rate.id, rate.title, rate.price, rate.description]
                );
                console.log(`Default rate '${rate.title}' created`);
            }
        }

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database', details: error }, { status: 500 });
    }
}
