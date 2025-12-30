import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { saveRates, BilliardRate } from '@/lib/data';

interface BilliardRateRow {
    id: number;
    title: string;
    price: string;
    description: string;
}

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM billiard_rates ORDER BY id ASC');
        const rates = result.rows.map((row: BilliardRateRow) => ({
            id: Number(row.id),
            title: row.title,
            price: row.price,
            description: row.description
        }));
        return NextResponse.json(rates);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const rates: BilliardRate[] = await request.json();
        await saveRates(rates);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save rates' }, { status: 500 });
    }
}
