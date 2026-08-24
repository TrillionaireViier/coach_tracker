import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const records = await sql`SELECT * FROM medical_records ORDER BY id ASC`;
    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name || "Невідомий Гравець";
    const issue = body.issue || "-";
    const returnDate = body.returnDate || "-";
    const severity = body.severity || "Готовий";
    const tdee = body.tdee || 3000;
    const expenditure = body.expenditure || 0;

    const newRecord = await sql`
      INSERT INTO medical_records (name, issue, "returnDate", severity, tdee, expenditure)
      VALUES (${name}, ${issue}, ${returnDate}, ${severity}, ${tdee}, ${expenditure})
      RETURNING *
    `;
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, issue, severity, tdee, expenditure } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const updatedRecord = await sql`
      UPDATE medical_records 
      SET issue = COALESCE(${issue}, issue),
          severity = COALESCE(${severity}, severity),
          tdee = COALESCE(${tdee}, tdee),
          expenditure = COALESCE(${expenditure}, expenditure)
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (updatedRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedRecord[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
