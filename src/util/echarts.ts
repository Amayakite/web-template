import * as echarts from 'echarts';
import blue from '@/assets/echarts-blue-theme.json';
import orange from '@/assets/echarts-orange-theme.json';
import roma from '@/assets/echarts-roma-theme.json';
export enum EchartsTheme {
    blue = 'blue',
    orange = 'orange',
    roma = 'roma'
}
echarts.registerTheme(EchartsTheme.blue, blue);
echarts.registerTheme(EchartsTheme.orange, orange);
echarts.registerTheme(EchartsTheme.roma, roma);
/**
 * 用户的语言
 */
const userLang = navigator.language.split('-')[0].toLocaleUpperCase();

export class MyEcharts {
    private constructor() {}
    private echartsComponent!: echarts.ECharts;
    private setEchartsComponent(echartsComponent: echarts.ECharts) {
        this.echartsComponent = echartsComponent;
        return this;
    }
    public getEchartsComponent() {
        return this.echartsComponent;
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
        option: echarts.EChartsCoreOption,
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

        return new MyEcharts().setEchartsComponent(myChart);
    }
    /**
     * 销毁echarts
     */
    dispose() {
        // 取消监听window的resize事件
        // window.removeEventListener('resize', () => {
        //     this.echartsComponent.value.resize();
        // });
        this.echartsComponent.dispose();
    }
    /**
     * 更新echarts的option
     * @param option 更新的option
     */
    setOption(option: echarts.EChartsOption) {
        this.echartsComponent.setOption(option);
    }
    /**
     * 获取echarts的option
     * @returns echarts的option
     */
    getOption(): echarts.EChartsCoreOption {
        return this.echartsComponent.getOption();
    }
    /**
     * 更新主题
     * @param theme 更新的主题
     */
    changeTheme(theme: EchartsTheme) {
        /* FIXME 这里有可能会出问题 */
        const option = this.getOption();
        this.echartsComponent.dispose();
        this.echartsComponent = echarts.init(
            this.echartsComponent.getDom(),
            theme,
            { locale: userLang }
        );
        this.echartsComponent.setOption(option);
    }
}
