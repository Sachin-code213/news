/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./src/tests/setup.ts'],
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: true,
            },
        },
    } as any, // ✅ This bypasses the 'InlineConfig' error
});