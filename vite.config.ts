import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import eslintPlugin from 'vite-plugin-eslint';

// 获取环境变量
const env = process.env.NODE_ENV || 'development';
const envFiles = [`.env.${env}`];
// 设置值
for (const file of envFiles) {
    if (fs.existsSync(file)) {
        const envConfig = dotenv.parse(fs.readFileSync(file));
        for (const key in envConfig) {
            process.env[key] = envConfig[key];
        }
    }
}

// vite启动时监听的端口
const ViteClitentPort = Number(process.env.VITE_CLI_PORT);

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        // 配置环境别名
        alias: {
            '@/': `${path.resolve(__dirname, 'src')}/`,
            '@styles/': `${path.resolve(__dirname, 'src/styles')}/`,
            '@components/': `${path.resolve(__dirname, 'src/components')}/`,
            '@utils/': `${path.resolve(__dirname, 'src/utils')}/`,
            '@pages/': `${path.resolve(__dirname, 'src/pages')}/`,
            '@store/': `${path.resolve(__dirname, 'src/store')}/`
        }
    },
    // server设置
    server: {
        open: false, // 是否自动打开浏览器
        port: ViteClitentPort, // 端口
        [process.env.VITE_BASE_API]: {
            // 需要代理的路径   例如 '/api'
            target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
            changeOrigin: true,
            rewrite: (path: string) =>
                path.replace(new RegExp('^' + process.env.VITE_BASE_API), '')
        }
    },
    // 自定义elementPlus主题
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@styles/theme.scss" as *;`
            }
        }
    },

    plugins: [
        // Vue基本的组件
        vue(),
        // 自动导入-按需引入ElementPlus组件
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        // 自动导入-按需引入ElementPlus资源
        Components({
            resolvers: [
                ElementPlusResolver({
                    // 同时使用自定义样式
                    importStyle: 'sass',
                    directives: true
                })
            ]
        }),
        eslintPlugin({
            include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
        })
    ]
});
