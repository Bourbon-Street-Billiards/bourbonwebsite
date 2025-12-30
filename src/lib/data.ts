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
interface EventRow {
    id: number;
    title: string;
    date: string;
    description: string;
}

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

interface LeagueTeamRow {
    rank: number;
    team: string;
    played: number;
    won: number;
    lost: number;
    points: number;
}

interface BilliardRateRow {
    id: number;
    title: string;
    price: string;
    description: string;
}

export async function getData(): Promise<AppData> {
    try {
        const [eventsRes, leagueRes, categoriesRes, itemsRes, ratesRes] = await Promise.all([
            pool.query('SELECT * FROM events ORDER BY id DESC'),
            pool.query('SELECT * FROM league_teams ORDER BY rank ASC'),
            pool.query('SELECT * FROM menu_categories ORDER BY id ASC'),
            pool.query('SELECT * FROM menu_items'),
            pool.query('SELECT * FROM billiard_rates ORDER BY id ASC')
        ]);

        const menu: MenuCategory[] = categoriesRes.rows.map((cat: MenuCategoryRow) => {
            return {
                title: cat.title,
                items: itemsRes.rows
                    .filter((item: MenuItemRow) => item.category_id === cat.id)
                    .map((item: MenuItemRow) => ({
                        name: item.name,
                        price: item.price,
                        description: item.description
                    }))
            };
        });

        // Fallback for empty DB to avoid breaking UI on first load
        if (eventsRes.rows.length === 0 && leagueRes.rows.length === 0 && menu.length === 0 && ratesRes.rows.length === 0) {
            return { events: [], menu: [], league: [], rates: [] };
        }

        return {
            events: eventsRes.rows.map((row: EventRow) => ({
                id: Number(row.id),
                title: row.title,
                date: row.date,
                description: row.description
            })),
            menu,
            league: leagueRes.rows.map((row: LeagueTeamRow) => ({
                rank: row.rank,
                team: row.team,
                played: row.played,
                won: row.won,
                lost: row.lost,
                points: row.points
            })),
            rates: ratesRes.rows.map((row: BilliardRateRow) => ({
                id: Number(row.id),
                title: row.title,
                price: row.price,
                description: row.description
            }))
        };
    } catch (error) {
        console.error('Database Error:', error);
        // Return empty structure on error to prevent crash, but log it
        return { events: [], menu: [], league: [], rates: [] };
    }
}

export async function saveData(data: AppData) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Clear existing data (full replace strategy)
        await client.query('TRUNCATE events, menu_categories, menu_items, league_teams, billiard_rates RESTART IDENTITY CASCADE');

        // Insert Events
        for (const event of data.events) {
            await client.query(
                'INSERT INTO events (id, title, date, description) VALUES ($1, $2, $3, $4)',
                [event.id, event.title, event.date, event.description]
            );
        }

        // Insert Menu
        for (const category of data.menu) {
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

        // Insert League
        for (const team of data.league) {
            await client.query(
                'INSERT INTO league_teams (rank, team, played, won, lost, points) VALUES ($1, $2, $3, $4, $5, $6)',
                [team.rank, team.team, team.played, team.won, team.lost, team.points]
            );
        }

        // Insert Rates
        for (const rate of data.rates) {
            await client.query(
                'INSERT INTO billiard_rates (id, title, price, description) VALUES ($1, $2, $3, $4)',
                [rate.id, rate.title, rate.price, rate.description]
            );
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Individual save functions for granular updates
export async function saveEvents(events: Event[]) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('TRUNCATE events RESTART IDENTITY CASCADE');
        for (const event of events) {
            await client.query(
                'INSERT INTO events (id, title, date, description) VALUES ($1, $2, $3, $4)',
                [event.id, event.title, event.date, event.description]
            );
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function saveMenu(menu: MenuCategory[]) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
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
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function saveLeague(league: LeagueTeam[]) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('TRUNCATE league_teams RESTART IDENTITY CASCADE');
        for (const team of league) {
            await client.query(
                'INSERT INTO league_teams (rank, team, played, won, lost, points) VALUES ($1, $2, $3, $4, $5, $6)',
                [team.rank, team.team, team.played, team.won, team.lost, team.points]
            );
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function saveRates(rates: BilliardRate[]) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('TRUNCATE billiard_rates RESTART IDENTITY CASCADE');
        for (const rate of rates) {
            await client.query(
                'INSERT INTO billiard_rates (id, title, price, description) VALUES ($1, $2, $3, $4)',
                [rate.id, rate.title, rate.price, rate.description]
            );
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

