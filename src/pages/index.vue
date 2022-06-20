<template>
    <div class="flex h-screen w-full">
        <div class="aside">
            <el-link class="logo" @click="getHomePage">
                <img src="@/assets/logo.png" alt="logo" />
            </el-link>
            <div class="aside_list">
                <div class="aside_list__item">
                    <span>左边显示图标和标题</span>
                    <span>右边显示一个图标</span>
                </div>
                <div class="aside_list__item">111</div>
            </div>
        </div>
        <div class="w-full h-screen overflow-hidden">
            <div class="header flex items-center">
                <el-icon color="black">
                    <component :is="'el-upload-filled'" />
                </el-icon>
                This is a Header
            </div>
            <div class="bodyer">
                <div v-for="i in iconList" :key="i.name" class="bodyer__item">
                    <el-icon>
                        <component :is="i.component" />
                        <div></div>
                    </el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    Component,
    ComponentInternalInstance,
    getCurrentInstance,
    markRaw,
    ref
} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
let isMini = ref<boolean>(false);

interface IconList {
    name: string;
    component: Component;
}

const iconList = ref<IconList[]>([] as IconList[]);

// 获取this对象
const that = getCurrentInstance() as ComponentInternalInstance;

const components = that.appContext.components;
for (const key in components) {
    if (components.hasOwnProperty(key)) {
        // 判断key最前面是不是el-开头
        if (key.startsWith('el-')) {
            iconList.value.push({
                name: key,
                component: markRaw(components[key])
            });
        }
    }
}

/**
 * 跳转回主页
 */
const getHomePage = () => {
    router.push({
        name: 'HomePage'
    });
};

// 监听页面width变化，改变isMini的值
window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        isMini.value = true;
    } else {
        isMini.value = false;
    }
});
</script>

<style lang="scss">
.header {
    background-color: $primary;
}

.aside {
    @apply xl:w-52 lg:w-48 md:w-44 sm:w-14 text-white flex flex-col items-center justify-start;
    background: $primary;

    .logo {
        img {
            @apply mt-4 mb-4 w-10 h-10 xl:w-20 xl:h-20  lg:w-14 lg:h-14 md:w-12 md:h-12 sm:w-8 sm:h-8  p-2;
        }
    }

    .aside_list {
        @apply w-full;
        &__item {
            @apply text-white  text-sm  p-2 flex justify-between items-center whitespace-nowrap overflow-hidden;
            // 动画时间0.3s
            transition: all 0.3s ease-in-out;
            // flex 不换行
            &:hover {
                // 背景色减淡10%
                background: rgba(0, 0, 0, 0.3);
            }
        }
    }
}

.bodyer {
    // grid 布局 每行3列  宽高百分百 显示侧边滚动条 居中
    @apply grid grid-cols-5 gap-10  justify-items-center content-around justify-center items-center w-full h-full overflow-y-auto;
    // grid 居中
    // 滚动条样式：蓝色-白色-蓝色 滚动条宽度3px
    &::-webkit-scrollbar {
        width: 7px;
        // 渐变色 朝下
        background: linear-gradient(
            to bottom,
            $primary,
            darken($primary, 10%),
            darken($primary, 30%),
            darken($primary, 50%)
        );
    }

    // 滚动条滑块样式 宽度3px 圆角 左右两边有1px的边框
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        border: 3px solid transparent;
        background-color: white;
    }

    &__item {
        @apply text-sm  p-2 flex justify-center items-center whitespace-nowrap overflow-hidden w-full h-full;
        // 动画时间0.3s
        transition: all 0.3s ease-in-out;
        padding: 20px;
        // flex 不换行
        &:hover {
            // 背景色减淡10%
            background: rgba(0, 0, 0, 0.3);
        }
    }
}
</style>
