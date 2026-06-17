import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/algo-viz-pro/', // <--- এখানে আপনার সঠিক GitHub Repository-র নাম লিখবেন (দুপাশে স্ল্যাশ থাকবে)
})