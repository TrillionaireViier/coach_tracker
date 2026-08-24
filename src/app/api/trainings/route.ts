import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const trainings = await sql`SELECT * FROM trainings ORDER BY id ASC`;
    return NextResponse.json(trainings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = body.type || "Нове тренування";
    const time = body.time || "Не вказано";
    const location = body.location || "Поле";
    const status = body.status || "Заплановано";
    const rpe = body.rpe || 5;
    const rir = body.rir || 2;
    const volume = body.volume || "MAV";

    const insertQuery = async () => sql`
      INSERT INTO trainings (type, time, location, status, rpe, rir, volume)
      VALUES (${type}, ${time}, ${location}, ${status}, ${rpe}, ${rir}, ${volume})
      RETURNING *
    `;

    try {
      const newTraining = await insertQuery();
      return NextResponse.json(newTraining[0], { status: 201 });
    } catch (dbError: any) {
      if (dbError.message.includes('relation "trainings" does not exist')) {
        // Auto-create table
        await sql`
          CREATE TABLE trainings (
            id SERIAL PRIMARY KEY,
            type VARCHAR(255) NOT NULL,
            time VARCHAR(100),
            location VARCHAR(255),
            status VARCHAR(50),
            rpe INTEGER,
            rir INTEGER,
            volume VARCHAR(50)
          )
        `;
        const newTraining = await insertQuery();
        return NextResponse.json(newTraining[0], { status: 201 });
      } else if (dbError.message.includes('column "rpe" of relation "trainings" does not exist') || dbError.message.includes('column')) {
        // Auto-migrate missing columns
        await sql`ALTER TABLE trainings ADD COLUMN IF NOT EXISTS rpe INTEGER;`;
        await sql`ALTER TABLE trainings ADD COLUMN IF NOT EXISTS rir INTEGER;`;
        await sql`ALTER TABLE trainings ADD COLUMN IF NOT EXISTS volume VARCHAR(50);`;
        
        const newTraining = await insertQuery();
        return NextResponse.json(newTraining[0], { status: 201 });
      }
      throw dbError;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, type, time, location, status, rpe, rir, volume } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const updatedTraining = await sql`
      UPDATE trainings 
      SET type = COALESCE(${type}, type),
          time = COALESCE(${time}, time),
          location = COALESCE(${location}, location),
          status = COALESCE(${status}, status),
          rpe = COALESCE(${rpe}, rpe),
          rir = COALESCE(${rir}, rir),
          volume = COALESCE(${volume}, volume)
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (updatedTraining.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updatedTraining[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await sql`DELETE FROM trainings WHERE id = ${body.id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
