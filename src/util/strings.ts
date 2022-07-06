export default class StringUtil {
    /**
     * 将驼峰命名的字符串转换成下划线命名，如：helloWorld => hello_world
     * @param str  字符串
     * @returns  转换成下划线命名后的字符串
     * @example
     * toUnderline('helloWorld') // hello_world
     */
    static toUnderlineCase = (str: string): string => {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    };

    /**
     * 将下划线命名的字符串转换成驼峰命名，如：hello_world => helloWorld
     * @param str  字符串
     * @returns  转换成驼峰后的字符串
     * @example
     * toCamelCase('hello_world') // helloWorld
     */
    static toCamelCaseInUnderLine = (str: string): string => {
        return str.replace(/_(.)/g, function (_, letter) {
            return letter.toUpperCase();
        });
    };

    /**
     * 将驼峰字符串转换为中横线命名，如：helloWorld => hello-world
     * @param str  字符串
     * @returns  转换成中横线命名后的字符串
     */
    static toHyphenCase = (str: string): string => {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    };

    // 将中横线命名字符串转换为驼峰命名，如：hello-world => helloWorld
    static toCamelCaseInHyphen = (str: string): string => {
        return str.replace(/^([A-Z])|[-_](\w)/g, (_, p1, p2) => {
            if (p2) {
                return p2.toUpperCase();
            }
            return p1.toLowerCase();
        });
    };

    /**
     * 判断字符串是否空白，null、undefined、空字符串（全都是空格、换行、tab都视为空白
     * @param str 字符串
     * @returns 为空返回true，否则返回false
     */
    static isEmpty = (str?: string): boolean => {
        if (str === undefined || str === null) {
            return true;
        }
        // 正则来判断是否全部是空格
        return str.replace(/\s/g, '').length === 0;
    };
    /**
     * 判断字符串是否不空白，null、undefined、空字符串（全都是空格、换行、tab都视为空白
     * @param str 字符串
     * @returns 不为空返回true，否则返回false
     */
    static isNotEmpty = (str?: string): boolean => {
        return !StringUtil.isEmpty(str);
    };

    /**
     * 生成一个随机的UUID
     * @param len  字符串长度 默认32
     * @param withHyphen  是否带中横线 默认true，如果需要中横线则字符串长度必须等于32位(返回值为36位)
     * @returns 随机的UUID
     */
    static randomUUID = (len = 32, withHyphen = true) => {
        let uuid = '';
        for (let i = 0; i < len; i++) {
            uuid += Math.floor(Math.random() * 16).toString(16);
        }
        if (len === 32 && withHyphen) {
            return uuid.replace(
                /([\w]{8})([\w]{4})([\w]{4})([\w]{4})([\w]{12})/,
                '$1-$2-$3-$4-$5'
            );
        }
        return uuid;
    };
    /**
     * 生成随机字符串
     * @param len 长度，默认是16
     * @returns 随机字符串
     */
    static randomString = (len = 16): string => {
        // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
        const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        const maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    };
}
