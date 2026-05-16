import type { PageLoad } from './$types';
import type { ProgressData } from '$lib/types';

export const load: PageLoad = async ({ fetch, url }) => {
  const topic = url.searchParams.get('topic') ?? '';
  const params = new URLSearchParams();
  if (topic) params.set('topic', topic);
  const res = await fetch(`/api/progress?${params}`);
  const data: ProgressData = await res.json();
  return { ...data, topic };
};
