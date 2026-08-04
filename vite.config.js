import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        host: '0.0.0.0',
        origin: 'https://i-learn-english.test:5174',
        hmr: {
            host: 'i-learn-english.test',
            protocol: 'wss',
            port: 5174,
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});

// Restart trigger comment to reload Tailwind v4 config AST
