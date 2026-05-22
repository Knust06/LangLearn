# LangLearn — Current State

## Implemented Features

| Feature | Status | Notes |
|---|---|---|
| Home — language grid | Done | 8 languages, links to `/languages/[slug]` |
| Lesson pages (`/languages/[slug]`) | Done | mdsvex `.mdx` content, `import.meta.glob` loader |
| Exercise list (`/exercises`) | Done | Filter by language + topic via query params |
| Exercise detail (`/exercises/[id]`) | Done | `multiple_choice` + `fill_blank` types, submit → graded |
| Progress page (`/progress`) | Done | Per-language accuracy cards + Chart.js bar chart + recent errors |
| Progress topic filter | Done | Dropdown → `?topic=` query param reload |
| Notes (per exercise/language) | Done | `NoteEditor` component, upsert via POST `/api/notes` |
| Language Comparator (`/compare`) | Done | Select up to 3 languages, pick topic, side-by-side syntax |
| Design Patterns section | Done | 6 patterns (Singleton, Factory, Observer, Strategy, Decorator, Builder) |
| Dev Methodologies section | Done | Principles + cycle, collapsible examples |
| i18n EN + PT-BR | Done | Full coverage across all pages via `t` store |

## DB Schema

```sql
exercises (id TEXT PK, language, topic, type CHECK('multiple_choice'|'fill_blank'),
           question, options TEXT nullable JSON array, correct_answer, explanation)

attempts (id INTEGER PK AUTOINCREMENT, exercise_id FK→exercises,
          answer, is_correct INTEGER 0|1, attempted_at TEXT ISO-like BRT)

notes (id INTEGER PK AUTOINCREMENT, ref_type CHECK('exercise'|'language'),
       ref_id, content, created_at, updated_at)
```

## Seeded Exercise Data

| File | ID | Language | Topic | Type |
|---|---|---|---|---|
| `py-001.json` | py-001 | python | variables | multiple_choice |
| `py-002.json` | py-002 | python | (check file) | (check file) |
| `py-003.json` | py-003 | python | (check file) | (check file) |
| `js-001.json` | js-001 | javascript | (check file) | (check file) |
| `go-001.json` | go-001 | go | variables | fill_blank |

5 JSON files total. Seed runs via `npm run db:seed` (tsx script). Uses `INSERT OR REPLACE` — safe to re-run.

## Language Lesson Content

8 `.mdx` files in `src/content/languages/`:
`python.mdx`, `javascript.mdx`, `typescript.mdx`, `go.mdx`, `rust.mdx`, `kotlin.mdx`, `swift.mdx`, `csharp.mdx`

## Test Coverage

| File | Scope | Coverage |
|---|---|---|
| `tests/db/queries.test.ts` | DB layer — exercises, attempts, stats, notes | Core CRUD + progress + errors + topic filter |
| `tests/api/exercises.test.ts` | Query filter helpers | Language + topic filters |
| `tests/api/progress.test.ts` | (exists — check content) | — |

Tests use in-memory SQLite (`:memory:`). No UI tests (no Playwright). No API integration tests via HTTP.

## Known Gaps / TODO

- `src/routes-backend/api/` files exist but are not wired to SvelteKit routing (dead code)
- `TODO.md` at project root (check for open items)
- Progress chart uses Chart.js but no time-series — only per-language accuracy snapshots
- No auth, no multi-user — single-user local tool
