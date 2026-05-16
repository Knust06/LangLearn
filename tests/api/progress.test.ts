import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { createSchema, seedExercise, saveAttempt, getProgressStats, getRecentErrors } from '../../src/routes-backend/db/queries';

let db: Database.Database;

beforeEach(() => {
  db = new Database(':memory:');
  createSchema(db);
  seedExercise(db, { id: 'py-001', language: 'python', topic: 'variables', type: 'multiple_choice', question: 'Q', options: ['a'], correct_answer: 'a', explanation: '' });
});

it('accuracy is 50% after one correct and one wrong', () => {
  saveAttempt(db, { exercise_id: 'py-001', answer: 'a', is_correct: true });
  saveAttempt(db, { exercise_id: 'py-001', answer: 'b', is_correct: false });
  const stats = getProgressStats(db);
  expect(stats[0].accuracy).toBe(50);
  expect(stats[0].total).toBe(2);
});

it('recent errors only returns incorrect attempts', () => {
  saveAttempt(db, { exercise_id: 'py-001', answer: 'a', is_correct: true });
  saveAttempt(db, { exercise_id: 'py-001', answer: 'b', is_correct: false });
  expect(getRecentErrors(db)).toHaveLength(1);
});
