import path from 'node:path';
import { execSync } from 'node:child_process';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const getGitHash = () => {
  try {
    const gitCmd = '"C:\\Users\\Ismael\\AppData\\Local\\Programs\\Git\\cmd\\git.exe"';
    return execSync(`${gitCmd} rev-parse --short HEAD`).toString().trim();
  } catch {
    try {
      return execSync('git rev-parse --short HEAD').toString().trim();
    } catch {
      return 'latest';
    }
  }
};

export default defineConfig({
  plugins: [react()],
  define: {
    __COMMIT_HASH__: JSON.stringify(getGitHash()),
  },
  server: {
    port: 3000,
    cors: true,
    allowedHosts: true,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        '@babel/parser',
        '@babel/traverse',
        '@babel/generator',
        '@babel/types'
      ]
    }
  }
});
