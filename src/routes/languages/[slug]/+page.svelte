<script lang="ts">
  import type { PageData } from './$types';
  import Tooltip from '$lib/components/Tooltip.svelte';

  export let data: PageData;
  const { content: Content, meta } = data;
  const glossary: { term: string; definition: string }[] = (meta.glossary as any) ?? [];
</script>

<svelte:head><title>{meta.name as string} — Lang Learning</title></svelte:head>

<main class="container">
  <nav class="breadcrumb"><a href="/">← Home</a></nav>

  <header>
    <h1>{meta.name as string}</h1>
    <div class="meta-row">
      <span class="tag">typing: {meta.typing as string}</span>
      {#each (meta.paradigms as string[]) as p}
        <span class="tag">{p}</span>
      {/each}
    </div>
    <div class="best-for">
      Best for: {(meta.best_for as string[]).join(', ')}
    </div>
  </header>

  {#if (meta.frameworks as any[]).length}
    <section class="frameworks">
      <h2>Frameworks</h2>
      <div class="fw-grid">
        {#each (meta.frameworks as {name:string;use:string}[]) as fw}
          <div class="fw-card">
            <strong>{fw.name}</strong>
            <span>{fw.use}</span>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  {#if glossary.length}
    <section class="glossary">
      <h2>Glossary</h2>
      <ul>
        {#each glossary as g}
          <li><Tooltip term={g.term} definition={g.definition}>{g.term}</Tooltip> — {g.definition}</li>
        {/each}
      </ul>
    </section>
  {/if}

  <section class="content">
    <svelte:component this={Content} />
  </section>

  {#if (meta.exercises as string[]).length}
    <section class="exercises-link">
      <a href="/exercises?language={meta.slug}">View exercises for {meta.name as string} →</a>
    </section>
  {/if}
</main>

<style>
  .breadcrumb { padding: 1.5rem 0 0; }
  .breadcrumb a { color: var(--text-dim); font-size: 0.875rem; }
  header { padding: 1rem 0 1.5rem; }
  h1 { font-family: var(--font-mono); font-size: 1.75rem; margin: 0 0 0.5rem; }
  .meta-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
  .tag {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.15rem 0.5rem;
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--text-dim);
  }
  .best-for { color: var(--text-dim); font-size: 0.875rem; }
  .frameworks, .glossary { margin: 1.5rem 0; }
  .fw-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .fw-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .fw-card span { color: var(--text-dim); font-size: 0.75rem; }
  .glossary ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.4rem; }
  .content { margin: 2rem 0; }
  .exercises-link { padding-bottom: 3rem; }
</style>
