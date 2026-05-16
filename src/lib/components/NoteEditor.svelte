<script lang="ts">
  import type { Note } from '$lib/types';
  import { onMount } from 'svelte';

  export let refType: 'exercise' | 'language';
  export let refId: string;

  let notes: Note[] = [];
  let draft = '';
  let open = false;

  onMount(async () => {
    const res = await fetch(`/api/notes?ref_type=${refType}&ref_id=${refId}`);
    notes = await res.json();
  });

  async function save() {
    if (!draft.trim()) return;
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ref_type: refType, ref_id: refId, content: draft })
    });
    draft = '';
    const res = await fetch(`/api/notes?ref_type=${refType}&ref_id=${refId}`);
    notes = await res.json();
  }
</script>

<div class="note-editor">
  <button class="toggle" on:click={() => (open = !open)}>
    {open ? 'Hide Notes' : `Notes (${notes.length})`}
  </button>

  {#if open}
    <div class="panel">
      {#each notes as note}
        <div class="note">
          <p>{note.content}</p>
          <span class="ts">{note.updated_at}</span>
        </div>
      {/each}
      <textarea bind:value={draft} placeholder="Add a note…" rows="3"></textarea>
      <button on:click={save} disabled={!draft.trim()}>Save Note</button>
    </div>
  {/if}
</div>

<style>
  .toggle {
    background: none;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-dim);
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.3rem 0.75rem;
    margin-top: 1rem;
  }
  .toggle:hover { border-color: var(--accent); color: var(--accent); }
  .panel {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 6px;
    margin-top: 0.5rem;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .note {
    border-left: 2px solid var(--accent);
    padding-left: 0.75rem;
  }
  .note p { margin: 0; font-size: 0.875rem; }
  .ts { font-size: 0.7rem; color: var(--text-dim); }
  textarea {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 0.875rem;
    padding: 0.5rem;
    resize: vertical;
    width: 100%;
  }
  button[disabled] { opacity: 0.4; cursor: not-allowed; }
  button:not(.toggle) {
    align-self: flex-end;
    background: var(--accent);
    border: none;
    border-radius: 4px;
    color: #1e1e1e;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.35rem 0.9rem;
  }
</style>
