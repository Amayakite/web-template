import { createApp } from 'vue';
import App from './App.vue';
import 'normalize.css';
// 自定义全局样式
import '@styles/index.scss';
import router from '@/router';
import { store } from '@/store';
import { register } from '@/config/register';
//引入Elmessage和Elloading的css样式文件 不然有问题
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message.css';
const app = createApp(App);

// Pinia 插件
app.use(store);
// 路由
app.use(router);
// 挂载
app.mount('#app');
// 注册自定义内容
register(app);
