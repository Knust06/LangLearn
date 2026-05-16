import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      '$lib': new URL('./src/lib', import.meta.url).pathname
    }
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'jsdom',
    globals: true,
    alias: {
      '$lib': new URL('./src/lib', import.meta.url).pathname
    }
  }
});
