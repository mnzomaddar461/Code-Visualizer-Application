import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/Code-Visualizer-Application/', // আপনার রিপোজিটরির নাম অনুযায়ী সঠিক বেস পাথ
  build: {
    // Rolldown/Terser-কে ডাইনামিক গ্লোবাল অবজেক্ট বা eval ট্রিক জেনারেট করতে নিষেধ করা হচ্ছে
    minify: 'esbuild', 
    sourcemap: false,
    rollupOptions: {
      output: {
        // এটি জাভাস্ক্রিপ্ট বিল্ডকে একদম ক্লিন এবং সাধারণ ফরম্যাটে রাখবে
        format: 'es',
      }
    }
  }
})