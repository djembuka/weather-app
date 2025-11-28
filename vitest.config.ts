import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import viteConfig from './vite.config';

export default defineConfig(config => 
    mergeConfig( viteConfig, {
        test: {
            globals: true,
            environment: 'happy-dom',
            testTimeout: 10_000,
            coverage: {
                provider: 'v8',
                reporter: ['text', 'html', 'lcov'],
                exclude: [
                    'node_modules/',
                    'dist/',
                    'src/tests/',
                    '**/*.d.ts',
                    'src/sw.ts'
                ]
            }
        }
    })
);