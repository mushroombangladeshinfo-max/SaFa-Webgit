import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
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
        quickLog:      './quick-log.html',
        farmAnalytics: './farm-analytics.html',
        expenses:      './expenses.html',
        pipeline:      './pipeline.html',
        customers:     './customers.html',
        products:      './products.html',
      }
    }
  }
});
