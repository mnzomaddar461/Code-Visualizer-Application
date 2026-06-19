import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/Code-Visualizer-Application/', // আপনার সঠিক GitHub Repository-র নাম
  build: {
    // জটিলতা এড়াতে মিনিফিকেশন ডিফল্ট রাখা হলো
    minify: true,
    // প্রোডাকশন বিল্ডে কোনো ধরণের সোর্স-ম্যাপ তৈরি হবে না যা eval বা CSP ট্রিগার করতে পারে
    sourcemap: false,
  }
})