<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  const LANGS = ['', 'python', 'javascript', 'typescript', 'go', 'rust', 'kotlin', 'swift', 'csharp'];
  const TOPICS = ['', 'variables', 'functions', 'classes', 'loops', 'error_handling', 'async', 'generics'];

  let language = data.language;
  let topic = data.topic;

  function navigate() {
    const p = new URLSearchParams();
    if (language) p.set('language', language);
    if (topic) p.set('topic', topic);
    window.location.href = `/exercises?${p}`;
  }
</script>

<svelte:head><title>Exercises — Lang Learning</title></svelte:head>

<main class="container">
  <nav class="breadcrumb"><a href="/">← Home</a></nav>
  <h1>Exercises</h1>

  <div class="filters">
    <select bind:value={language} on:change={navigate}>
      {#each LANGS as l}<option value={l}>{l || 'All languages'}</option>{/each}
    </select>
    <select bind:value={topic} on:change={navigate}>
      {#each TOPICS as t}<option value={t}>{t || 'All topics'}</option>{/each}
    </select>
  </div>

  {#if data.exercises.length === 0}
    <p class="empty">No exercises found for these filters.</p>
  {:else}
    <ul class="list">
      {#each data.exercises as ex}
        <li>
          <a href="/exercises/{ex.id}" class="ex-card">
            <div class="ex-meta">
              <span class="tag">{ex.language}</span>
              <span class="tag">{ex.topic}</span>
              <span class="tag type">{ex.type}</span>
            </div>
            <p class="ex-q">{ex.question}</p>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<style>
  .breadcrumb { padding: 1.5rem 0 0; }
  .breadcrumb a { color: var(--text-dim); font-size: 0.875rem; }
  h1 { font-family: var(--font-mono); font-size: 1.5rem; margin: 0.5rem 0 1rem; }
  .filters { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
  select {
    background: var(--bg2);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.4rem 0.75rem;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
  }
  .list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
  .ex-card {
    display: block;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem 1.25rem;
    text-decoration: none;
    color: var(--text);
    transition: border-color 0.15s;
  }
  .ex-card:hover { border-color: var(--accent); text-decoration: none; }
  .ex-meta { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
  .tag {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
    font-size: 0.7rem;
    font-family: var(--font-mono);
    color: var(--text-dim);
  }
  .tag.type { color: var(--accent2); border-color: var(--accent2); }
  .ex-q { margin: 0; font-size: 0.9rem; }
  .empty { color: var(--text-dim); }
</style>
