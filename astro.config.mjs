import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({ mode: 'advanced', imageService: 'compile' }),
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  site: 'https://staging.missdiasporagh.org',
  trailingSlash: 'never',
});
