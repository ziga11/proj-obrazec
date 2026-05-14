import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
        build: {
                outDir: 'dist',
                rollupOptions: {
                        input: {
                                create: resolve(__dirname, 'pages/create.html'),
                                edit: resolve(__dirname, 'pages/modify.html'),
                                list: resolve(__dirname, 'pages/list.html'),
                                view: resolve(__dirname, 'pages/view.html'),
                                login: resolve(__dirname, 'pages/login.html')
                        },
                },
        },
});

