import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { saveLeague, LeagueTeam } from '@/lib/data';

interface LeagueTeamRow {
    rank: number;
    team: string;
    played: number;
    won: number;
    lost: number;
    points: number;
}

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM league_teams ORDER BY rank ASC');
        const league = result.rows.map((row: LeagueTeamRow) => ({
            rank: row.rank,
            team: row.team,
            played: row.played,
            won: row.won,
            lost: row.lost,
            points: row.points
        }));
        return NextResponse.json(league);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch league' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const league: LeagueTeam[] = await request.json();
        await saveLeague(league);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save league' }, { status: 500 });
    }
}
