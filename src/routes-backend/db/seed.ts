import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { getDb } from './client';
import { seedExercise } from './queries';

const db = getDb();
const dir = join(process.cwd(), 'src/content/exercises');

for (const file of readdirSync(dir).filter(f => f.endsWith('.json'))) {
  const exercise = JSON.parse(readFileSync(join(dir, file), 'utf-8'));
  seedExercise(db, exercise);
  console.log(`Seeded: ${exercise.id}`);
}

console.log('Done seeding exercises.');
