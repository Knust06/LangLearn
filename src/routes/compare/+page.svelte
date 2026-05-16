<script lang="ts">
  import LangComparator from '$lib/components/LangComparator.svelte';
  import DesignPatterns from '$lib/components/DesignPatterns.svelte';
  import DevMethodologies from '$lib/components/DevMethodologies.svelte';
  import { t } from '$lib/stores/locale';
</script>

<svelte:head><title>{$t.compare.title} — Lang Learning</title></svelte:head>

<main class="compare-page">
  <header class="page-header">
    <div class="header-eyebrow">
      <span class="eyebrow-badge">{$t.compare.badge}</span>
    </div>
    <h1 class="page-title">{$t.compare.title}</h1>
    <p class="page-subtitle">{$t.compare.subtitle}</p>
  </header>

  <section class="section">
    <LangComparator />
  </section>

  <div class="section-divider"></div>

  <section class="section" id="patterns">
    <DesignPatterns />
  </section>

  <div class="section-divider"></div>

  <section class="section" id="methodologies">
    <DevMethodologies />
  </section>
</main>

<style>
  .compare-page {
    padding: 2.5rem 2rem 6rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 2.5rem;
    animation: fadeUp 0.4s var(--t) both;
  }

  .header-eyebrow {
    margin-bottom: 0.6rem;
  }

  .eyebrow-badge {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--cyan);
    background: var(--cyan-soft);
    border: 1px solid var(--cyan-border);
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
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
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 0;
    letter-spacing: 0.01em;
  }

  .section {
    animation: fadeUp 0.4s var(--t) both;
  }

  .section-divider {
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      var(--border-2) 15%,
      var(--border-2) 85%,
      transparent
    );
    margin: 3.5rem 0;
  }
</style>
