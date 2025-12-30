import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { saveEvents, Event } from '@/lib/data';

interface EventRow {
    id: number;
    title: string;
    date: string;
    description: string;
}

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY id DESC');
        const events = result.rows.map((row: EventRow) => ({
            id: Number(row.id),
            title: row.title,
            date: row.date,
            description: row.description
        }));
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const events: Event[] = await request.json();
        await saveEvents(events);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save events' }, { status: 500 });
    }
}
