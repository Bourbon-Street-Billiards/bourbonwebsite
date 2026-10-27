import { z } from 'zod';

const shortText = z.string().trim().min(1).max(200);
// Description columns are nullable, so accept null and store it as ''.
const longText = z.string().max(2000).nullish().transform(v => v ?? '');
const count = z.number().int().min(0).max(100000);

export const eventsSchema = z.array(z.object({
    title: shortText,
    date: shortText,
    description: longText,
})).max(500);

export const menuSchema = z.array(z.object({
    title: shortText,
    items: z.array(z.object({
        name: shortText,
        price: z.string().trim().min(1).max(50),
        description: longText,
    })).max(500),
})).max(100);

export const leagueSchema = z.array(z.object({
    rank: count,
    team: shortText,
    played: count,
    won: count,
    lost: count,
    points: count,
})).max(500);

export const ratesSchema = z.array(z.object({
    title: shortText,
    price: z.string().trim().min(1).max(50),
    description: longText,
})).max(100);
