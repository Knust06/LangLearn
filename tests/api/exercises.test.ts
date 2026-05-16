import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { createSchema, seedExercise, getExercises } from '../../src/routes-backend/db/queries';

let db: Database.Database;

beforeEach(() => {
  db = new Database(':memory:');
  createSchema(db);
  seedExercise(db, { id: 'py-001', language: 'python', topic: 'variables', type: 'multiple_choice', question: 'Q', options: ['a', 'b'], correct_answer: 'a', explanation: 'E' });
  seedExercise(db, { id: 'go-001', language: 'go', topic: 'variables', type: 'fill_blank', question: 'Q2', options: null, correct_answer: ':=', explanation: 'E2' });
});

it('returns all exercises unfiltered', () => {
  expect(getExercises(db, {})).toHaveLength(2);
});

it('filters by language', () => {
  const results = getExercises(db, { language: 'go' });
  expect(results).toHaveLength(1);
  expect(results[0].id).toBe('go-001');
});

it('filters by topic', () => {
  const results = getExercises(db, { topic: 'variables' });
  expect(results).toHaveLength(2);
});
