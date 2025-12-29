import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  description: text('description'),
});

export const menuCategories = pgTable('menu_categories', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
});

export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => menuCategories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: text('price').notNull(),
  description: text('description'),
});

export const leagueTeams = pgTable('league_teams', {
  id: serial('id').primaryKey(),
  rank: integer('rank').notNull(),
  team: text('team').notNull(),
  played: integer('played').default(0),
  won: integer('won').default(0),
  lost: integer('lost').default(0),
  points: integer('points').default(0),
});

export const billiardRates = pgTable('billiard_rates', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  price: text('price').notNull(),
  description: text('description'),
});