import { writable, derived } from 'svelte/store';
import { translations, type Locale, type Translation } from '$lib/i18n/translations';

export type { Locale };

export const locale = writable<Locale>('en');

export const t = derived<typeof locale, Translation>(
  locale,
  ($locale) => translations[$locale]
);
