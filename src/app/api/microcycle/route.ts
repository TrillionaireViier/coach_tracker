import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const team = searchParams.get('team') || 'U-19';
    
    const events = await sql`SELECT * FROM microcycle_events WHERE team = ${team} ORDER BY day_index ASC, id ASC`;
    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { team, day_index, title, type, time, highlight } = body;
    
    const newEvent = await sql`
      INSERT INTO microcycle_events (team, day_index, title, type, time, highlight)
      VALUES (${team}, ${day_index}, ${title}, ${type}, ${time || '10:00 - 11:30'}, ${highlight || false})
      RETURNING *
    `;
    
    return NextResponse.json(newEvent[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, type, time, highlight } = body;
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    const updated = await sql`
      UPDATE microcycle_events
      SET title = ${title}, type = ${type}, time = ${time}, highlight = ${highlight}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    await sql`DELETE FROM microcycle_events WHERE id = ${id}`;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
