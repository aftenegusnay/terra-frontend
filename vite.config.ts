import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    // Mitigación pre-emptiva: LightningCSS de Vite 8 tiene un bug oklch→lab
    // (microsoft/vscode#19789). PostCSS no transpila colores → los HEX del
    // @theme salen intactos en dist/assets/*.css.
    transformer: 'postcss',
  },
  build: {
    // Esbuild no toca los valores de color al minificar (idem bug anterior).
    cssMinify: 'esbuild',
  },
})