import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDb } from '../../../routes-backend/db/client';
import { getExercises, getExerciseById } from '../../../routes-backend/db/queries';

export const GET: RequestHandler = ({ url }) => {
  const db = getDb();
  const id = url.searchParams.get('id');
  if (id) {
    const exercise = getExerciseById(db, id);
    if (!exercise) return new Response('Not found', { status: 404 });
    return json(exercise);
  }
  const language = url.searchParams.get('language') ?? undefined;
  const topic = url.searchParams.get('topic') ?? undefined;
  return json(getExercises(db, { language, topic }));
};
