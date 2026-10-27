import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getLeague, saveLeague, LeagueTeam } from '@/lib/data';

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
        const league: LeagueTeam[] = await request.json();
        await saveLeague(league);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save league:', error);
        return NextResponse.json({ success: false, error: 'Failed to save league' }, { status: 500 });
    }
}
