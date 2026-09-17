import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cloudflare Pages serves the app at the domain root, so the base is "/" by
// default. For a sub-path host (e.g. a GitHub Pages project site), set
// VITE_BASE_PATH=/<repo>/ at build time.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
})