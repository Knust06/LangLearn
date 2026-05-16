import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { createSchema, seedExercise, getExercises, saveAttempt, getProgressStats, getRecentErrors, getNotesFor, upsertNote } from '../../src/routes-backend/db/queries';

let db: Database.Database;

beforeEach(() => {
  db = new Database(':memory:');
  createSchema(db);
});

afterEach(() => {
  db.close();
});

describe('exercises', () => {
  it('returns seeded exercises', () => {
    seedExercise(db, {
      id: 'py-001',
      language: 'python',
      topic: 'variables',
      type: 'multiple_choice',
      question: 'Which keyword declares a variable?',
      options: ['var', 'let', 'none needed', 'dim'],
      correct_answer: 'none needed',
      explanation: 'Python uses dynamic typing, no keyword needed.'
    });
    const rows = getExercises(db, {});
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe('py-001');
  });

  it('filters by language', () => {
    seedExercise(db, { id: 'py-001', language: 'python', topic: 'variables', type: 'multiple_choice', question: 'Q', options: ['a'], correct_answer: 'a', explanation: '' });
    seedExercise(db, { id: 'go-001', language: 'go', topic: 'variables', type: 'multiple_choice', question: 'Q2', options: ['b'], correct_answer: 'b', explanation: '' });
    const rows = getExercises(db, { language: 'python' });
    expect(rows).toHaveLength(1);
    expect(rows[0].language).toBe('python');
  });
});

describe('attempts', () => {
  it('saves an attempt and returns progress stats', () => {
    seedExercise(db, { id: 'py-001', language: 'python', topic: 'variables', type: 'multiple_choice', question: 'Q', options: ['a', 'b'], correct_answer: 'a', explanation: '' });
    saveAttempt(db, { exercise_id: 'py-001', answer: 'a', is_correct: true });
    const stats = getProgressStats(db);
    expect(stats).toHaveLength(1);
    expect(stats[0].language).toBe('python');
    expect(stats[0].correct).toBe(1);
    expect(stats[0].total).toBe(1);
    expect(stats[0].accuracy).toBe(100);
  });

  it('returns recent errors', () => {
    seedExercise(db, { id: 'py-001', language: 'python', topic: 'variables', type: 'multiple_choice', question: 'Q', options: ['a', 'b'], correct_answer: 'a', explanation: '' });
    saveAttempt(db, { exercise_id: 'py-001', answer: 'b', is_correct: false });
    const errors = getRecentErrors(db);
    expect(errors).toHaveLength(1);
    expect(errors[0].exercise_id).toBe('py-001');
  });
});

describe('notes', () => {
  it('saves and retrieves a note', () => {
    upsertNote(db, { ref_type: 'language', ref_id: 'python', content: 'Remember GIL' });
    const notes = getNotesFor(db, 'language', 'python');
    expect(notes).toHaveLength(1);
    expect(notes[0].content).toBe('Remember GIL');
  });
});
