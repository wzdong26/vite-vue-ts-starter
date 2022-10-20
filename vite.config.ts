import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const BASE_URL_PATH = import.meta.env?.VITE_BASE_URL_PATH || '/app/'
const BASE_SERVER_PATH = import.meta.env?.VITE_BASE_SERVER_PATH || '/api/server'
const BASE_SERVER_TARGET_URL = import.meta.env?.VITE_BASE_SERVER_TARGET_URL || 'http://xxx.xx.xxx.xxx/'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, './src/'),
            },
        ],
    },
    server: {
        host: true, // 服务器主机名
        port: 8080,
        // open: true,
        // https: true,
        proxy: {
            '/api': {
                target: '', // 配置api地址
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            [BASE_SERVER_PATH]: {
                target: BASE_SERVER_TARGET_URL, // 转发到真实服务器
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, '')
            },
        },
    },

    base: BASE_URL_PATH,

    build: {
        // assetsPublicPath:"./",
        outDir: `./dist${BASE_URL_PATH}`,
        target: ['edge90', 'chrome90', 'firefox90', 'safari15', 'esnext'],
    },
    // productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    // devtool: '#source-map',
})
