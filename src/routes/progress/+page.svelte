<script lang="ts">
  import type { PageData } from './$types';
  import ProgressChart from '$lib/components/ProgressChart.svelte';

  export let data: PageData;
</script>

<svelte:head><title>Progress — Lang Learning</title></svelte:head>

<main class="container">
  <nav class="breadcrumb"><a href="/">← Home</a></nav>
  <h1>Progress</h1>

  {#if data.stats.length === 0}
    <p class="empty">No attempts yet. <a href="/exercises">Start an exercise →</a></p>
  {:else}
    <section class="cards">
      {#each data.stats as stat}
        <div class="stat-card">
          <h2>{stat.language}</h2>
          <div class="accuracy">{stat.accuracy}%</div>
          <div class="sub">{stat.correct}/{stat.total} correct</div>
        </div>
      {/each}
    </section>

    <section class="chart-section">
      <h2>Overview</h2>
      <div class="chart-wrap">
        <ProgressChart stats={data.stats} />
      </div>
    </section>

    {#if data.recentErrors.length > 0}
      <section class="errors">
        <h2>Recent Errors</h2>
        <ul>
          {#each data.recentErrors as err}
            <li>
              <a href="/exercises/{err.exercise_id}">
                <span class="tag">{err.language}</span>
                <span class="tag">{err.topic}</span>
                {err.question}
              </a>
              <span class="ts">{err.attempted_at}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/if}
</main>

<style>
  .breadcrumb { padding: 1.5rem 0 0; }
  .breadcrumb a { color: var(--text-dim); font-size: 0.875rem; }
  h1 { font-family: var(--font-mono); font-size: 1.5rem; margin: 0.5rem 0 1.5rem; }
  .empty { color: var(--text-dim); }
  .cards { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
  .stat-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.25rem;
    min-width: 140px;
    text-align: center;
  }
  .stat-card h2 { font-family: var(--font-mono); font-size: 0.9rem; margin: 0 0 0.5rem; color: var(--text-dim); }
  .accuracy { font-size: 2rem; font-weight: 700; color: var(--accent2); }
  .sub { font-size: 0.75rem; color: var(--text-dim); margin-top: 0.25rem; }
  .chart-section { margin-bottom: 2rem; }
  .chart-section h2 { font-family: var(--font-mono); font-size: 1rem; margin-bottom: 1rem; }
  .chart-wrap { max-width: 600px; }
  .errors ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .errors li { display: flex; align-items: baseline; gap: 0.75rem; font-size: 0.875rem; }
  .errors a { color: var(--text); text-decoration: none; display: flex; gap: 0.4rem; align-items: baseline; flex-wrap: wrap; }
  .errors a:hover { color: var(--accent); }
  .tag {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 4px;
    padding: 0.1rem 0.4rem; font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-dim);
  }
  .ts { font-size: 0.7rem; color: var(--text-dim); white-space: nowrap; }
</style>
