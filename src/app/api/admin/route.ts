import { NextResponse } from 'next/server';
import { getData, saveData, AppData } from '@/lib/data';

export async function GET() {
    const data = await getData();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic validation could go here
        await saveData(body as AppData);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
    }
}
