import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Permite que los pop-ups cierren la ventana
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      // Opcionalmente, también define COEP para recursos cargados
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }
  }
})