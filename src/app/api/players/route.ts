import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const players = await sql`SELECT * FROM players ORDER BY id DESC`;
    return NextResponse.json(players);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, nickname, password, position, accessRole, number, age, height, weight } = body;
    
    const newPlayer = await sql`
      INSERT INTO players (name, nickname, password, position, access_role, number, age, height, weight)
      VALUES (${name}, ${nickname}, ${password}, ${position}, ${accessRole || 'Гравець'}, ${number || null}, ${age || null}, ${height || null}, ${weight || null})
      RETURNING *
    `;
    
    return NextResponse.json(newPlayer[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, nickname, password, position, accessRole, number, age, height, weight } = body;
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    const updated = await sql`
      UPDATE players
      SET name = ${name}, nickname = ${nickname}, password = ${password}, position = ${position}, access_role = ${accessRole}, number = ${number}, age = ${age}, height = ${height}, weight = ${weight}
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
    
    await sql`DELETE FROM players WHERE id = ${id}`;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
