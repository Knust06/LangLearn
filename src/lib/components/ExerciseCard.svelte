<script lang="ts">
  import type { Exercise } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  export let exercise: Exercise;

  const dispatch = createEventDispatcher<{ submit: { answer: string } }>();

  let selected: string = '';
  let fillAnswer: string = '';
  let submitted = false;
  let result: { is_correct: boolean; correct_answer: string; explanation: string } | null = null;

  function submit() {
    const answer = exercise.type === 'multiple_choice' ? selected : fillAnswer;
    if (!answer) return;
    dispatch('submit', { answer });
  }

  export function showResult(r: typeof result) {
    result = r;
    submitted = true;
  }

  function renderFillBlank(question: string): string[] {
    return question.split('___');
  }
</script>

<div class="card">
  <div class="meta">
    <span class="tag">{exercise.language}</span>
    <span class="tag">{exercise.topic}</span>
  </div>

  {#if exercise.type === 'multiple_choice'}
    <p class="question">{exercise.question}</p>
    <ul class="options">
      {#each exercise.options ?? [] as opt}
        <li>
          <label class:correct={submitted && opt === result?.correct_answer} class:wrong={submitted && selected === opt && !result?.is_correct}>
            <input type="radio" bind:group={selected} value={opt} disabled={submitted} />
            {opt}
          </label>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="question fill">
      {#each renderFillBlank(exercise.question) as part, i}
        {part}{#if i < renderFillBlank(exercise.question).length - 1}
          <input
            type="text"
            bind:value={fillAnswer}
            disabled={submitted}
            class:correct-input={submitted && result?.is_correct}
            class:wrong-input={submitted && !result?.is_correct}
            placeholder="___"
          />
        {/if}
      {/each}
    </p>
  {/if}

  {#if !submitted}
    <button on:click={submit} disabled={!selected && !fillAnswer}>Submit</button>
  {/if}

  {#if submitted && result}
    <div class="feedback" class:ok={result.is_correct} class:fail={!result.is_correct}>
      {result.is_correct ? '✓ Correct' : `✗ Incorrect — answer: ${result.correct_answer}`}
    </div>
    <p class="explanation">{result.explanation}</p>
  {/if}
</div>

<style>
  .card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.5rem;
  }
  .meta { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
  .tag {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
    font-size: 0.7rem;
    font-family: var(--font-mono);
    color: var(--text-dim);
  }
  .question { font-size: 1rem; margin: 0 0 1rem; line-height: 1.5; }
  .fill { font-family: var(--font-mono); }
  .options { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: border-color 0.15s;
  }
  label:hover { border-color: var(--accent); }
  label.correct { border-color: var(--success); color: var(--success); }
  label.wrong { border-color: var(--error); color: var(--error); }
  input[type="text"] {
    background: var(--bg3);
    border: 1px solid var(--accent);
    border-radius: 4px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    padding: 0.2rem 0.5rem;
    width: 8ch;
    text-align: center;
  }
  input.correct-input { border-color: var(--success); }
  input.wrong-input { border-color: var(--error); }
  button {
    margin-top: 1rem;
    background: var(--accent);
    border: none;
    border-radius: 4px;
    color: #1e1e1e;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    cursor: pointer;
    font-size: 0.875rem;
  }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  .feedback {
    margin-top: 1rem;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.875rem;
  }
  .feedback.ok { background: #1a3a2a; color: var(--success); }
  .feedback.fail { background: #3a1a1a; color: var(--error); }
  .explanation { color: var(--text-dim); font-size: 0.85rem; margin: 0.5rem 0 0; }
</style>
