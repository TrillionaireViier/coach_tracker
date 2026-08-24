import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const records = await sql`SELECT * FROM matches ORDER BY id ASC`;
    return NextResponse.json(records);
  } catch (error: any) {
    if (error.message.includes('relation "matches" does not exist')) {
      await sql`
        CREATE TABLE matches (
          id SERIAL PRIMARY KEY,
          opponent VARCHAR(255) NOT NULL,
          type VARCHAR(50),
          date VARCHAR(100),
          location VARCHAR(255),
          status VARCHAR(50)
        )
      `;
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const opponent = body.opponent || "Невідомий суперник";
    const type = body.type || "Домашній";
    const date = body.date || "28 Серпня, 19:00";
    const location = body.location || "Олімпійський Стадіон";
    const status = body.status || "Заплановано";

    const newMatch = await sql`
      INSERT INTO matches (opponent, type, date, location, status)
      VALUES (${opponent}, ${type}, ${date}, ${location}, ${status})
      RETURNING *
    `;
    return NextResponse.json(newMatch[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, opponent, type, date, location, status } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const updatedMatch = await sql`
      UPDATE matches 
      SET opponent = COALESCE(${opponent}, opponent),
          type = COALESCE(${type}, type),
          date = COALESCE(${date}, date),
          location = COALESCE(${location}, location),
          status = COALESCE(${status}, status)
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (updatedMatch.length === 0) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedMatch[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
