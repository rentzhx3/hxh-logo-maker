import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// define base path from env var

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue()],
})

