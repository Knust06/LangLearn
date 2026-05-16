<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';

  let { children } = $props();

  const links = [
    { href: '/',          label: 'Home' },
    { href: '/compare',   label: 'Compare' },
    { href: '/exercises', label: 'Exercises' },
    { href: '/progress',  label: 'Progress' },
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
</svelte:head>

<header class="topbar">
  <div class="topbar-inner container">
    <a href="/" class="wordmark">
      <span class="wordmark-symbol">&lt;/&gt;</span>
      <span class="wordmark-text">codex</span>
    </a>
    <nav class="nav">
      {#each links as link}
        <a
          href={link.href}
          class="nav-link"
          class:active={$page.url.pathname === link.href || ($page.url.pathname.startsWith(link.href) && link.href !== '/')}
        >{link.label}</a>
      {/each}
    </nav>
  </div>
</header>

<main>
  {@render children()}
</main>

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(5, 5, 8, 0.82);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }

  .topbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
  }

  .wordmark {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-bright);
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: lowercase;
    opacity: 1;
  }
  .wordmark:hover { opacity: 1; }
  .wordmark-symbol { color: var(--cyan); font-size: 0.75rem; }
  .wordmark-text {
    background: linear-gradient(90deg, var(--text-bright), var(--cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-link {
    position: relative;
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius);
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--text-dim);
    transition: color var(--t), background var(--t);
    opacity: 1;
  }
  .nav-link:hover { color: var(--text); background: var(--surface-2); opacity: 1; }
  .nav-link.active { color: var(--text-bright); background: var(--surface-2); }
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background: var(--cyan);
    border-radius: 99px;
  }

  main { min-height: calc(100vh - 52px); }
</style>
