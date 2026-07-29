import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/Innovation_Hub_Advisor/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index-v2.[hash].js',
        chunkFileNames: 'assets/index-v2.[hash].js',
      }
    }
  }
})
