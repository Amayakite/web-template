import dayjs from 'dayjs';
export default class DateTimeUtil {
    /**
     * 获取当前时间戳，单位：毫秒
     * @returns 当前时间戳
     */
    static getTimestamp(): number {
        return Date.now();
    }
    /**
     * 获取当前时间戳，转换成string
     * @returns 当前时间戳
     */
    static getTimestampToString(): string {
        return Date.now().toString();
    }
    /**
     *
     * @param timestamp 时间戳，单位：秒|毫秒 如果是秒（10位）会自动转换成毫秒
     * @returns  DateTime 对象
     * @example
     * DateTimeUtil.getDateTime(1565984000000) // 2019-01-01 00:00:00
     * DateTimeUtil.getDateTime(1565984000000000) // 2019-01-01 00:00:00
     */
    static getDateFromTimestamp(timestamp: number | string): Date {
        // 看看时间戳是否是string
        if (typeof timestamp === 'string') {
            try {
                timestamp = parseInt(timestamp);
            } catch (error) {
                timestamp = 0;
            }
        }
        // 看看长度是否是秒的长度
        if (timestamp.toString().length === 10) {
            timestamp = timestamp * 1000;
        }
        return new Date(timestamp);
    }
    /**
     * 将数值 字符串 或者 date对象转换成时间戳
     * @param value 数值 字符串 或者 date对象
     * @param isSeconds 如果转换的是字符串，传入的是否是秒的长度（10位）
     * 如果传入true，则传入的长度为10时会自动*1000
     * @returns
     */
    static getTimestampFromValue(
        value: string | number | Date,
        isSeconds = false
    ): number {
        if (value instanceof Date) {
            return value.getTime();
        } else {
            if (typeof value === 'string') {
                if (isSeconds && value.length === 10) {
                    return parseInt(value);
                }
                return parseInt(value);
            }
            return value;
        }
    }

    /**
     * 格式化时间
     * @param time 时间戳 或者 Date对象 如果精度是秒会自动转换成毫秒
     * @param format  格式化字符串 可选
     * 详细格式化方式参考[这里](https://dayjs.fenxianglu.cn/category/plugin.html#%E9%AB%98%E7%BA%A7%E6%A0%BC%E5%BC%8F)
     * @returns  格式化后的时间字符串
     * @example
     * DateTimeUtil.formatTime(1565984000000) // 2019-01-01 00:00:00
     * DateTimeUtil.formatTime(1565984000000000) // 2019-01-01 00:00:00
     * DateTimeUtil.formatTime(new Date()) // 2019-01-01 00:00:00
     * DateTimeUtil.formatTime(1565984000000, 'YYYY-MM-DD') // 2019-01-01
     */
    static formatTime(
        time: number | string | Date,
        format = 'YYYY-MM-DD HH:mm:ss'
    ): string {
        let date: Date;
        if (time instanceof Date) {
            date = time;
        } else {
            date = this.getDateFromTimestamp(time);
        }
        return dayjs(date!).format(format);
    }
    /**
     * 获取一个数组中最大或者最小的时间 默认获取最大的
     * @param arr 时间戳|时间数组
     * @param type  获取最大还是最小的时间
     * @returns  最大或者最小的那个对象
     * @example
     * DateTimeUtil.getMaxOrMinTime([1565984000000, 1565984000000]) // 1565984000000
     * DateTimeUtil.getMaxOrMinTime([1565984000000, 1565984000000], 'min') // 1565984000000
     * DateTimeUtil.getMaxOrMinTime([1565984000000, 1565984000000], 'max') // 1565984000000
     */
    static getMaxOrMinTime(
        arr: (string | number | Date)[],
        type: 'max' | 'min' = 'max'
    ): number | string | Date {
        if (arr.length === 0) {
            return 0;
        }
        const returnObj = {
            index: 0,
            time: type === 'max' ? 0 : Number.MAX_VALUE
        };
        if (returnObj.time === 0) {
            for (let i = 0; i < arr.length; i++) {
                const time = this.getTimestampFromValue(arr[i]);
                if (time > returnObj.time) {
                    returnObj.time = time;
                    returnObj.index = i;
                }
            }
        } else {
            for (let i = 0; i < arr.length; i++) {
                let time = arr[i];
                if (typeof time === 'string') {
                    time = parseInt(time);
                } else if (time instanceof Date) {
                    time = time.getTime();
                }
                if (time < returnObj.time) {
                    returnObj.time = time;
                    returnObj.index = i;
                }
            }
        }

        return arr[returnObj.index];
    }
    /**
     * 给一个时间数组排序
     * @param arr 时间戳|时间数组
     * @param sortFunc 排序函数 默认是a-b(也就是从小到大)
     * @returns 排序后的数组
     * @example
     * DateTimeUtil.sortTime([1565984000000, 1565984000000]) // [1565984000000, 1565984000000]
     */
    static sortTime(
        arr: (string | number | Date)[],
        sortFunc: (a: number, b: number) => number = (a, b) => a - b
    ): (string | number | Date)[] {
        const newArr = [...arr];
        newArr.sort((a, b) => {
            // 先将a和b转换成时间戳
            const aTime = DateTimeUtil.getTimestampFromValue(a);
            const bTime = DateTimeUtil.getTimestampFromValue(b);
            return sortFunc(aTime, bTime);
        });
        return newArr;
    }
    /**
     * 获取两个时间之间的时间差
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param isSeconds 传入的单位是否是秒
     * @returns 间隔的毫秒数
     */
    static getTimeInterval(
        startTime: number | string | Date,
        endTime: number | string | Date,
        isSeconds = false
    ): number {
        const start = this.getTimestampFromValue(startTime, isSeconds);
        const end = this.getTimestampFromValue(endTime, isSeconds);
        return end - start;
    }
}
