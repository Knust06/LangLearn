<script lang="ts">
  const languages = [
    { name: 'Python',     slug: 'python',     typing: 'dynamic',             color: '#3572A5', icon: 'Py' },
    { name: 'JavaScript', slug: 'javascript', typing: 'dynamic',             color: '#F1E05A', icon: 'JS' },
    { name: 'TypeScript', slug: 'typescript', typing: 'static · structural', color: '#3178C6', icon: 'TS' },
    { name: 'Go',         slug: 'go',         typing: 'static',              color: '#00ADD8', icon: 'Go' },
    { name: 'Rust',       slug: 'rust',       typing: 'static',              color: '#DEA584', icon: 'Rs' },
    { name: 'Kotlin',     slug: 'kotlin',     typing: 'static',              color: '#A97BFF', icon: 'Kt' },
    { name: 'Swift',      slug: 'swift',      typing: 'static',              color: '#F05138', icon: 'Sw' },
    { name: 'C#',         slug: 'csharp',     typing: 'static',              color: '#178600', icon: 'C#' },
  ];

  const features = [
    { href: '/compare',   label: 'Compare',   desc: 'Side-by-side syntax'  },
    { href: '/exercises', label: 'Exercises', desc: 'Test your knowledge'  },
    { href: '/progress',  label: 'Progress',  desc: 'Track accuracy'       },
  ];
</script>

<svelte:head><title>Codex — Language Learning</title></svelte:head>

<div class="page">
  <section class="hero container">
    <div class="hero-eyebrow">
      <span class="badge">v1.0</span>
      <span class="sep">/</span>
      <span class="eyebrow-text">8 languages · syntax · exercises</span>
    </div>
    <h1 class="hero-title">
      Learn every language.<br>
      <span class="gradient-text">Side by side.</span>
    </h1>
    <p class="hero-sub">
      A precision reference for intermediate developers. Compare syntax,
      explore frameworks, drill exercises — all in one place.
    </p>
    <div class="cta-row">
      {#each features as f}
        <a href={f.href} class="cta-card">
          <span class="cta-label">{f.label}</span>
          <span class="cta-desc">{f.desc}</span>
        </a>
      {/each}
    </div>
  </section>

  <section class="langs container">
    <div class="section-head">
      <span class="section-label">Languages</span>
      <span class="section-count">8 covered</span>
    </div>
    <div class="lang-grid">
      {#each languages as lang, i}
        <a
          href="/languages/{lang.slug}"
          class="lang-card"
          style="--lc:{lang.color}; animation-delay:{i * 0.04}s"
        >
          <div class="lang-icon" style="background:color-mix(in srgb,{lang.color} 14%,transparent);color:{lang.color}">
            {lang.icon}
          </div>
          <div class="lang-info">
            <span class="lang-name">{lang.name}</span>
            <span class="lang-typing">{lang.typing}</span>
          </div>
          <svg class="arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      {/each}
    </div>
  </section>
</div>

<style>
  .page { padding-bottom: 5rem; }

  /* Hero */
  .hero { padding: 5rem 0 3.5rem; animation: fadeUp 0.45s ease both; }

  .hero-eyebrow {
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 1.75rem;
    font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim);
  }
  .badge {
    background: var(--cyan-soft); border: 1px solid var(--cyan-border);
    color: var(--cyan); padding: 0.1rem 0.45rem; border-radius: 3px;
    font-size: 0.63rem; font-weight: 700; letter-spacing: 0.06em;
  }
  .sep { opacity: 0.25; }
  .eyebrow-text { color: var(--text-dim); }

  .hero-title {
    font-size: clamp(2.4rem, 5vw, 3.75rem);
    font-weight: 800; letter-spacing: -0.035em; line-height: 1.08;
    margin-bottom: 1.25rem; color: var(--text-bright);
  }
  .gradient-text {
    background: linear-gradient(120deg, var(--cyan) 0%, rgba(0,217,255,0.5) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .hero-sub {
    max-width: 460px; color: var(--text-dim);
    font-size: 0.93rem; margin-bottom: 2.5rem; line-height: 1.75;
  }

  /* CTA row */
  .cta-row { display: flex; gap: 0.65rem; flex-wrap: wrap; }
  .cta-card {
    display: flex; flex-direction: column; gap: 0.18rem;
    background: var(--surface); border: 1px solid var(--border-2);
    border-radius: var(--radius-lg); padding: 0.85rem 1.2rem; min-width: 144px;
    opacity: 1; text-decoration: none;
    transition: border-color var(--t), background var(--t), transform var(--t);
  }
  .cta-card:hover {
    border-color: var(--border-3); background: var(--surface-2);
    transform: translateY(-2px); opacity: 1;
  }
  .cta-label { font-size: 0.85rem; font-weight: 700; color: var(--text-bright); }
  .cta-desc  { font-size: 0.71rem; color: var(--text-dim); }

  /* Language grid */
  .langs { margin-top: 1rem; }
  .section-head { display: flex; align-items: baseline; gap: 0.9rem; margin-bottom: 1.1rem; }
  .section-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); }
  .section-count { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); }

  .lang-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1px; background: var(--border);
    border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden;
  }

  .lang-card {
    display: flex; align-items: center; gap: 0.9rem;
    background: var(--surface); padding: 1rem 1.2rem;
    color: var(--text); text-decoration: none; opacity: 1;
    border-left: 2px solid transparent;
    transition: background var(--t), border-color var(--t);
    animation: fadeUp 0.4s ease both;
  }
  .lang-card:hover { background: var(--surface-2); border-left-color: var(--lc); opacity: 1; }
  .lang-card:hover .arrow { color: var(--lc); transform: translateX(2px); }

  .lang-icon {
    width: 36px; height: 36px; border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
    flex-shrink: 0; letter-spacing: -0.02em;
  }
  .lang-info { flex: 1; display: flex; flex-direction: column; gap: 0.18rem; }
  .lang-name { font-size: 0.88rem; font-weight: 600; color: var(--text-bright); }
  .lang-typing { font-family: var(--font-mono); font-size: 0.64rem; color: var(--text-dim); }

  .arrow { color: var(--text-muted); transition: color var(--t), transform var(--t); flex-shrink: 0; }
</style>
