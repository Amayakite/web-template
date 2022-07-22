import * as echarts from 'echarts';
import blue from '@/assets/echarts-blue-theme.json';
import orange from '@/assets/echarts-orange-theme.json';
import { ref, Ref } from 'vue';
echarts.registerTheme('blue', blue);
echarts.registerTheme('orange', orange);
export enum EchartsTheme {
    blue = 'blue',
    orange = 'orange'
}
/**
 * 用户的语言
 */
const userLang = navigator.language.split('-')[0].toLocaleUpperCase();

export class MyEcharts {
    private constructor() {}
    private echartsComponent!: Ref<echarts.ECharts>;
    private setEchartsComponent(echartsComponent: Ref<echarts.ECharts>) {
        this.echartsComponent = echartsComponent;
        return this;
    }
    /**
     * 实例化echarts
     * @param dom  实例化的dom
     * @param option  实例化的option
     * @param theme  实例化的主题
     * @returns  MyEcharts实体对象
     */
    static init<T extends HTMLElement>(
        dom: T,
        option: echarts.EChartsOption,
        theme = EchartsTheme.blue
    ) {
        // 获取用户的语言
        const myChart = echarts.init(dom, theme, {
            // 根据用户的语言设置echarts的语言
            locale: userLang
        });
        myChart.setOption(option);
        // 监听window的resize事件
        window.addEventListener('resize', () => {
            myChart.resize();
        });
        return new MyEcharts().setEchartsComponent(
            // @ts-ignore
            ref<echarts.ECharts>(myChart)
        );
    }
    /**
     * 销毁echarts
     */
    dispose() {
        // 取消监听window的resize事件
        window.removeEventListener('resize', () => {
            this.echartsComponent.value.resize();
        });
        this.echartsComponent.value.dispose();
    }
    /**
     * 更新echarts的option
     * @param option 更新的option
     */
    setOption(option: echarts.EChartsOption) {
        this.echartsComponent.value.setOption(option);
    }
    /**
     * 获取echarts的option
     * @returns echarts的option
     */
    getOption(): echarts.EChartsCoreOption {
        return this.echartsComponent.value.getOption();
    }
    /**
     * 更新主题
     * @param theme 更新的主题
     */
    changeTheme(theme: EchartsTheme) {
        /* FIXME 这里有可能会出问题 */
        const option = this.getOption();
        this.echartsComponent.value.dispose();
        this.echartsComponent.value = echarts.init(
            this.echartsComponent.value.getDom(),
            theme,
            { locale: userLang }
        );
        this.echartsComponent.value.setOption(option);
    }
}
