import { getDb } from './routes-backend/db/client';
import { seedExercise, getExercises } from './routes-backend/db/queries';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const db = getDb();
if (getExercises(db, {}).length === 0) {
  const dir = join(process.cwd(), 'src/content/exercises');
  for (const file of readdirSync(dir).filter((f: string) => f.endsWith('.json'))) {
    const exercise = JSON.parse(readFileSync(join(dir, file), 'utf-8'));
    seedExercise(db, exercise);
  }
}

export const handle = async ({ event, resolve }: { event: any; resolve: any }) => resolve(event);
