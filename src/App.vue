<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { ref } from 'vue';
// I18N，暂时使用本地，之后看情况来使用不同的
const locale = ref(zhCn);
</script>

<template>
    <ElConfigProvider :locale="locale">
        <!-- 路由 -->
        <router-view></router-view>
    </ElConfigProvider>
</template>
