import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getLeague, saveLeague } from '@/lib/data';
import { leagueSchema } from '@/lib/validation';

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        return NextResponse.json(await getLeague());
    } catch (error) {
        console.error('Failed to fetch league:', error);
        return NextResponse.json({ error: 'Failed to fetch league' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const parsed = leagueSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ success: false, error: 'Invalid data', issues: parsed.error.issues }, { status: 400 });
        }
        await saveLeague(parsed.data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save league:', error);
        return NextResponse.json({ success: false, error: 'Failed to save league' }, { status: 500 });
    }
}
