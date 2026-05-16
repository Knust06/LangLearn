<script lang="ts">
  import type { PageData } from './$types';
  import { t } from '$lib/stores/locale';
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

<svelte:head><title>{$t.exercises.title} — Lang Learning</title></svelte:head>

<main class="container">
  <nav class="breadcrumb"><a href="/">{$t.exercises.back}</a></nav>

  <header class="page-header">
    <h1>{$t.exercises.title}</h1>
    <p class="subtitle">{$t.exercises.subtitle}</p>
  </header>

  <div class="filters">
    <div class="filter-group">
      <label class="filter-label" for="lang-select">{$t.exercises.filterLang}</label>
      <select id="lang-select" bind:value={language} on:change={navigate}>
        {#each LANGS as l}<option value={l}>{l || $t.exercises.allLangs}</option>{/each}
      </select>
    </div>
    <div class="filter-group">
      <label class="filter-label" for="topic-select">{$t.exercises.filterTopic}</label>
      <select id="topic-select" bind:value={topic} on:change={navigate}>
        {#each TOPICS as tp}<option value={tp}>{tp || $t.exercises.allTopics}</option>{/each}
      </select>
    </div>
  </div>

  {#if data.exercises.length === 0}
    <div class="empty">
      <span class="empty-icon">⊘</span>
      <p>{$t.exercises.empty}</p>
    </div>
  {:else}
    <ul class="list">
      {#each data.exercises as ex}
        <li class="list-item">
          <a href="/exercises/{ex.id}" class="ex-card" class:type-mc={ex.type === 'multiple_choice'} class:type-fb={ex.type === 'fill_blank'}>
            <span class="rail"></span>
            <div class="card-body">
              <div class="ex-meta">
                <span class="tag">{ex.language}</span>
                <span class="tag">{ex.topic}</span>
              </div>
              <p class="ex-q">{ex.question}</p>
            </div>
            <span class="arrow">→</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
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
    margin: 1.5rem 0 2rem;
    animation: fadeUp 0.4s ease both;
  }
  h1 {
    font-family: var(--font);
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--text-bright);
    margin: 0 0 0.35rem;
    letter-spacing: -0.02em;
  }
  .subtitle {
    color: var(--text-dim);
    font-size: 0.9rem;
    margin: 0;
  }

  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    animation: fadeUp 0.4s 0.05s ease both;
  }
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .filter-label {
    font-family: var(--font);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-dim);
  }
  select {
    background: var(--surface-2);
    border: 1px solid var(--border-2);
    color: var(--text);
    padding: 0.45rem 0.8rem;
    border-radius: var(--radius);
    font-family: var(--font);
    font-size: 0.82rem;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.6rem center;
    padding-right: 1.8rem;
    transition: border-color var(--t), background var(--t);
    outline: none;
  }
  select:hover {
    border-color: var(--border-3);
  }
  select:focus {
    border-color: var(--cyan-border);
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .list-item {
    animation: fadeUp 0.35s ease both;
  }
  .list-item:nth-child(1) { animation-delay: 0.08s; }
  .list-item:nth-child(2) { animation-delay: 0.13s; }
  .list-item:nth-child(3) { animation-delay: 0.18s; }
  .list-item:nth-child(4) { animation-delay: 0.23s; }
  .list-item:nth-child(5) { animation-delay: 0.28s; }
  .list-item:nth-child(n+6) { animation-delay: 0.3s; }

  .ex-card {
    display: flex;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    text-decoration: none;
    color: var(--text);
    overflow: hidden;
    transition: background var(--t), border-color var(--t);
    position: relative;
  }
  .ex-card:hover {
    background: var(--surface-2);
    border-color: var(--border-2);
  }

  .rail {
    width: 3px;
    align-self: stretch;
    flex-shrink: 0;
    background: var(--border-2);
    transition: background var(--t);
  }
  .type-mc .rail { background: var(--cyan); }
  .type-fb .rail { background: var(--green); }

  .card-body {
    flex: 1;
    padding: 0.85rem 1rem;
    min-width: 0;
  }
  .ex-meta {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 0.45rem;
  }
  .tag {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) / 1.5);
    padding: 0.1rem 0.45rem;
    font-size: 0.68rem;
    font-family: var(--font-mono);
    color: var(--text-dim);
  }
  .ex-q {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-bright);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow {
    padding: 0 1rem;
    color: var(--text-muted);
    font-size: 1rem;
    flex-shrink: 0;
    transition: color var(--t), transform var(--t);
  }
  .ex-card:hover .arrow {
    color: var(--cyan);
    transform: translateX(2px);
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 4rem 0;
    color: var(--text-muted);
    animation: fadeUp 0.4s ease both;
  }
  .empty-icon {
    font-size: 2rem;
    opacity: 0.4;
  }
  .empty p {
    margin: 0;
    font-size: 0.9rem;
  }
</style>
