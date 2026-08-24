import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const players = await sql`SELECT * FROM players ORDER BY id ASC`;
    return NextResponse.json(players);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name || "Новий Гравець";
    const position = body.position || "Невідомо";
    const status = body.status || "Готовий";
    const rpe = body.rpe || 0;
    
    const newPlayer = await sql`
      INSERT INTO players (name, position, status, rpe)
      VALUES (${name}, ${position}, ${status}, ${rpe})
      RETURNING *
    `;
    return NextResponse.json(newPlayer[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, position, status, rpe } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const updatedPlayer = await sql`
      UPDATE players 
      SET name = COALESCE(${name}, name),
          position = COALESCE(${position}, position),
          status = COALESCE(${status}, status),
          rpe = COALESCE(${rpe}, rpe)
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (updatedPlayer.length === 0) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPlayer[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
