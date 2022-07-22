import ESLintPlugin from '@modyqyw/vite-plugin-eslint';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

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
const ViteClientPort = Number(process.env.VITE_CLI_PORT);

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
        host: '0.0.0.0', // port
        open: false, // 是否自动打开浏览器
        port: ViteClientPort, // 端口
        proxy: {
            // 需要代理的路径   例如 '/api'
            [process.env.VITE_BASE_API]: {
                target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
                changeOrigin: true,
                rewrite: (path: string) =>
                    path.replace(
                        new RegExp('^' + process.env.VITE_BASE_API),
                        ''
                    ),
                ws: true
            },
            [process.env.VITE_BASE_RESOURCE_API]: {
                target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
                changeOrigin: true,
                rewrite: (path: string) =>
                    path.replace(
                        new RegExp('^' + process.env.VITE_BASE_RESOURCE_API),
                        ''
                    )
            }
        }
    },
    // 构建时的配置
    build: {
        sourcemap: false,
        // 使用esbuild来构建，速度可以比terser快20~40%
        // 如果需要使用tester的话,需要先安装下：pnpm i -D terser
        minify: 'esbuild',
        // 块大小警告的限制(默认500，单位kb)
        chunkSizeWarningLimit: 1500
        // terserOptions: {
        //     compress: {
        //         drop_console: true,
        //         drop_debugger: true
        //     }
        // },
        // rollupOptions: {
        //     output: {
        //         manualChunks(id) {
        //             if (id.includes('node_modules')) {
        //                 return id
        //                     .toString()
        //                     .split('node_modules/')[1]
        //                     .split('/')[0]
        //                     .toString();
        //             }
        //         },
        //         chunkFileNames: (chunkInfo) => {
        //             const facadeModuleId = chunkInfo.facadeModuleId
        //                 ? chunkInfo.facadeModuleId.split('/')
        //                 : [];
        //             const fileName =
        //                 facadeModuleId[facadeModuleId.length - 2] || '[name]';
        //             return `js/${fileName}/[name].[hash].js`;
        //         }
        //     }
        // }
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
        // EsLint
        ESLintPlugin({
            include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
            // fix: true
        })
    ]
});
