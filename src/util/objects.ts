export default class ObjectsUtil {
    /**
     * 判断对象是否为空
     * @param obj 对象
     * @returns 为空返回true，否则返回false
     * @example
     * isEmpty({}) // true
     * isEmpty({a: 1}) // false
     * isEmpty(null) // true
     * isEmpty(undefined) // true
     * isEmpty('') // true
     * isEmpty(' ') // true
     * isEmpty('\n') // true
     */
    static isEmpty = (obj: any): boolean => {
        return (
            obj === undefined || obj === null || Object.keys(obj).length === 0
        );
    };
    /**
     * 深拷贝对象
     * @param obj 要拷贝的对象
     * @returns  拷贝后的对象
     * @example
     * const obj = {a: 1, b: {c: 2}} // obj
     * const copy = deepCopy(obj) // {a: 1, b: {c: 2}}
     */
    static deepCopy<T>(obj: T): T {
        // 如果是基础类型，直接返回
        if (typeof obj !== 'object') {
            return obj;
        }
        // 如果是数组，则返回一个新数组
        if (Array.isArray(obj)) {
            // @ts-ignore
            return obj.map((item) => this.deepCopy(item));
        }
        // 如果是对象，则返回一个新对象
        const newObj = {} as T;
        for (const key in obj) {
            // @ts-ignore
            if (obj.hasOwnProperty(key)) {
                newObj[key] = this.deepCopy(obj[key]);
            }
        }
        return newObj;
    }
}
