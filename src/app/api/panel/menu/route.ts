import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getMenu, saveMenu, MenuCategory } from '@/lib/data';

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        return NextResponse.json(await getMenu());
    } catch (error) {
        console.error('Failed to fetch menu:', error);
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
        console.error('Failed to save menu:', error);
        return NextResponse.json({ success: false, error: 'Failed to save menu' }, { status: 500 });
    }
}
