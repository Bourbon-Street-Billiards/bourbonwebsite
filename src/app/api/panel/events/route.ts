import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getEvents, saveEvents } from '@/lib/data';
import { eventsSchema } from '@/lib/validation';

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        return NextResponse.json(await getEvents());
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const parsed = eventsSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ success: false, error: 'Invalid data', issues: parsed.error.issues }, { status: 400 });
        }
        await saveEvents(parsed.data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save events:', error);
        return NextResponse.json({ success: false, error: 'Failed to save events' }, { status: 500 });
    }
}
