import type { PoolClient } from 'pg';
import pool from './db';

export type Event = {
    id: number;
    title: string;
    date: string;
    description: string;
};

export type MenuItem = {
    name: string;
    price: string;
    description: string;
};

export type MenuCategory = {
    title: string;
    items: MenuItem[];
};

export type LeagueTeam = {
    rank: number;
    team: string;
    played: number;
    won: number;
    lost: number;
    points: number;
};

export type BilliardRate = {
    id: number;
    title: string;
    price: string;
    description: string;
};

export type AppData = {
    events: Event[];
    menu: MenuCategory[];
    league: LeagueTeam[];
    rates: BilliardRate[];
};

// Database row types. These are type aliases, not interfaces: pg's query<T>() needs an
// implicit index signature, which interfaces don't get.
type MenuCategoryRow = {
    id: number;
    title: string;
};

type MenuItemRow = {
    category_id: number;
    name: string;
    price: string;
    description: string;
};

// Readers. Rows are returned in the order they were saved from the panel.

export async function getEvents(): Promise<Event[]> {
    const { rows } = await pool.query<Event>("SELECT id, title, date, COALESCE(description, '') AS description FROM events ORDER BY id ASC");
    return rows.map(row => ({ ...row, id: Number(row.id) }));
}

export async function getMenu(): Promise<MenuCategory[]> {
    const [categoriesRes, itemsRes] = await Promise.all([
        pool.query<MenuCategoryRow>('SELECT id, title FROM menu_categories ORDER BY id ASC'),
        pool.query<MenuItemRow>("SELECT category_id, name, price, COALESCE(description, '') AS description FROM menu_items ORDER BY id ASC"),
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
        `SELECT rank, team, COALESCE(played, 0) AS played, COALESCE(won, 0) AS won,
                COALESCE(lost, 0) AS lost, COALESCE(points, 0) AS points
         FROM league_teams ORDER BY rank ASC, id ASC`
    );
    return rows;
}

export async function getRates(): Promise<BilliardRate[]> {
    const { rows } = await pool.query<BilliardRate>("SELECT id, title, price, COALESCE(description, '') AS description FROM billiard_rates ORDER BY id ASC");
    return rows.map(row => ({ ...row, id: Number(row.id) }));
}

// For public pages: never throws, so a database outage renders an empty section instead of crashing.
export async function readOrEmpty<T>(read: () => Promise<T[]>): Promise<T[]> {
    try {
        return await read();
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

// Writers. Each one replaces the whole table inside a transaction.
// Events and rates get explicit sequential ids: the live tables may have no id default,
// and sequential ids keep rows in panel order.

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
        for (const [index, event] of events.entries()) {
            await client.query(
                'INSERT INTO events (id, title, date, description) VALUES ($1, $2, $3, $4)',
                [index + 1, event.title, event.date, event.description]
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
        for (const [index, rate] of rates.entries()) {
            await client.query(
                'INSERT INTO billiard_rates (id, title, price, description) VALUES ($1, $2, $3, $4)',
                [index + 1, rate.title, rate.price, rate.description]
            );
        }
    });
}
