<script lang="ts">
  import { onMount } from 'svelte';

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
  <div class="selector">
    {#each SLUGS as slug}
      <button
        class:active={selected.includes(slug)}
        on:click={() => toggle(slug)}
      >{slug}</button>
    {/each}
    <span class="hint">(select 2–3)</span>
  </div>

  <div class="columns" style="grid-template-columns: repeat({selected.length}, 1fr)">
    {#each selected as slug}
      {#if contents[slug]}
        {@const mod = contents[slug]}
        <div class="column">
          <h2>{mod.metadata.name as string}</h2>
          <svelte:component this={mod.default} />
        </div>
      {:else}
        <div class="column loading">Loading {slug}…</div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    align-items: center;
  }
  .selector button {
    background: var(--bg2);
    border: 1px solid var(--border);
    color: var(--text-dim);
    padding: 0.3rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    transition: all 0.15s;
  }
  .selector button.active {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--bg3);
  }
  .hint { font-size: 0.75rem; color: var(--text-dim); margin-left: 0.5rem; }
  .columns {
    display: grid;
    gap: 1.5rem;
    align-items: start;
  }
  .column {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.25rem;
    overflow: auto;
  }
  .column h2 {
    font-family: var(--font-mono);
    font-size: 1rem;
    margin: 0 0 1rem;
    color: var(--accent);
  }
  .loading { color: var(--text-dim); padding: 2rem; text-align: center; }
</style>
