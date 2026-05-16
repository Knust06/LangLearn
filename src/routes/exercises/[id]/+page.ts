import type { PageLoad } from './$types';
import type { Exercise } from '$lib/types';

export const load: PageLoad = async ({ params, fetch }) => {
  const res = await fetch(`/api/exercises?id=${params.id}`);
  if (!res.ok) throw new Error('Exercise not found');
  const exercise: Exercise = await res.json();
  return { exercise };
};
