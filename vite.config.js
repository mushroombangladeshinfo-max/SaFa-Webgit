import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:      './index.html',
        admin:     './admin.html',
        dashboard: './dashboard.html',
        farmLog:   './farm-log.html',
        product:   './product.html',
        recipes:   './recipes.html',
        checkout:  './checkout.html',
        account:   './account.html',
        track:     './track.html',
      }
    }
  }
});
