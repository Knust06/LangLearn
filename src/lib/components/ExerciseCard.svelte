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
          <label
            class:correct={submitted && opt === result?.correct_answer}
            class:wrong={submitted && selected === opt && !result?.is_correct}
          >
            <input type="radio" bind:group={selected} value={opt} disabled={submitted} />
            <span class="opt-text">{opt}</span>
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
    <button class="submit-btn" on:click={submit} disabled={!selected && !fillAnswer}>
      Submit
    </button>
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
    background: var(--surface);
    border: 1px solid var(--border-2);
    border-radius: var(--radius-lg);
    padding: 1.75rem;
  }

  .meta {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 1.25rem;
  }
  .tag {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) / 1.5);
    padding: 0.12rem 0.5rem;
    font-size: 0.68rem;
    font-family: var(--font-mono);
    color: var(--text-dim);
  }

  .question {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-bright);
    margin: 0 0 1.25rem;
  }
  .fill {
    font-family: var(--font-mono);
    font-size: 0.92rem;
  }

  .options {
    list-style: none;
    padding: 0;
    margin: 0 0 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  label {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.6rem 0.9rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text);
    transition: border-color var(--t), background var(--t), color var(--t);
  }
  label:hover {
    border-color: var(--border-2);
  }
  label.correct {
    background: var(--green-soft);
    border-color: var(--green);
    color: var(--green);
  }
  label.wrong {
    background: var(--red-soft);
    border-color: var(--red);
    color: var(--red);
  }
  input[type="radio"] {
    accent-color: var(--cyan);
    flex-shrink: 0;
  }
  .opt-text {
    flex: 1;
  }

  input[type="text"] {
    background: var(--surface-2);
    border: 1px solid var(--border-2);
    border-radius: var(--radius);
    color: var(--cyan);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    padding: 0.2rem 0.6rem;
    width: auto;
    min-width: 6ch;
    text-align: center;
    outline: none;
    transition: border-color var(--t);
    display: inline-block;
    vertical-align: baseline;
  }
  input[type="text"]:focus {
    border-color: var(--cyan-border);
  }
  input.correct-input {
    border-color: var(--green);
    color: var(--green);
  }
  input.wrong-input {
    border-color: var(--red);
    color: var(--red);
  }

  .submit-btn {
    margin-top: 1.25rem;
    background: var(--cyan);
    border: none;
    border-radius: var(--radius);
    color: var(--void);
    font-family: var(--font);
    font-weight: 600;
    font-size: 0.875rem;
    padding: 0.55rem 1.5rem;
    cursor: pointer;
    transition: opacity var(--t);
    letter-spacing: 0.01em;
  }
  .submit-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .submit-btn:not(:disabled):hover {
    opacity: 0.88;
  }

  .feedback {
    margin-top: 1.25rem;
    padding: 0.6rem 0.9rem;
    border-radius: var(--radius);
    font-weight: 600;
    font-size: 0.875rem;
  }
  .feedback.ok {
    background: var(--green-soft);
    color: var(--green);
  }
  .feedback.fail {
    background: var(--red-soft);
    color: var(--red);
  }

  .explanation {
    color: var(--text-dim);
    font-size: 0.82rem;
    font-style: italic;
    margin: 0.75rem 0 0;
    line-height: 1.5;
  }
</style>
