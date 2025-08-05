import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
    const {VITE_APP_PROXY_TARGET} = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks(app) {
                        if (app.includes('node_modules/element-plus')) {
                            return 'ui'
                        } else if (app.includes('node_modules')) {
                            return 'vendor'
                        }
                    },
                    entryFileNames: 'js/[name]-[hash].js',
                    chunkFileNames: 'js/[name]-[hash].js',
                    assetFileNames(app) {
                        const image = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico']
                        if (image.some(i => app.names[0].endsWith(i))) {
                            return 'img/[name]-[hash].[ext]'
                        } else if (app.names[0].endsWith('.css')) {
                            return 'css/[name]-[hash].[ext]'
                        } else {
                            return 'assets/[name]-[hash].[ext]'
                        }
                    },
                },
            },
        },
        server: {
            proxy: {
                '/api': {
                    target: VITE_APP_PROXY_TARGET,
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    }
})
