<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Chart as ChartType } from 'chart.js';
  import type { ProgressStat } from '$lib/types';

  export let stats: ProgressStat[];

  let canvas: HTMLCanvasElement;
  let chart: ChartType | null = null;

  onMount(async () => {
    const { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } = await import('chart.js');
    Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: stats.map(s => s.language),
        datasets: [
          {
            label: 'Accuracy %',
            data: stats.map(s => s.accuracy),
            backgroundColor: 'rgba(0, 217, 255, 0.18)',
            borderColor: '#00D9FF',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Total attempts',
            data: stats.map(s => s.total),
            backgroundColor: 'rgba(0, 229, 153, 0.18)',
            borderColor: '#00E599',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: { color: '#454A6A' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          y: {
            ticks: { color: '#454A6A' },
            grid: { color: 'rgba(255,255,255,0.06)' },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: { color: '#D6DBF0' }
          },
          tooltip: {
            backgroundColor: '#121420',
            titleColor: '#F2F5FF',
            bodyColor: '#F2F5FF',
            borderColor: 'rgba(255,255,255,0.13)',
            borderWidth: 1
          }
        }
      }
    });
  });

  onDestroy(() => chart?.destroy());
</script>

<div class="chart-wrap">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
  }
</style>
