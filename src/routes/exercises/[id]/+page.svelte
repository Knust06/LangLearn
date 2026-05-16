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
  <div class="wrapper">
    <ExerciseCard bind:this={card} exercise={data.exercise} on:submit={handleSubmit} />
    <NoteEditor refType="exercise" refId={data.exercise.id} />
  </div>
</main>

<style>
  .breadcrumb { padding: 1.5rem 0 0; }
  .breadcrumb a { color: var(--text-dim); font-size: 0.875rem; }
  .wrapper { max-width: 640px; margin: 1.5rem 0 3rem; }
</style>
