import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',
  // Share the same public/ data folder with the React project — no duplication needed.
  // Python crawl scripts keep writing to fe/public/ and both projects share the data.
  vite: {
    plugins: [tailwindcss()],
  },
})
