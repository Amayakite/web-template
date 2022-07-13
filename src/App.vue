<script setup lang="ts">
import { ElMessage } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { ref } from 'vue';
// I18N，暂时使用本地，之后看情况来使用不同的
const locale = ref(zhCn);
// 获取浏览器UA
const UA = navigator.userAgent;
// 是否是移动端
const isMobile = /mobile/i.test(UA);
// 如果是的话，就弹出一个el-message提示
if (isMobile) {
    ElMessage.warning('未兼容移动端，请使用电脑访问，谢谢');
}
console.log(
    'template: https://github.com/Amayakite/web-template (完成度:30/100)'
);
</script>

<template>
    <ElConfigProvider :locale="locale">
        <!-- 路由 -->
        <router-view></router-view>
    </ElConfigProvider>
</template>
