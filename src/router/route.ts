import { useUserStore } from '@store/modules/user';
import { RouteRecordRaw } from 'vue-router';

const RouterList: RouteRecordRaw[] = [
    {
        name: 'HomePage',
        path: '/',
        component: () => import('@pages/index.vue'),
        // 前置路由守卫
        beforeEnter: async (_, from, next) => {
            // 先看看是否登陆
            const user = await useUserStore().GetUserInfo();
            if (user) {
                next();
                return;
            }
            next({ name: 'LoginPage' });
        }
    },
    {
        name: 'LoginPage',
        path: '/login',
        component: () => import('@pages/login.vue'),
        // 前置路由守卫
        beforeEnter: async (_, from, next) => {
            // 先判断有没有登陆 如果登陆了，则应该返回主页
            const user = await useUserStore().GetUserInfo();
            if (user) {
                next({ name: 'HomePage' });
            }
            next();
        }
    }
];
export default RouterList;
