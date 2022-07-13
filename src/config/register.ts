// import StringUtil from '@/util/strings';
// 统一导入el-icon图标
// import StringUtil from '@/util/string';
import * as ElIconModules from '@element-plus/icons-vue';
import { App } from 'vue';

export const register = (app: App<Element>) => {
    const iconList = Object.keys(ElIconModules);
    for (const icon of iconList) {
        // el-icon命名规范：el-XXX 例如 el-user(原先的首字母大写变为小写，中横线分割，不带icon)
        // 转换成中横线命名
        // const iconName = `el-${StringUtil.toHyphenCase(icon)}`;
        // @ts-ignore
        app.component('el-' + icon, ElIconModules[icon]);
        // console.log(iconName);
    }
    console.log('init success');
    for (const envKey in import.meta.env) {
        console.log(envKey, import.meta.env[envKey]);
    }
    // const result = _.cloneDeep({ a: '张三', b: '李四' });
    // 判断字符串是否为空
    // console.log(_.isEmpty('   '));
    // console.log(result);
};
