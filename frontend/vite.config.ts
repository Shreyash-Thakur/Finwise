import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Use a relative base so the built site can be served from subpaths
  // (useful for GitHub Pages or other static hosts). If you host at
  // the repo root on a custom domain you can change this to '/'.
  base: './',
  plugins: [react()],
})
