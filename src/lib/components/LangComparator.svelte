<script lang="ts">
  const SLUGS = ['python', 'javascript', 'typescript', 'go', 'rust', 'kotlin', 'swift', 'csharp'];
  let selected: string[] = ['python', 'javascript'];
  let contents: Record<string, { default: unknown; metadata: Record<string, unknown> }> = {};
  const modules = import.meta.glob('/src/content/languages/*.mdx');

  async function loadLang(slug: string) {
    if (contents[slug]) return;
    const path = `/src/content/languages/${slug}.mdx`;
    contents[slug] = await modules[path]() as any;
  }

  $: selected.forEach(loadLang);

  function toggle(slug: string) {
    if (selected.includes(slug)) {
      if (selected.length > 1) selected = selected.filter(s => s !== slug);
    } else if (selected.length < 3) {
      selected = [...selected, slug];
    }
  }
</script>

<div class="comparator">

  <!-- Selector row -->
  <div class="selector">
    {#each SLUGS as slug}
      <button
        class="pill"
        class:active={selected.includes(slug)}
        class:disabled={!selected.includes(slug) && selected.length >= 3}
        on:click={() => toggle(slug)}
        aria-pressed={selected.includes(slug)}
      >
        <span class="pill-name">{slug}</span>
        {#if selected.includes(slug)}
          <span class="pill-index">{selected.indexOf(slug) + 1}</span>
        {/if}
      </button>
    {/each}

    <span class="selector-hint">
      <span class="hint-count">{selected.length}</span>/3 selected
    </span>
  </div>

  <!-- Divider -->
  <div class="divider"></div>

  <!-- Columns -->
  <div class="columns" style="--cols: {selected.length}">
    {#each selected as slug, i (slug)}
      <div class="column" style="animation-delay: {i * 60}ms">
        {#if contents[slug]}
          {@const mod = contents[slug]}
          <div class="col-header">
            <div class="col-accent"></div>
            <h2 class="col-title">{mod.metadata.name as string ?? slug}</h2>
          </div>
          <div class="col-body">
            <svelte:component this={mod.default} />
          </div>
        {:else}
          <div class="col-header">
            <div class="col-accent"></div>
            <h2 class="col-title skeleton-title" aria-hidden="true">&nbsp;</h2>
          </div>
          <div class="col-body">
            <div class="skeleton-line" style="width: 92%"></div>
            <div class="skeleton-line" style="width: 75%"></div>
            <div class="skeleton-block"></div>
            <div class="skeleton-line" style="width: 85%"></div>
            <div class="skeleton-line" style="width: 60%"></div>
            <div class="skeleton-block"></div>
            <div class="skeleton-line" style="width: 80%"></div>
          </div>
        {/if}
      </div>
    {/each}
  </div>

</div>

<style>
  /* ── Comparator shell ── */
  .comparator {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── Selector row ── */
  .selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 1.25rem;
    animation: fadeUp 0.35s var(--t) both;
  }

  .pill {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.75rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-dim);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    cursor: pointer;
    transition:
      background 0.18s var(--t),
      border-color 0.18s var(--t),
      color 0.18s var(--t),
      box-shadow 0.18s var(--t),
      transform 0.12s var(--t);
    user-select: none;
    letter-spacing: 0.02em;
  }

  .pill:hover:not(.disabled) {
    background: var(--surface-3);
    border-color: var(--border-2);
    color: var(--text);
    transform: translateY(-1px);
  }

  .pill.active {
    background: var(--cyan-soft);
    border-color: var(--cyan-border);
    color: var(--cyan);
    box-shadow: 0 0 10px color-mix(in srgb, var(--cyan) 18%, transparent);
  }

  .pill.active:hover {
    box-shadow: 0 0 16px color-mix(in srgb, var(--cyan) 28%, transparent);
    transform: translateY(-1px);
  }

  .pill.disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  .pill-name {
    line-height: 1;
  }

  .pill-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.1em;
    height: 1.1em;
    border-radius: 50%;
    background: var(--cyan);
    color: var(--void);
    font-size: 0.65rem;
    font-weight: 700;
    line-height: 1;
  }

  .selector-hint {
    font-family: var(--font);
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-left: 0.25rem;
    letter-spacing: 0.02em;
  }

  .hint-count {
    color: var(--cyan);
    font-weight: 700;
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      var(--border-2) 20%,
      var(--border-2) 80%,
      transparent
    );
    margin-bottom: 1.5rem;
  }

  /* ── Columns grid ── */
  .columns {
    display: grid;
    grid-template-columns: repeat(var(--cols, 2), 1fr);
    gap: 1.25rem;
    align-items: start;
  }

  /* ── Single column card ── */
  .column {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    animation: fadeUp 0.4s var(--t) both;
  }

  .col-header {
    display: flex;
    align-items: stretch;
    gap: 0;
    border-bottom: 1px solid var(--border);
    padding: 0;
  }

  .col-accent {
    width: 3px;
    background: var(--cyan);
    flex-shrink: 0;
    border-radius: var(--radius-lg) 0 0 0;
  }

  .col-title {
    font-family: var(--font);
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-bright);
    margin: 0;
    padding: 0.9rem 1.1rem;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .col-body {
    padding: 1.25rem 1.25rem 1.5rem;
    overflow-x: auto;
  }

  /* ── MDX content inside columns ── */
  .col-body :global(h2) {
    font-family: var(--font);
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-bright);
    margin: 1.5rem 0 0.6rem;
    letter-spacing: -0.01em;
  }

  .col-body :global(h2:first-child) {
    margin-top: 0;
  }

  .col-body :global(h3) {
    font-family: var(--font);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text);
    margin: 1.1rem 0 0.4rem;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .col-body :global(p) {
    font-family: var(--font);
    font-size: 0.875rem;
    color: var(--text-dim);
    line-height: 1.65;
    margin: 0 0 0.75rem;
  }

  .col-body :global(ul),
  .col-body :global(ol) {
    padding-left: 1.25rem;
    margin: 0 0 0.75rem;
  }

  .col-body :global(li) {
    font-family: var(--font);
    font-size: 0.875rem;
    color: var(--text-dim);
    line-height: 1.6;
    margin-bottom: 0.25rem;
  }

  .col-body :global(code:not(pre code)) {
    font-family: var(--font-mono);
    font-size: 0.8em;
    color: var(--cyan);
    background: var(--cyan-soft);
    border: 1px solid var(--cyan-border);
    border-radius: 3px;
    padding: 0.1em 0.35em;
  }

  .col-body :global(pre) {
    border-radius: var(--radius);
    margin: 0.75rem 0;
    overflow-x: auto;
    font-size: 0.82rem;
    border: 1px solid var(--border-2);
  }

  .col-body :global(pre code) {
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    font-size: inherit;
  }

  /* ── Skeleton loading ── */
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .skeleton-title {
    width: 7rem;
    height: 1.15rem;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      var(--surface-2) 25%,
      var(--surface-3) 50%,
      var(--surface-2) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
  }

  .skeleton-line {
    height: 0.7rem;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      var(--surface-2) 25%,
      var(--surface-3) 50%,
      var(--surface-2) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
    margin-bottom: 0.6rem;
  }

  .skeleton-block {
    height: 4.5rem;
    border-radius: var(--radius);
    background: linear-gradient(
      90deg,
      var(--surface-2) 25%,
      var(--surface-3) 50%,
      var(--surface-2) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
    margin-bottom: 0.9rem;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .columns {
      grid-template-columns: 1fr !important;
    }
  }
</style>
