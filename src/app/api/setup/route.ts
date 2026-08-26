import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // 1. Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        nickname TEXT,
        password TEXT,
        position TEXT NOT NULL,
        access_role TEXT DEFAULT 'Гравець',
        number INTEGER,
        age INTEGER,
        height INTEGER,
        weight INTEGER,
        matches INTEGER DEFAULT 0,
        rating FLOAT DEFAULT 5.0,
        status TEXT DEFAULT 'Готовий',
        rpe INTEGER DEFAULT 5
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        size TEXT,
        date TEXT,
        type TEXT NOT NULL,
        content_url TEXT,
        parent_id INTEGER
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

    await sql`
      CREATE TABLE IF NOT EXISTS microcycle_events (
        id SERIAL PRIMARY KEY,
        team TEXT NOT NULL,
        day_index INTEGER NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        time TEXT NOT NULL,
        highlight BOOLEAN DEFAULT false
      );
    `;

    // 2. Seed data if empty
    const { count: playerCount } = (await sql`SELECT COUNT(*) FROM players`)[0];
    if (Number(playerCount) === 0) {
      await sql`
        INSERT INTO players (name, nickname, password, position, access_role, number, age, height, weight, matches, rating, status, rpe) VALUES 
        ('Олександр Зінченко', 'zinchenko17', 'password123', 'ПЗ', 'Гравець', 17, 19, 175, 64, 34, 8.4, 'Готовий', 8),
        ('Михайло Мудрик', 'mudryk10', 'password123', 'НП', 'Гравець', 10, 19, 175, 61, 28, 7.9, 'Готовий', 9),
        ('Ілля Забарний', 'zabarnyi13', 'password123', 'ЗХ', 'Гравець', 13, 17, 189, 81, 42, 8.1, 'Відпочинок', 5),
        ('Артем Довбик', 'dovbyk9', 'password123', 'НП', 'Гравець', 9, 26, 189, 76, 38, 8.7, 'Готовий', 7),
        ('Андрій Ярмоленко', 'yarmola7', 'password123', 'ПЗ', 'Гравець', 7, 34, 189, 81, 120, 8.5, 'Травма', 0);
      `;
    }
    
    const { count: docsCount } = (await sql`SELECT COUNT(*) FROM documents`)[0];
    if (Number(docsCount) === 0) {
      await sql`
        INSERT INTO documents (name, size, date, type, content_url, parent_id) VALUES 
        ('Документи гравців', '--', 'Вчора', 'folder', NULL, NULL),
        ('Медичні довідки 2026.pdf', '2.4 MB', 'Сьогодні', 'pdf', NULL, 1),
        ('Тактична схема (Кутовий).png', '840 KB', 'Вчора', 'img', NULL, NULL),
        ('Правила команди.docx', '1.2 MB', '12 Серп', 'doc', NULL, NULL);
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

    const { count: microcycleCount } = (await sql`SELECT COUNT(*) FROM microcycle_events`)[0];
    if (Number(microcycleCount) === 0) {
      await sql`
        INSERT INTO microcycle_events (team, day_index, title, type, time, highlight) VALUES 
        ('U-19', 0, 'Сніданок', 'event', '10:00 - 11:30', false),
        ('U-19', 0, 'Тренування (Фізика)', 'training', '10:00 - 11:30', false),
        ('U-19', 1, 'Відновлення', 'medical', '10:00 - 11:30', false),
        ('U-19', 2, 'Сніданок', 'event', '10:00 - 11:30', false),
        ('U-19', 2, 'Тренування (Тактика)', 'training', '10:00 - 11:30', false),
        ('U-19', 2, 'Теорія', 'theory', '10:00 - 11:30', false),
        ('U-19', 4, 'Тренування (Передматчеве)', 'training', '10:00 - 11:30', false),
        ('U-19', 5, 'Гра: Оболонь', 'game', '10:00 - 11:30', true),
        ('U-19', 6, 'Вихідний', 'event', '10:00 - 11:30', false);
      `;
    }

    return NextResponse.json({ message: 'Database setup complete and seeded!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
