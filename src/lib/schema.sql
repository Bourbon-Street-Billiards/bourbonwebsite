-- Enable UUID extension if needed (optional, but good for IDs)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS menu_categories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS league_teams (
    id SERIAL PRIMARY KEY,
    rank INTEGER NOT NULL,
    team VARCHAR(255) NOT NULL,
    played INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
