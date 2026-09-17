import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites under a subpath like /veylora/.
// Set VITE_BASE_PATH=/ to deploy as <user>.github.io, or leave it out
// (the Actions workflow computes it automatically from the repo name).
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
})