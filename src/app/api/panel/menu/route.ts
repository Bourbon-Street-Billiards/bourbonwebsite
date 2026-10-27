import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth/admin';
import { saveMenu, MenuCategory } from '@/lib/data';

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

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const categoriesRes = await pool.query('SELECT * FROM menu_categories ORDER BY id ASC');
        const itemsRes = await pool.query('SELECT * FROM menu_items');

        const menu: MenuCategory[] = categoriesRes.rows.map((cat: MenuCategoryRow) => ({
            title: cat.title,
            items: itemsRes.rows
                .filter((item: MenuItemRow) => item.category_id === cat.id)
                .map((item: MenuItemRow) => ({
                    name: item.name,
                    price: item.price,
                    description: item.description
                }))
        }));

        return NextResponse.json(menu);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const menu: MenuCategory[] = await request.json();
        await saveMenu(menu);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save menu' }, { status: 500 });
    }
}
