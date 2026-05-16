<script lang="ts">
  import type { PageData } from './$types';
  import Tooltip from '$lib/components/Tooltip.svelte';

  export let data: PageData;
  const { content: Content, meta } = data;
  const glossary: { term: string; definition: string }[] = (meta.glossary as any) ?? [];
</script>

<svelte:head><title>{meta.name as string} — Lang Learning</title></svelte:head>

<main class="container page">

  <a href="/languages" class="back-link">← Languages</a>

  <!-- ── Header ─────────────────────────────────────────────── -->
  <header class="lang-header">
    <h1 class="lang-title">{meta.name as string}</h1>

    <div class="tag-row">
      <span class="pill pill--accent">typing: {meta.typing as string}</span>
      {#each (meta.paradigms as string[]) as p}
        <span class="pill">{p}</span>
      {/each}
    </div>

    <p class="best-for">
      <span class="best-for__label">best for</span>
      {(meta.best_for as string[]).join(' · ')}
    </p>
  </header>

  <!-- ── Frameworks ─────────────────────────────────────────── -->
  {#if (meta.frameworks as any[]).length}
    <section class="section section--frameworks">
      <h2 class="section-title">Frameworks</h2>
      <div class="fw-row">
        {#each (meta.frameworks as {name:string;use:string}[]) as fw}
          <div class="fw-card">
            <strong class="fw-name">{fw.name}</strong>
            <span class="fw-use">{fw.use}</span>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- ── Glossary ────────────────────────────────────────────── -->
  {#if glossary.length}
    <section class="section section--glossary">
      <h2 class="section-title">Glossary</h2>
      <dl class="glossary-list">
        {#each glossary as g}
          <div class="glossary-entry">
            <dt class="glossary-term">
              <Tooltip term={g.term} definition={g.definition}>{g.term}</Tooltip>
            </dt>
            <dd class="glossary-def">{g.definition}</dd>
          </div>
        {/each}
      </dl>
    </section>
  {/if}

  <!-- ── MDX Content ─────────────────────────────────────────── -->
  <section class="section section--content">
    <div class="content-body">
      <svelte:component this={Content} />
    </div>
  </section>

  <!-- ── Exercises CTA ──────────────────────────────────────── -->
  {#if (meta.exercises as string[]).length}
    <section class="section section--exercises">
      <a href="/exercises?language={meta.slug}" class="exercises-btn">
        View exercises for {meta.name as string}
        <span class="exercises-btn__arrow">→</span>
      </a>
    </section>
  {/if}

</main>

<style>
  /* ── Page shell ──────────────────────────────────────────── */
  .page {
    padding-top: 2.5rem;
    padding-bottom: 6rem;
  }

  /* ── Back link ───────────────────────────────────────────── */
  .back-link {
    display: inline-block;
    font-size: 0.8rem;
    color: var(--text-dim);
    letter-spacing: 0.03em;
    transition: color var(--t);
    animation: fadeUp 0.4s ease both;
  }
  .back-link:hover {
    color: var(--text);
    opacity: 1;
  }

  /* ── Header ──────────────────────────────────────────────── */
  .lang-header {
    padding: 2.5rem 0 2rem;
    border-bottom: 1px solid var(--border);
    animation: fadeUp 0.45s ease 0.05s both;
  }

  .lang-title {
    font-family: var(--font);
    font-weight: 800;
    font-size: clamp(2.4rem, 6vw, 4rem);
    color: var(--text-bright);
    letter-spacing: -0.02em;
    line-height: 1.05;
    margin-bottom: 1.2rem;
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.04em;
    padding: 0.25rem 0.65rem;
    border-radius: 99px;
    border: 1px solid var(--border-2);
    background: var(--surface-2);
    color: var(--text-dim);
    transition: border-color var(--t), color var(--t);
  }
  .pill:hover {
    border-color: var(--border-3);
    color: var(--text);
  }
  .pill--accent {
    border-color: var(--cyan-border);
    background: var(--cyan-soft);
    color: var(--cyan);
  }

  .best-for {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--text-dim);
    letter-spacing: 0.02em;
  }
  .best-for__label {
    display: inline-block;
    text-transform: uppercase;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-right: 0.6rem;
    vertical-align: 0.05em;
  }

  /* ── Sections ────────────────────────────────────────────── */
  .section {
    padding: 2.25rem 0;
    border-bottom: 1px solid var(--border);
  }
  .section:last-child {
    border-bottom: none;
  }

  .section--frameworks { animation: fadeUp 0.45s ease 0.12s both; }
  .section--glossary   { animation: fadeUp 0.45s ease 0.19s both; }
  .section--content    { animation: fadeUp 0.45s ease 0.26s both; }
  .section--exercises  { animation: fadeUp 0.45s ease 0.33s both; border-bottom: none; }

  .section-title {
    font-family: var(--font);
    font-weight: 700;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-muted);
    margin-bottom: 1.25rem;
  }

  /* ── Frameworks ──────────────────────────────────────────── */
  .fw-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .fw-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: var(--surface);
    border: 1px solid var(--border-2);
    border-radius: var(--radius-lg);
    padding: 0.85rem 1.1rem;
    min-width: 10rem;
    transition: transform var(--t), border-color var(--t), box-shadow var(--t);
    cursor: default;
  }
  .fw-card:hover {
    transform: translateY(-3px);
    border-color: var(--border-3);
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  }

  .fw-name {
    font-family: var(--font);
    font-weight: 700;
    font-size: 0.92rem;
    color: var(--text-bright);
  }

  .fw-use {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-dim);
    line-height: 1.45;
  }

  /* ── Glossary ────────────────────────────────────────────── */
  .glossary-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
    gap: 0;
  }

  .glossary-entry {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0.7rem 0;
    border-bottom: 1px solid var(--border);
  }
  .glossary-entry:last-child { border-bottom: none; }

  .glossary-term {
    font-family: var(--font);
    font-weight: 700;
    font-size: 0.88rem;
    color: var(--cyan);
    margin-bottom: 0.2rem;
  }

  .glossary-def {
    font-family: var(--font);
    font-size: 0.83rem;
    color: var(--text-dim);
    line-height: 1.55;
  }

  /* ── MDX Content ─────────────────────────────────────────── */
  .content-body {
    padding-left: 1.5rem;
    border-left: 4px solid var(--border);
  }

  /* Typography within MDX */
  .content-body :global(h1),
  .content-body :global(h2),
  .content-body :global(h3),
  .content-body :global(h4) {
    font-family: var(--font);
    font-weight: 700;
    color: var(--text-bright);
    margin: 2rem 0 0.75rem;
    line-height: 1.25;
  }
  .content-body :global(h2) { font-size: 1.4rem; }
  .content-body :global(h3) { font-size: 1.1rem; }

  .content-body :global(p) {
    font-family: var(--font);
    font-size: 0.95rem;
    color: var(--text);
    line-height: 1.75;
    margin-bottom: 1.1rem;
  }

  .content-body :global(ul),
  .content-body :global(ol) {
    padding-left: 1.4rem;
    margin-bottom: 1.1rem;
  }
  .content-body :global(li) {
    font-size: 0.93rem;
    color: var(--text);
    line-height: 1.7;
    margin-bottom: 0.3rem;
  }

  .content-body :global(a) {
    color: var(--cyan);
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: var(--cyan-border);
  }
  .content-body :global(a:hover) {
    text-decoration-color: var(--cyan);
    opacity: 1;
  }

  /* Inline code — don't touch pre/code from Shiki */
  .content-body :global(:not(pre) > code) {
    font-family: var(--font-mono);
    font-size: 0.82em;
    background: var(--surface-3);
    border: 1px solid var(--border-2);
    border-radius: var(--radius);
    padding: 0.1em 0.4em;
    color: var(--cyan);
  }

  /* Shiki block wrapper */
  .content-body :global(pre) {
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-2);
    margin: 1.25rem 0;
    overflow-x: auto;
  }

  .content-body :global(blockquote) {
    border-left: 3px solid var(--cyan-border);
    background: var(--cyan-soft);
    padding: 0.75rem 1rem;
    border-radius: 0 var(--radius) var(--radius) 0;
    margin: 1.25rem 0;
    color: var(--text-dim);
    font-size: 0.9rem;
  }

  /* ── Exercises CTA ───────────────────────────────────────── */
  .exercises-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-family: var(--font);
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--cyan);
    background: var(--cyan-soft);
    border: 1px solid var(--cyan-border);
    border-radius: var(--radius-lg);
    padding: 0.8rem 1.5rem;
    letter-spacing: 0.01em;
    transition: background var(--t), border-color var(--t), box-shadow var(--t), transform var(--t);
  }
  .exercises-btn:hover {
    background: rgba(0, 217, 255, 0.15);
    border-color: rgba(0, 217, 255, 0.55);
    box-shadow: 0 0 20px var(--cyan-glow);
    transform: translateY(-2px);
    opacity: 1;
  }

  .exercises-btn__arrow {
    transition: transform var(--t);
  }
  .exercises-btn:hover .exercises-btn__arrow {
    transform: translateX(4px);
  }
</style>
