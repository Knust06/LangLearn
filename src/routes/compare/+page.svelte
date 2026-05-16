<script lang="ts">
  import LangComparator from '$lib/components/LangComparator.svelte';
</script>

<svelte:head><title>Compare — Lang Learning</title></svelte:head>

<main class="compare-page">
  <header class="page-header">
    <h1 class="page-title">Compare</h1>
    <p class="page-subtitle">Select 2–3 languages to see them side by side</p>
  </header>
  <LangComparator />
</main>

<style>
  .compare-page {
    padding: 2.5rem 2rem 4rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 2.5rem;
    animation: fadeUp 0.4s var(--t) both;
  }

  .page-title {
    font-family: var(--font);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    color: var(--text-bright);
    margin: 0 0 0.4rem;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .page-subtitle {
    font-family: var(--font);
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0;
    letter-spacing: 0.01em;
  }
</style>
