import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDb } from '../../../routes-backend/db/client';
import { saveAttempt, getProgressStats, getRecentErrors, getExerciseById } from '../../../routes-backend/db/queries';

export const GET: RequestHandler = () => {
  const db = getDb();
  return json({
    stats: getProgressStats(db),
    recentErrors: getRecentErrors(db)
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const db = getDb();
  const body = await request.json();
  const { exercise_id, answer } = body as { exercise_id: string; answer: string };

  const exercise = getExerciseById(db, exercise_id);
  if (!exercise) throw error(404, 'Exercise not found');

  const normalized = (s: string) => s.trim().toLowerCase();
  const is_correct = normalized(answer) === normalized(exercise.correct_answer);
  saveAttempt(db, { exercise_id, answer, is_correct });

  return json({ is_correct, correct_answer: exercise.correct_answer, explanation: exercise.explanation });
};
