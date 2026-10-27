import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getRates, saveRates } from '@/lib/data';
import { ratesSchema } from '@/lib/validation';

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        return NextResponse.json(await getRates());
    } catch (error) {
        console.error('Failed to fetch rates:', error);
        return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const parsed = ratesSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ success: false, error: 'Invalid data', issues: parsed.error.issues }, { status: 400 });
        }
        await saveRates(parsed.data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save rates:', error);
        return NextResponse.json({ success: false, error: 'Failed to save rates' }, { status: 500 });
    }
}
