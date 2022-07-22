import { useUserStore } from '@store/modules/user';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

export const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_API || '', // api的base_url
    timeout: 99999 // 请求超时时间
});
export const resourceService = axios.create({
    baseURL: import.meta.env.VITE_BASE_RESOURCE_API || '', // api的base_url
    timeout: 99999 // 请求超时时间
});
let activeAxios = 0; // 当前活跃的axios实例数量
let timer: NodeJS.Timeout; // 当前的延时器
/**
 * 显示Loading，这个时候应该触发一个事件
 */
const showLoading = (): void => {
    activeAxios++;
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        if (activeAxios > 0) {
            // TODO 触发事件
            console.log('加载中...');
        }
    });
};

/**
 * 隐藏Loading 这里也应该触发一个事件
 */
const closeLoading = (): void => {
    if (activeAxios > 0) {
        activeAxios--;
        clearTimeout(timer);
        // TODO 清除事件
        console.log('加载完成');
    }
};

/**
 * 请求拦截器中所需要的参数
 */
interface RequestConfig extends AxiosRequestConfig<any> {
    isLoading?: boolean;
}

// http request 拦截器
service.interceptors.request.use(
    (config: RequestConfig) => {
        if (config.isLoading) {
            showLoading();
        }
        const userStore = useUserStore();
        let token = userStore.token;
        if (
            process.env.VITE_USER_AUTH_HEADE !== undefined &&
            process.env.VITE_USER_AUTH_HEADE !== ''
        ) {
            // 请求头的前缀设置
            token = process.env.VITE_USER_AUTH_HEADE + ' ' + token;
        }
        config.headers![process.env.VITE_USER_AUTH!] = token;
        config.headers!['Content-Type'] = 'application/json';
        config.headers!['userId'] = userStore.user.id;
        config.headers!['timestamp'] = new Date().getTime();
        return config;
    },
    (err) => {
        closeLoading();
        ElMessage({
            message: err,
            type: 'error',
            showClose: true
        });
        return err;
    }
);

interface HttpResponse<T> {
    code: number;
    data: T;
    message: string;
}

// http response 拦截器
service.interceptors.response.use(
    (response: AxiosResponse<HttpResponse<any>, any>) => {
        console.log('response:', response);
        const userStore = useUserStore();
        closeLoading();
        if (response.headers['token'] !== undefined) {
            userStore.setToken(response.headers['token']);
        }
        // TODO 根据项目来确定成功的返回值
        if (response.data.code === 0) {
            return response.data;
        }
        ElMessage({
            message: response.data.message,
            type: 'error',
            showClose: true
        });
        // 判断token是否过期
        if (response.data.code === 401) {
            userStore.clearToken();
            userStore.clearUser();
            // TODO 路由跳转到登陆页面
        }
        return Promise.reject(response.data);
    },
    (error) => {
        closeLoading();
        if (!error.response) {
            ElMessageBox.confirm(
                `
            <p>请求错误</p>
            <p>${error}</p>
            `,
                '请求报错',
                {
                    dangerouslyUseHTMLString: true,
                    distinguishCancelAndClose: true,
                    confirmButtonText: '稍后重试',
                    cancelButtonText: '取消'
                }
            );
            return;
        } else {
            ElMessage({
                message: error.response.data.message,
                type: 'error',
                showClose: true
            });
        }
        return error;
    }
);
