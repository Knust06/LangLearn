import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.mdx', '.md'],
  preprocess: [
    vitePreprocess(),
    mdsvex({ extensions: ['.mdx', '.md'] })
  ],
  kit: {
    adapter: (await import('@sveltejs/adapter-auto')).default()
  }
};

export default config;
