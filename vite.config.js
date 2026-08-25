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
            detectTls: 'easy-rise.test',
        }),
        tailwindcss(),
    ],
    server: {
        host: 'easy-rise.test',
        port: 5174,
        cors: {
            origin: 'https://easy-rise.test',
        },
        origin: 'https://easy-rise.test:5174',
        hmr: {
            host: 'easy-rise.test',
            protocol: 'wss',
            port: 5174,
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});

// Restart trigger comment to reload Tailwind v4 config AST
