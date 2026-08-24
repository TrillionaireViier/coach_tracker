import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // 1. Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        status TEXT NOT NULL,
        rpe INTEGER NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS trainings (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        rpe INTEGER NOT NULL,
        rir INTEGER NOT NULL,
        volume TEXT NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS medical_records (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        issue TEXT NOT NULL,
        "returnDate" TEXT NOT NULL,
        severity TEXT NOT NULL,
        tdee INTEGER NOT NULL,
        expenditure INTEGER NOT NULL
      );
    `;

    // 2. Seed data if empty
    const { count: playerCount } = (await sql`SELECT COUNT(*) FROM players`)[0];
    if (Number(playerCount) === 0) {
      await sql`
        INSERT INTO players (name, position, status, rpe) VALUES 
        ('Олександр Зінченко', 'Захисник', 'Готовий', 8),
        ('Михайло Мудрик', 'Півзахисник', 'Готовий', 9),
        ('Віктор Циганков', 'Півзахисник', 'Травма', 0),
        ('Артем Довбик', 'Нападник', 'Готовий', 7),
        ('Ілля Забарний', 'Захисник', 'Відпочинок', 5);
      `;
    }

    const { count: trainingCount } = (await sql`SELECT COUNT(*) FROM trainings`)[0];
    if (Number(trainingCount) === 0) {
      await sql`
        INSERT INTO trainings (type, time, location, status, rpe, rir, volume) VALUES 
        ('Гіпертрофія (RP)', 'Сьогодні, 10:00', 'Тренажерний зал', 'Завершено', 8, 1, 'MEV'),
        ('Тактика + Кардіо', 'Сьогодні, 16:00', 'Головне поле', 'Заплановано', 6, 3, 'MAV'),
        ('Відновлення', 'Завтра, 11:00', 'Басейн', 'Заплановано', 3, 5, 'Deload'),
        ('Двостороння гра', 'Четвер, 17:00', 'Тренувальна база', 'Заплановано', 9, 0, 'MRV');
      `;
    }

    const { count: medicalCount } = (await sql`SELECT COUNT(*) FROM medical_records`)[0];
    if (Number(medicalCount) === 0) {
      await sql`
        INSERT INTO medical_records (name, issue, "returnDate", severity, tdee, expenditure) VALUES 
        ('Віктор Циганков', 'Розтягнення м''яза', 'через 2 тижні', 'Середня', 2800, 2100),
        ('Тарас Степаненко', 'Забій коліна', 'через 3 дні', 'Легка', 3100, 2400),
        ('Віталій Миколенко', 'Мікротравма', 'Сьогодні (готовий)', 'Готовий', 3400, 3300),
        ('Артем Довбик', '-', '-', 'Готовий', 3800, 3750);
      `;
    }

    return NextResponse.json({ message: 'Database setup complete and seeded!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
