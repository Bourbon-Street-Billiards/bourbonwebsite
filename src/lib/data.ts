import type { PoolClient } from 'pg';
import pool from './db';

export interface Event {
    id: number;
    title: string;
    date: string;
    description: string;
}

export interface MenuItem {
    name: string;
    price: string;
    description: string;
}

export interface MenuCategory {
    title: string;
    items: MenuItem[];
}

export interface LeagueTeam {
    rank: number;
    team: string;
    played: number;
    won: number;
    lost: number;
    points: number;
}

export interface BilliardRate {
    id: number;
    title: string;
    price: string;
    description: string;
}

export interface AppData {
    events: Event[];
    menu: MenuCategory[];
    league: LeagueTeam[];
    rates: BilliardRate[];
}

// Database row types
interface MenuCategoryRow {
    id: number;
    title: string;
}

interface MenuItemRow {
    category_id: number;
    name: string;
    price: string;
    description: string;
}

// Readers. Rows are returned in the order they were saved from the panel
// (ids are assigned by the database on insert).

export async function getEvents(): Promise<Event[]> {
    const { rows } = await pool.query<Event>('SELECT id, title, date, description FROM events ORDER BY id ASC');
    return rows.map(row => ({ ...row, id: Number(row.id) }));
}

export async function getMenu(): Promise<MenuCategory[]> {
    const [categoriesRes, itemsRes] = await Promise.all([
        pool.query<MenuCategoryRow>('SELECT id, title FROM menu_categories ORDER BY id ASC'),
        pool.query<MenuItemRow>('SELECT category_id, name, price, description FROM menu_items ORDER BY id ASC'),
    ]);

    return categoriesRes.rows.map(cat => ({
        title: cat.title,
        items: itemsRes.rows
            .filter(item => item.category_id === cat.id)
            .map(({ name, price, description }) => ({ name, price, description })),
    }));
}

export async function getLeague(): Promise<LeagueTeam[]> {
    const { rows } = await pool.query<LeagueTeam>(
        'SELECT rank, team, played, won, lost, points FROM league_teams ORDER BY rank ASC, id ASC'
    );
    return rows;
}

export async function getRates(): Promise<BilliardRate[]> {
    const { rows } = await pool.query<BilliardRate>('SELECT id, title, price, description FROM billiard_rates ORDER BY id ASC');
    return rows.map(row => ({ ...row, id: Number(row.id) }));
}

// For public pages: never throws, so a database outage renders empty sections instead of crashing.
export async function getData(): Promise<AppData> {
    try {
        const [events, menu, league, rates] = await Promise.all([getEvents(), getMenu(), getLeague(), getRates()]);
        return { events, menu, league, rates };
    } catch (error) {
        console.error('Database Error:', error);
        return { events: [], menu: [], league: [], rates: [] };
    }
}

// Writers. Each one replaces the whole table inside a transaction.

async function inTransaction(work: (client: PoolClient) => Promise<void>) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await work(client);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function saveEvents(events: Omit<Event, 'id'>[]) {
    await inTransaction(async client => {
        await client.query('TRUNCATE events RESTART IDENTITY');
        for (const event of events) {
            await client.query(
                'INSERT INTO events (title, date, description) VALUES ($1, $2, $3)',
                [event.title, event.date, event.description]
            );
        }
    });
}

export async function saveMenu(menu: MenuCategory[]) {
    await inTransaction(async client => {
        await client.query('TRUNCATE menu_categories, menu_items RESTART IDENTITY CASCADE');
        for (const category of menu) {
            const catRes = await client.query(
                'INSERT INTO menu_categories (title) VALUES ($1) RETURNING id',
                [category.title]
            );
            const catId = catRes.rows[0].id;
            for (const item of category.items) {
                await client.query(
                    'INSERT INTO menu_items (category_id, name, price, description) VALUES ($1, $2, $3, $4)',
                    [catId, item.name, item.price, item.description]
                );
            }
        }
    });
}

export async function saveLeague(league: LeagueTeam[]) {
    await inTransaction(async client => {
        await client.query('TRUNCATE league_teams RESTART IDENTITY');
        for (const team of league) {
            await client.query(
                'INSERT INTO league_teams (rank, team, played, won, lost, points) VALUES ($1, $2, $3, $4, $5, $6)',
                [team.rank, team.team, team.played, team.won, team.lost, team.points]
            );
        }
    });
}

export async function saveRates(rates: Omit<BilliardRate, 'id'>[]) {
    await inTransaction(async client => {
        await client.query('TRUNCATE billiard_rates RESTART IDENTITY');
        for (const rate of rates) {
            await client.query(
                'INSERT INTO billiard_rates (title, price, description) VALUES ($1, $2, $3)',
                [rate.title, rate.price, rate.description]
            );
        }
    });
}
