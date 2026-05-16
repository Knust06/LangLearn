import type { PageLoad } from './$types';
import type { Exercise } from '$lib/types';

export const load: PageLoad = async ({ fetch, url }) => {
  const language = url.searchParams.get('language') ?? '';
  const topic = url.searchParams.get('topic') ?? '';

  const params = new URLSearchParams();
  if (language) params.set('language', language);
  if (topic) params.set('topic', topic);

  const res = await fetch(`/api/exercises?${params}`);
  const exercises: Exercise[] = await res.json();
  return { exercises, language, topic };
};
