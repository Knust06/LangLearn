<script lang="ts">
  import LangComparator from '$lib/components/LangComparator.svelte';
</script>

<svelte:head><title>Compare — Lang Learning</title></svelte:head>

<main class="container">
  <nav class="breadcrumb"><a href="/">← Home</a></nav>
  <h1>Side-by-Side Comparison</h1>
  <LangComparator />
</main>

<style>
  .breadcrumb { padding: 1.5rem 0 0; }
  .breadcrumb a { color: var(--text-dim); font-size: 0.875rem; }
  h1 { font-family: var(--font-mono); font-size: 1.5rem; margin: 0.5rem 0 1.5rem; }
</style>
