CREATE TABLE IF NOT EXISTS events (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_categories (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS league_teams (
    id SERIAL PRIMARY KEY,
    rank INTEGER NOT NULL,
    team TEXT NOT NULL,
    played INTEGER NOT NULL,
    won INTEGER NOT NULL,
    lost INTEGER NOT NULL,
    points INTEGER NOT NULL
);
