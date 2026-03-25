import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Remove the global modules flag
  // If you need CSS modules, configure them per-file with `.module.css`
})