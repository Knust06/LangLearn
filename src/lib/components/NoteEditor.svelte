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
    {open ? `▲ Notes (${notes.length})` : `▼ Notes (${notes.length})`}
  </button>

  {#if open}
    <div class="panel">
      {#if notes.length > 0}
        <div class="notes-list">
          {#each notes as note}
            <div class="note">
              <p class="note-content">{note.content}</p>
              <span class="ts">{note.updated_at}</span>
            </div>
          {/each}
        </div>
      {/if}

      <textarea bind:value={draft} placeholder="Add a note…" rows="3"></textarea>
      <button class="save-btn" on:click={save} disabled={!draft.trim()}>Save</button>
    </div>
  {/if}
</div>

<style>
  .toggle {
    background: none;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-dim);
    cursor: pointer;
    font-family: var(--font);
    font-size: 0.78rem;
    padding: 0.35rem 0.8rem;
    transition: border-color var(--t), color var(--t);
    letter-spacing: 0.02em;
  }
  .toggle:hover {
    border-color: var(--border-2);
    color: var(--text);
  }

  .panel {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-top: 0.5rem;
    padding: 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .note {
    border-left: 2px solid var(--cyan);
    padding-left: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .note-content {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text);
    line-height: 1.5;
  }
  .ts {
    font-size: 0.68rem;
    color: var(--text-dim);
    font-family: var(--font-mono);
  }

  textarea {
    background: var(--surface-3);
    border: 1px solid var(--border-2);
    border-radius: var(--radius);
    color: var(--text);
    font-family: var(--font);
    font-size: 0.875rem;
    padding: 0.6rem 0.75rem;
    resize: vertical;
    width: 100%;
    box-sizing: border-box;
    outline: none;
    transition: border-color var(--t);
    line-height: 1.5;
  }
  textarea:focus {
    border-color: var(--cyan-border);
  }
  textarea::placeholder {
    color: var(--text-muted);
  }

  .save-btn {
    align-self: flex-start;
    background: var(--cyan);
    border: none;
    border-radius: var(--radius);
    color: var(--void);
    cursor: pointer;
    font-family: var(--font);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.35rem 0.85rem;
    transition: opacity var(--t);
  }
  .save-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .save-btn:not(:disabled):hover {
    opacity: 0.85;
  }
</style>
