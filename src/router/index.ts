import { createRouter, createWebHistory } from 'vue-router';
import route from './route';

const router = createRouter({
    // 使用的模式
    history: createWebHistory(),
    // 路由的详细配置
    routes: route
});

export default router;
