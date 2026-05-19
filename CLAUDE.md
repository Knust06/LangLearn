# LangLearn

Language learning app — multi-language lessons (mdsvex), coding exercises (JSON), progress charts, notes, side-by-side language comparison.

## Stack
| Layer | Tech |
|-------|------|
| Framework | SvelteKit 2 · Svelte 5 |
| DB | SQLite · better-sqlite3 (`data.db`) |
| Charts | Chart.js |
| Lessons | mdsvex (`src/content/languages/*.mdx`) |
| Exercises | JSON (`src/content/exercises/*.json`) |
| i18n | Custom (`src/lib/i18n/translations.ts`) |
| Language | TypeScript |
| Tests | Vitest · jsdom |

## Start
```bash
npm install
npm run dev
# http://localhost:5173

# Seed DB (first run only, start.bat does this automatically)
npm run db:seed
```

## Key Files
| File/Dir | Purpose |
|----------|---------|
| `src/routes/` | SvelteKit page routes |
| `src/routes/api/` | API endpoints (exercises, notes, progress) |
| `src/routes-backend/db/client.ts` | SQLite connection |
| `src/routes-backend/db/queries.ts` | SQL queries |
| `src/routes-backend/db/seed.ts` | DB seed script |
| `data.db` | SQLite database (root) |
| `src/content/languages/*.mdx` | mdsvex lesson content per language |
| `src/content/exercises/*.json` | Exercise definitions |
| `src/lib/components/` | Svelte components (ProgressChart, ExerciseCard, LangComparator, etc.) |
| `src/lib/stores/locale.ts` | i18n locale store |
| `src/lib/types/index.ts` | Shared TypeScript types |

## Routes
| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/languages/[slug]` | mdsvex lesson page per language |
| `/exercises` | Exercise listing |
| `/exercises/[id]` | Single exercise |
| `/progress` | Progress chart (Chart.js) |
| `/compare` | Side-by-side language comparison |

## Constraints
- `src/routes-backend/` holds server-only DB logic — never import from client components
- DB seeded via `npm run db:seed` (tsx); `start.bat` auto-seeds on first run
- mdsvex configured in `svelte.config.js`; `.mdx` extension used for lessons
- No port config in vite.config.ts — defaults to 5173
