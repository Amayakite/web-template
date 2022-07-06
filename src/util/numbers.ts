export default class NumbersUtil {
    /**
     * 生成指定范围的随机整数
     * @param min 最小值
     * @param max 最大值
     * @returns  返回一个随机数
     * @example
     * random(1, 10) // 1 ~ 10
     */
    static random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
