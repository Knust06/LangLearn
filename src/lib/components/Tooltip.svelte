<script lang="ts">
  export let term: string;
  export let definition: string;

  let visible = false;
</script>

<span
  class="tooltip-host"
  on:mouseenter={() => (visible = true)}
  on:mouseleave={() => (visible = false)}
  role="tooltip"
  aria-label="{term}: {definition}"
>
  <slot>{term}</slot>
  {#if visible}
    <span class="tooltip-box">{definition}</span>
  {/if}
</span>

<style>
  .tooltip-host {
    position: relative;
    cursor: help;
    border-bottom: 1px dashed #569cd6;
    color: #569cd6;
  }
  .tooltip-box {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 0;
    background: #252526;
    border: 1px solid #454545;
    color: #d4d4d4;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    max-width: 280px;
    white-space: normal;
    z-index: 100;
    pointer-events: none;
  }
</style>
