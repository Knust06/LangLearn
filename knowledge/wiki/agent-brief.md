# LangLearn — Agent Brief

## Architecture (5 sentences)

SvelteKit 2 + Svelte 5 app where pages live in `src/routes/` and all DB access lives in `src/routes-backend/` (server-only). Lesson content is `.mdx` files loaded via `import.meta.glob` in `+page.ts` loaders; exercises are JSON files seeded into SQLite via `npm run db:seed`. Three API routes (`/api/exercises`, `/api/progress`, `/api/notes`) proxy between client pages and `better-sqlite3`; client `+page.ts` files call these via `fetch`. Progress tracking compares trimmed, lowercased answer strings — no ML. i18n uses a single `locale` Svelte store with a `derived` translation object covering EN and PT-BR.

## Non-Obvious Constraints

| Constraint | Detail |
|---|---|
| `src/routes-backend/` is server-only | Never import from client `.svelte` components — no `$lib` alias, direct path imports only from `+server.ts` files |
| Lesson extension must be `.mdx` | `svelte.config.js` registers `.mdx` + `.md`; `import.meta.glob` pattern hardcoded to `*.mdx` in `languages/[slug]/+page.ts` |
| No Vite port config | Port not set in `vite.config.ts` — defaults to 5173; do not add `server.port` without verifying start.bat |
| DB path is CWD-relative | `new Database('data.db')` — must run from project root; breaks if cwd changes |
| Timestamps use BRT (America/Sao_Paulo) | `saveAttempt` and `upsertNote` use `toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })` |
| Answer grading is string comparison | `trim().toLowerCase()` both sides — no fuzzy match, no partial credit |
| `routes-backend/api/` is dead code | `src/routes-backend/api/` mirrors `src/routes/api/` but is NOT wired to SvelteKit routing; only `src/routes/api/` is active |

## Navigation

```
src/
  routes/
    +page.svelte              # Home — language grid
    compare/+page.svelte      # LangComparator + DesignPatterns + DevMethodologies
    exercises/
      +page.svelte / +page.ts # Exercise list with language/topic filters
      [id]/+page.svelte       # Single exercise + NoteEditor
    languages/[slug]/
      +page.svelte / +page.ts # mdsvex lesson renderer
    progress/
      +page.svelte / +page.ts # Stats cards + Chart.js + recent errors
    api/
      exercises/+server.ts    # GET list or single
      progress/+server.ts     # GET stats, POST attempt
      notes/+server.ts        # GET notes, POST upsert
  routes-backend/
    db/
      client.ts               # singleton getDb()
      queries.ts              # all SQL: schema, CRUD, stats
      seed.ts                 # reads src/content/exercises/*.json → DB
  lib/
    components/               # ExerciseCard, ProgressChart, LangComparator, NoteEditor, ...
    i18n/translations.ts      # EN + PT-BR strings
    stores/locale.ts          # writable locale + derived t
    types/index.ts            # Exercise, Attempt, Note, ProgressStat, RecentError
  content/
    languages/*.mdx           # 8 lesson files
    exercises/*.json          # exercise definitions (seeded to DB)
```
