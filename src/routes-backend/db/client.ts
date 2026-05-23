import Database from 'better-sqlite3';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSchema } from './queries';

// Absolute path so the DB resolves to the same file regardless of process.cwd()
// (production builds, Docker, Vercel). Override with DATABASE_PATH if needed.
const DB_PATH =
  process.env.DATABASE_PATH ??
  resolve(dirname(fileURLToPath(import.meta.url)), '../../../data.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    createSchema(_db);
  }
  return _db;
}
