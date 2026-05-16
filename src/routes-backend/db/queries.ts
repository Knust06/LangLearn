import Database from 'better-sqlite3';
import type { Exercise, Attempt, Note, ProgressStat, RecentError } from '$lib/types';

export function createSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      language TEXT NOT NULL,
      topic TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('multiple_choice', 'fill_blank')),
      question TEXT NOT NULL,
      options TEXT,
      correct_answer TEXT NOT NULL,
      explanation TEXT
    );
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id TEXT NOT NULL REFERENCES exercises(id),
      answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      attempted_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref_type TEXT NOT NULL CHECK(ref_type IN ('exercise', 'language')),
      ref_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export function seedExercise(db: Database.Database, ex: Omit<Exercise, 'options'> & { options: string[] | null }): void {
  db.prepare(`
    INSERT OR REPLACE INTO exercises (id, language, topic, type, question, options, correct_answer, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(ex.id, ex.language, ex.topic, ex.type, ex.question, ex.options ? JSON.stringify(ex.options) : null, ex.correct_answer, ex.explanation ?? '');
}

export function getExercises(db: Database.Database, filter: { language?: string; topic?: string }): Exercise[] {
  let sql = 'SELECT * FROM exercises WHERE 1=1';
  const params: string[] = [];
  if (filter.language) { sql += ' AND language = ?'; params.push(filter.language); }
  if (filter.topic) { sql += ' AND topic = ?'; params.push(filter.topic); }
  const rows = db.prepare(sql).all(...params) as any[];
  return rows.map(r => ({ ...r, options: r.options ? JSON.parse(r.options) : null }));
}

export function getExerciseById(db: Database.Database, id: string): Exercise | null {
  const row = db.prepare('SELECT * FROM exercises WHERE id = ?').get(id) as any;
  if (!row) return null;
  return { ...row, options: row.options ? JSON.parse(row.options) : null };
}

export function saveAttempt(db: Database.Database, data: { exercise_id: string; answer: string; is_correct: boolean }): void {
  const now = new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T');
  db.prepare('INSERT INTO attempts (exercise_id, answer, is_correct, attempted_at) VALUES (?, ?, ?, ?)')
    .run(data.exercise_id, data.answer, data.is_correct ? 1 : 0, now);
}

export function getProgressStats(db: Database.Database): ProgressStat[] {
  const rows = db.prepare(`
    SELECT e.language,
           COUNT(*) as total,
           SUM(a.is_correct) as correct
    FROM attempts a
    JOIN exercises e ON e.id = a.exercise_id
    GROUP BY e.language
  `).all() as any[];
  return rows.map(r => ({
    language: r.language,
    total: r.total,
    correct: r.correct,
    accuracy: Math.round((r.correct / r.total) * 100)
  }));
}

export function getRecentErrors(db: Database.Database, limit = 10): RecentError[] {
  return db.prepare(`
    SELECT a.exercise_id, e.question, e.topic, e.language, a.attempted_at
    FROM attempts a
    JOIN exercises e ON e.id = a.exercise_id
    WHERE a.is_correct = 0
    ORDER BY a.attempted_at DESC
    LIMIT ?
  `).all(limit) as RecentError[];
}

export function getNotesFor(db: Database.Database, ref_type: string, ref_id: string): Note[] {
  return db.prepare('SELECT * FROM notes WHERE ref_type = ? AND ref_id = ? ORDER BY created_at DESC')
    .all(ref_type, ref_id) as Note[];
}

export function upsertNote(db: Database.Database, data: { ref_type: 'exercise' | 'language'; ref_id: string; content: string; id?: number }): void {
  const now = new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T');
  if (data.id) {
    db.prepare('UPDATE notes SET content = ?, updated_at = ? WHERE id = ?').run(data.content, now, data.id);
  } else {
    db.prepare('INSERT INTO notes (ref_type, ref_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
      .run(data.ref_type, data.ref_id, data.content, now, now);
  }
}
