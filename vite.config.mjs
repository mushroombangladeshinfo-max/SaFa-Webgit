import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  /* ── Multi-page setup ──
     Each HTML file is its own entry point.
     Vite bundles them independently.
  ── */
  build: {
    rollupOptions: {
      input: {
        main:     resolve(__dirname, 'index.html'),
        recipes:  resolve(__dirname, 'recipes.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        account:  resolve(__dirname, 'account.html'),
        admin:    resolve(__dirname, 'admin.html'),
        track:    resolve(__dirname, 'track.html'),
        product:  resolve(__dirname, 'product.html'),
      }
    }
  },

  /* ── Dev server ── */
  server: {
    port: 5173,
    open: true
  }
})
