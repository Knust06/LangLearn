import type { PageLoad } from './$types';
import type { ProgressData } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/progress');
  const data: ProgressData = await res.json();
  return data;
};
