
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      '@rollup/rollup-linux-x64-gnu', 
      '@rollup/rollup-darwin-x64', 
      '@rollup/rollup-win32-x64-msvc',
      '@rollup/rollup-darwin-arm64',
      '@rollup/rollup-linux-arm64-gnu',
      '@rollup/rollup-win32-ia32-msvc',
      '@rollup/rollup-linux-arm-gnueabihf'
    ]
  },
  build: {
    rollupOptions: {
      external: [
        '@rollup/rollup-linux-x64-gnu', 
        '@rollup/rollup-darwin-x64', 
        '@rollup/rollup-win32-x64-msvc',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-linux-arm64-gnu',
        '@rollup/rollup-win32-ia32-msvc',
        '@rollup/rollup-linux-arm-gnueabihf'
      ]
    }
  }
}));
