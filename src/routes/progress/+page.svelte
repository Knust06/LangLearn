<script lang="ts">
  import type { PageData } from './$types';
  import ProgressChart from '$lib/components/ProgressChart.svelte';
  import { t } from '$lib/stores/locale';

  export let data: PageData;
  const TOPICS = ['', 'variables', 'functions', 'classes', 'loops', 'error_handling', 'async', 'generics'];
  let topic = data.topic;
  function filterByTopic() {
    const p = new URLSearchParams();
    if (topic) p.set('topic', topic);
    window.location.href = `/progress?${p}`;
  }
</script>

<svelte:head><title>{$t.progress.title} — Lang Learning</title></svelte:head>

<main class="container">
  <nav class="breadcrumb"><a href="/">{$t.progress.back}</a></nav>

  <header class="page-header">
    <h1>{$t.progress.title}</h1>
    <select bind:value={topic} on:change={filterByTopic}>
      {#each TOPICS as tp}<option value={tp}>{tp || $t.progress.allTopics}</option>{/each}
    </select>
  </header>

  {#if data.stats.length === 0}
    <div class="empty-state">
      <div class="empty-icon">◎</div>
      <p class="empty-msg">{$t.progress.empty}</p>
      <a href="/exercises" class="empty-cta">{$t.progress.startExercise}</a>
    </div>
  {:else}
    <section class="stats-grid">
      {#each data.stats as stat}
        {@const pct = stat.accuracy}
        <div class="stat-card">
          <span class="lang-label">{stat.language}</span>
          <div class="accuracy" class:green={pct >= 80}>{pct}<span class="pct-sign">%</span></div>
          <div class="sub">{stat.correct}/{stat.total} {$t.progress.correct}</div>
          <div class="bar-track">
            <div class="bar-fill" class:bar-green={pct >= 80} style="width: {pct}%"></div>
          </div>
        </div>
      {/each}
    </section>

    <section class="chart-section">
      <div class="section-label">{$t.progress.evolution}</div>
      <ProgressChart stats={data.stats} />
    </section>

    {#if data.recentErrors.length > 0}
      <section class="errors-section">
        <div class="section-label">{$t.progress.recentErrors}</div>
        <ul class="error-list">
          {#each data.recentErrors as err}
            <li class="error-item">
              <a href="/exercises/{err.exercise_id}" class="error-link">
                <div class="error-pills">
                  <span class="pill">{err.language}</span>
                  <span class="pill">{err.topic}</span>
                </div>
                <p class="error-question">{err.question}</p>
              </a>
              <span class="error-ts">{err.attempted_at}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/if}
</main>

<style>
  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 1.5rem 4rem;
  }

  .breadcrumb {
    padding: 1.5rem 0 0;
  }
  .breadcrumb a {
    color: var(--text-muted);
    font-size: 0.8rem;
    text-decoration: none;
    transition: color var(--t);
    font-family: var(--font-mono);
  }
  .breadcrumb a:hover {
    color: var(--text-dim);
  }

  /* ── Header ── */
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.75rem 0 2rem;
    gap: 1rem;
  }
  h1 {
    font-family: var(--font);
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--text-bright);
    margin: 0;
    letter-spacing: -0.02em;
  }
  .page-header select {
    background: var(--surface-2);
    border: 1px solid var(--border-2);
    color: var(--text);
    padding: 0.45rem 0.85rem;
    border-radius: var(--radius);
    font-size: 0.82rem;
    font-family: var(--font);
    cursor: pointer;
    transition: border-color var(--t), color var(--t);
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23454A6A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.65rem center;
    padding-right: 2rem;
  }
  .page-header select:hover,
  .page-header select:focus {
    border-color: var(--border-3);
    color: var(--text-bright);
  }

  /* ── Empty state ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 5rem 2rem;
    animation: fadeUp 0.4s ease both;
  }
  .empty-icon {
    font-size: 2.5rem;
    color: var(--text-muted);
    line-height: 1;
  }
  .empty-msg {
    color: var(--text-dim);
    font-size: 0.95rem;
    margin: 0;
  }
  .empty-cta {
    display: inline-block;
    background: var(--surface-2);
    border: 1px solid var(--border-2);
    color: var(--cyan);
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius);
    font-size: 0.85rem;
    font-family: var(--font);
    text-decoration: none;
    margin-top: 0.25rem;
    transition: background var(--t), border-color var(--t), color var(--t);
  }
  .empty-cta:hover {
    background: var(--cyan-soft);
    border-color: var(--cyan-border);
    color: var(--text-bright);
  }

  /* ── Stats grid ── */
  .stats-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    margin-bottom: 2.5rem;
    animation: fadeUp 0.35s ease both;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.1rem 1.25rem 0.85rem;
    min-width: 160px;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    transition: border-color var(--t);
  }
  .stat-card:hover {
    border-color: var(--border-2);
  }
  .lang-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.3rem;
  }
  .accuracy {
    font-family: var(--font);
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1;
    color: var(--cyan);
    letter-spacing: -0.04em;
    transition: color var(--t);
  }
  .accuracy.green {
    color: var(--green);
  }
  .pct-sign {
    font-size: 1.1rem;
    font-weight: 600;
    opacity: 0.7;
    margin-left: 1px;
  }
  .sub {
    font-size: 0.72rem;
    color: var(--text-dim);
    font-family: var(--font-mono);
    margin-top: 0.15rem;
    margin-bottom: 0.65rem;
  }
  .bar-track {
    width: 100%;
    height: 3px;
    background: var(--surface-3);
    border-radius: 2px;
    overflow: hidden;
    margin-top: auto;
  }
  .bar-fill {
    height: 100%;
    background: var(--cyan);
    border-radius: 2px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .bar-fill.bar-green {
    background: var(--green);
  }

  /* ── Section label ── */
  .section-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.85rem;
  }

  /* ── Chart ── */
  .chart-section {
    margin-bottom: 2.5rem;
    animation: fadeUp 0.4s 0.05s ease both;
  }

  /* ── Recent Errors ── */
  .errors-section {
    animation: fadeUp 0.4s 0.1s ease both;
  }
  .error-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .error-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 2px solid var(--red);
    border-radius: var(--radius);
    padding: 0.75rem 1rem;
    transition: border-color var(--t), background var(--t);
  }
  .error-item:hover {
    background: var(--surface-2);
    border-color: var(--border-2);
    border-left-color: var(--red);
  }
  .error-link {
    flex: 1;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .error-pills {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }
  .pill {
    background: var(--surface-3);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.08rem 0.5rem;
    font-size: 0.68rem;
    font-family: var(--font-mono);
    color: var(--text-dim);
    letter-spacing: 0.03em;
  }
  .error-question {
    font-size: 0.855rem;
    color: var(--text);
    margin: 0;
    line-height: 1.45;
  }
  .error-link:hover .error-question {
    color: var(--text-bright);
  }
  .error-ts {
    font-size: 0.68rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
    white-space: nowrap;
    flex-shrink: 0;
    padding-top: 0.15rem;
  }
</style>
