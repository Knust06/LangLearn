<script lang="ts">
  import { onMount } from 'svelte';
  import { createHighlighter } from 'shiki';

  export let lang: string = 'text';
  export let code: string;

  let html = '';

  onMount(async () => {
    const highlighter = await createHighlighter({
      themes: ['dark-plus'],
      langs: ['python', 'javascript', 'typescript', 'go', 'rust', 'kotlin', 'swift', 'csharp']
    });
    html = highlighter.codeToHtml(code, { lang, theme: 'dark-plus' });
  });
</script>

{#if html}
  <div class="syntax-block">{@html html}</div>
{:else}
  <pre class="syntax-block fallback"><code>{code}</code></pre>
{/if}

<style>
  .syntax-block {
    border-radius: 6px;
    overflow: auto;
    font-size: 0.875rem;
    margin: 1rem 0;
  }
  .fallback {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 1rem;
  }
  :global(.syntax-block pre) {
    margin: 0;
    padding: 1rem;
  }
</style>
