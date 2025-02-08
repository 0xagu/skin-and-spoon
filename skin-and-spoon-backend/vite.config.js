import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '127.0.0.1', // Ensures it's accessible via localhost
        port: 5173, // Ensure this matches the running Vite server
        strictPort: true, // Prevents Vite from switching ports
    },
});
