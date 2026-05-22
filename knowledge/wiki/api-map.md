# LangLearn — API Map

All routes under `src/routes/api/`. Active SvelteKit endpoints only (`src/routes-backend/api/` is unused).

## Endpoints

| Method | Path | Query Params | Body | Response |
|---|---|---|---|---|
| GET | `/api/exercises` | `language?`, `topic?` | — | `Exercise[]` |
| GET | `/api/exercises` | `id` | — | `Exercise` or `404` |
| GET | `/api/progress` | `topic?` | — | `{ stats: ProgressStat[], recentErrors: RecentError[] }` |
| POST | `/api/progress` | — | `{ exercise_id, answer }` | `{ is_correct, correct_answer, explanation }` |
| GET | `/api/notes` | `ref_type` (exercise\|language), `ref_id` | — | `Note[]` |
| POST | `/api/notes` | — | `{ ref_type, ref_id, content, id? }` | `{ ok: true }` |

## Types

```ts
Exercise   { id, language, topic, type, question, options, correct_answer, explanation }
Attempt    { id, exercise_id, answer, is_correct, attempted_at }
Note       { id, ref_type, ref_id, content, created_at, updated_at }
ProgressStat { language, total, correct, accuracy }   // accuracy = Math.round(correct/total*100)
RecentError  { exercise_id, question, topic, language, attempted_at }
```

## Grading Logic (POST /api/progress)

```
is_correct = trim(answer).toLowerCase() === trim(correct_answer).toLowerCase()
```
Returns both `correct_answer` and `explanation` for UI feedback regardless of result.

## Notes Upsert Logic (POST /api/notes)

- `id` present → UPDATE content + updated_at
- `id` absent → INSERT new note
- `ref_type` must be `'exercise'` or `'language'` (DB CHECK constraint)
