import Database from 'better-sqlite3';
import { createSchema } from './queries';

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database('data.db');
    _db.pragma('journal_mode = WAL');
    createSchema(_db);
  }
  return _db;
}
