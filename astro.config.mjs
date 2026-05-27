import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://cstools-hub.netlify.app',
  prefetch: {
    defaultStrategy: 'tap',
  },
  build: {
    format: 'directory',
  },
});
