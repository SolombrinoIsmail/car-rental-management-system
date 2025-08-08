import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.config.*',
        'tests/**',
        'coverage/**',
        '.next/**',
        '.turbo/**',
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 80,
        statements: 80,
      },
    },
    include: [
      'packages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'apps/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      '.turbo/**',
      '**/e2e/**',
      'apps/**/node_modules/**',
      'packages/**/node_modules/**',
      '**/node_modules/next/**',
    ],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/apps': resolve(__dirname, './apps'),
      '@/packages': resolve(__dirname, './packages'),
    },
  },
});
