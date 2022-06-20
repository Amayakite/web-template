import { defineStore } from 'pinia';
import { ref } from 'vue';

interface UserInfo {
    /**
     * 用户名
     */
    name: string;
    /**
     * id
     */
    id: string;
    /**
     * 头像
     */
    avatar: string;
    /**
     * 昵称
     */
    nickname: string;
    /**
     * 性别
     * 0:未知
     * 1:男
     * 2:女
     */
    sex: 0 | 1 | 2;
}
export const useUserStore = defineStore('user', () => {
    const loadingInstance = ref(null); // 加载动画
    const user = ref<UserInfo>({} as UserInfo); // 用户信息
    const token = ref<string>(window.localStorage.getItem('token') || ''); // token

    /**
     * 设置用户信息
     * @param userInfo 用户信息
     */
    const setUser = (userInfo: UserInfo): void => {
        user.value = userInfo;
    };

    /**
     * 设置token
     * @param {string} userToken token
     * @param {boolean?} isSave 是否保存到localStorage
     */
    const setToken = (userToken: string, isSave = true): void => {
        token.value = userToken;
        if (isSave) {
            window.localStorage.setItem('token', userToken);
        }
    };

    /**
     * 清除token
     */
    const clearToken = (): void => {
        token.value = '';
        window.localStorage.removeItem('token');
    };

    /**
     * 清除用户信息
     */
    const clearUser = (): void => {
        user.value = {} as UserInfo;
    };

    const GetUserInfo = async (): Promise<UserInfo | null> => {
        // TODO 远程获取用户的最新信息
        return user.value;
    };

    return {
        user,
        token,
        loadingInstance,
        setUser,
        setToken,
        clearToken,
        clearUser,
        GetUserInfo
    };
});
