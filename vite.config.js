import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        recipes: 'recipes.html',
        checkout: 'checkout.html',
        admin: 'admin.html',
        account: 'account.html',
        product: 'product.html',
        track: 'track.html'
      }
    }
  }
});