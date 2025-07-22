import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // mode should be 'background' or 'content'
  const entry = mode === 'content' ? 'src/content.ts' : 'src/background.ts';
  return {
    build: {
      rollupOptions: {
        input: {
          [entry.replace('.ts', '')]: resolve(__dirname, entry),
        },
        output: {
          entryFileNames: '[name].js',
          format: 'iife',
        },
      },
      outDir: 'dist',
      emptyOutDir: false, // Don't wipe out dist between builds
    },
  };
}); 