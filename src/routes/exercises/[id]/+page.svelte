<script lang="ts">
  import type { PageData } from './$types';
  import ExerciseCard from '$lib/components/ExerciseCard.svelte';
  import NoteEditor from '$lib/components/NoteEditor.svelte';

  export let data: PageData;
  let card: ExerciseCard;

  async function handleSubmit(e: CustomEvent<{ answer: string }>) {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ exercise_id: data.exercise.id, answer: e.detail.answer })
    });
    const result = await res.json();
    card.showResult(result);
  }
</script>

<svelte:head><title>Exercise {data.exercise.id} — Lang Learning</title></svelte:head>

<main class="container">
  <nav class="breadcrumb"><a href="/exercises">← Exercises</a></nav>

  <header class="page-header">
    <span class="ex-id">{data.exercise.id}</span>
  </header>

  <div class="wrapper">
    <ExerciseCard bind:this={card} exercise={data.exercise} on:submit={handleSubmit} />
    <div class="notes-area">
      <NoteEditor refType="exercise" refId={data.exercise.id} />
    </div>
  </div>
</main>

<style>
  .breadcrumb {
    padding: 1.5rem 0 0;
  }
  .breadcrumb a {
    color: var(--text-dim);
    font-size: 0.875rem;
    text-decoration: none;
    transition: color var(--t);
  }
  .breadcrumb a:hover {
    color: var(--text);
  }

  .page-header {
    margin: 1.25rem 0 1.5rem;
    animation: fadeUp 0.35s ease both;
  }
  .ex-id {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--text-muted);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.25rem 0.65rem;
    letter-spacing: 0.04em;
  }

  .wrapper {
    max-width: 640px;
    margin: 0 0 3rem;
    animation: fadeUp 0.4s 0.05s ease both;
  }

  .notes-area {
    margin-top: 2rem;
  }
</style>
