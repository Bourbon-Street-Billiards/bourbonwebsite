import { z } from 'zod';

// Shared with the panel editors (maxLength, min) so the client never sends what the server rejects.
export const LIMITS = {
    title: 300,
    price: 50,
    description: 5000,
    count: 100000,
};

const shortText = z.string().trim().min(1).max(LIMITS.title);
const price = z.string().trim().min(1).max(LIMITS.price);
// Description columns are nullable, so accept null and store it as ''.
const longText = z.string().max(LIMITS.description).nullish().transform(v => v ?? '');
// League stat columns are nullable too; treat null as 0.
const count = z.number().int().min(0).max(LIMITS.count).nullish().transform(v => v ?? 0);

export const eventsSchema = z.array(z.object({
    title: shortText,
    date: shortText,
    description: longText,
})).max(500);

export const menuSchema = z.array(z.object({
    title: shortText,
    items: z.array(z.object({
        name: shortText,
        price,
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
    price,
    description: longText,
})).max(100);
