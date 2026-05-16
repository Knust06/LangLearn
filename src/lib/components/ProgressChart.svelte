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
            backgroundColor: '#569cd6cc',
            borderColor: '#569cd6',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Total attempts',
            data: stats.map(s => s.total),
            backgroundColor: '#4ec9b0cc',
            borderColor: '#4ec9b0',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { color: '#858585' }, grid: { color: '#3c3c3c' } },
          y: { ticks: { color: '#858585' }, grid: { color: '#3c3c3c' }, beginAtZero: true }
        },
        plugins: {
          legend: { labels: { color: '#d4d4d4' } }
        }
      }
    });
  });

  onDestroy(() => chart?.destroy());
</script>

<canvas bind:this={canvas}></canvas>
