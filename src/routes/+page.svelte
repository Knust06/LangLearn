<script lang="ts">
  const languages = [
    { name: 'Python',     slug: 'python',     typing: 'dynamic',            color: '#3572A5' },
    { name: 'JavaScript', slug: 'javascript', typing: 'dynamic',            color: '#f1e05a' },
    { name: 'TypeScript', slug: 'typescript', typing: 'static (structural)', color: '#2b7489' },
    { name: 'Go',         slug: 'go',         typing: 'static',             color: '#00ADD8' },
    { name: 'Rust',       slug: 'rust',       typing: 'static',             color: '#dea584' },
    { name: 'Kotlin',     slug: 'kotlin',     typing: 'static',             color: '#A97BFF' },
    { name: 'Swift',      slug: 'swift',      typing: 'static',             color: '#F05138' },
    { name: 'C#',         slug: 'csharp',     typing: 'static',             color: '#178600' },
  ];
</script>

<svelte:head><title>Lang Learning</title></svelte:head>

<main class="container">
  <header>
    <h1>Lang Learning</h1>
    <p class="subtitle">Compare syntax, explore frameworks, practice with exercises.</p>
    <nav>
      <a href="/compare">Compare →</a>
      <a href="/exercises">Exercises →</a>
      <a href="/progress">Progress →</a>
    </nav>
  </header>

  <section class="grid">
    {#each languages as lang}
      <a href="/languages/{lang.slug}" class="card">
        <span class="dot" style="background:{lang.color}"></span>
        <div>
          <h2>{lang.name}</h2>
          <span class="tag">{lang.typing}</span>
        </div>
      </a>
    {/each}
  </section>
</main>

<style>
  header { padding: 3rem 0 2rem; }
  h1 { font-family: var(--font-mono); font-size: 2rem; margin: 0 0 0.5rem; }
  .subtitle { color: var(--text-dim); margin: 0 0 1rem; }
  nav { display: flex; gap: 1.5rem; }
  nav a { color: var(--accent); font-size: 0.9rem; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    padding-bottom: 3rem;
  }
  .card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.25rem;
    text-decoration: none;
    color: var(--text);
    transition: border-color 0.15s;
  }
  .card:hover { border-color: var(--accent); text-decoration: none; }
  .dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
  h2 { margin: 0 0 0.25rem; font-size: 1rem; }
  .tag {
    font-size: 0.7rem;
    color: var(--text-dim);
    font-family: var(--font-mono);
  }
</style>
