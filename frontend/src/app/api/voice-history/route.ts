import { db } from '@/lib/db';
import { historyTable, InsertVoiceHistory } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body: InsertVoiceHistory = await request.json();

    const result = await db.insert(historyTable).values(body).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Detailed error inserting voice history:', error);
    return NextResponse.json(
      {
        error: 'Failed to insert voice history',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await db.select().from(historyTable);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching voice history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voice history' },
      { status: 500 }
    );
  }
}
