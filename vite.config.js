import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    esbuild: {
      loader: 'jsx',
      include: /.*\.jsx?$/,
      exclude: []
    }
  }
})
