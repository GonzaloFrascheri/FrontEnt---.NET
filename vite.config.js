import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Permite que los pop-ups cierren la ventana
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      // Opcionalmente, también define COEP para recursos cargados
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      host: '0.0.0.0', // Esto vincula a todas las interfaces de red disponibles
      port: 3000,
      https: true,
      strictPort: true,
      hmr: {
        host: 'petrobras.app.servipuntos.me', // Para hot module replacement
      },
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        secure: false,
      }
    }
  }
})
