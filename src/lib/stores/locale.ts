import { writable, derived } from 'svelte/store';
import { translations, type Locale, type Translation } from '$lib/i18n/translations';

export type { Locale };

const STORAGE_KEY = 'locale';
const stored =
  typeof localStorage !== 'undefined'
    ? (localStorage.getItem(STORAGE_KEY) as Locale | null)
    : null;
const initial: Locale = stored === 'en' || stored === 'pt' ? stored : 'en';

export const locale = writable<Locale>(initial);

locale.subscribe((value) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, value);
});

export const t = derived<typeof locale, Translation>(
  locale,
  ($locale) => translations[$locale]
);
