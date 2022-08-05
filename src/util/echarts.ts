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
    private constructor(uid: string) {
        this.uid = uid;
    }
    private echartsComponent!: echarts.ECharts;
    private setEchartsComponent(echartsComponent: echarts.ECharts) {
        this.echartsComponent = echartsComponent;
        return this;
    }
    /**
     * 用作统一监听window的resize事件
     */
    private static resizeMap: Map<string, MyEcharts> = new Map();
    static {
        window.addEventListener('resize', () => {
            // 遍历resizeMap
            MyEcharts.resizeMap.forEach((value) => {
                value.getEchartsComponent().resize();
            });
        });
    }
    /**
     * 唯一id
     */
    private uid: string;

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
        // 先判断是否已经实例化过
        let myChart = echarts.getInstanceByDom(dom);
        let result: MyEcharts;
        if (myChart !== null && myChart !== undefined) {
            const id = myChart.getId();
            // 这里没有的话就应该报错之类的吧
            result = MyEcharts.resizeMap.get(id)!;
        } else {
            // 获取用户的语言
            myChart = echarts.init(dom, theme, {
                // 根据用户的语言设置echarts的语言
                locale: userLang
            });
            // 判断是否成功
            myChart.setOption(option);
            result = new MyEcharts(myChart.getId()).setEchartsComponent(
                myChart
            );
            MyEcharts.resizeMap.set(myChart.getId(), result);
        }
        return result;
    }
    /**
     * 销毁echarts
     */
    dispose() {
        // 删除全局变量中的对象
        MyEcharts.resizeMap.delete(this.uid);
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
