import { createRouter, createWebHistory } from 'vue-router';
import route from './route';

const router = createRouter({
    // 使用的模式
    history: createWebHistory(),
    // 路由的详细配置
    routes: route
});
// 全局后置钩子
router.afterEach((to, from) => {
    // 获取from的meta.title
    const fromTitle: string = to.meta.title as string;
    // 设置到title
    document.title = fromTitle
        ? fromTitle
        : (from.meta.title as string)
        ? (from.meta.title as string)
        : document.title;
});

export default router;
