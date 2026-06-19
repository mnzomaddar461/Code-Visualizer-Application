import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // base: '/Code-Visualizer-Application/', 
  build: {
    // মিনিফিকেশন পুরোপুরি বন্ধ করে দেওয়া হলো, যাতে গিটহাব কোনো কিছুতেই eval সন্দেহ না করতে পারে
    minify: false,
    sourcemap: false,
  }
})