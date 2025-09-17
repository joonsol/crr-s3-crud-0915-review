import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css:{
    devSourcemap:true
  },
    server: {
    port: 5174,   // ✅ 기본 포트 변경
  },
})
