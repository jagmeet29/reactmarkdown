import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/reactmarkdown/',   // <-- this makes dev & prod assets live under /reactmarkdown/
  plugins: [react()]
})
