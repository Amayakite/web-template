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
     * 拷贝对象
     * @param obj 要拷贝的对象
     * @param isDeep? 是否深拷贝 默认否，是的话则会拷贝原型链上的属性
     * @returns  拷贝后的对象
     * @example
     * const obj = {a: 1, b: {c: 2}} // obj
     * const copy = deepCopy(obj) // {a: 1, b: {c: 2}}
     */
    static ObjectCopy<T>(obj: T, isDeep = false): T {
        // 如果是基础类型或者函数之类的，直接返回
        if (typeof obj !== 'object') {
            return obj;
        }
        // 如果是数组，则返回一个新数组
        if (Array.isArray(obj)) {
            // @ts-ignore
            return obj.map((item) => this.ObjectCopy(item, isDeep));
        }
        if (!isDeep) {
            const newObj = {} as T;
            for (const key in obj) {
                // @ts-ignore
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = this.ObjectCopy(obj[key], false);
                }
            }
            return newObj;
        }
        // 获取对象的原型链
        const proto = Object.getPrototypeOf(obj);
        // 创建一个新对象
        const newObj = Object.create(proto);
        // 遍历对象的属性
        for (const key in obj) {
            // @ts-ignore
            if (obj.hasOwnProperty(key)) {
                newObj[key] = this.ObjectCopy(obj[key], isDeep);
            }
        }
        return newObj;
    }
    /**
     * 浅拷贝
     * @param obj 要拷贝的对象
     * @returns  拷贝后的对象
     */
    static shallowCopy<T>(obj: T): T {
        return this.ObjectCopy(obj);
    }
    /**
     * 深拷贝
     * @param obj 要拷贝的对象
     * @returns  拷贝后的对象
     */
    static deepCopy<T>(obj: T): T {
        return this.ObjectCopy(obj, true);
    }

    /**
     * 判断对象是否相等
     * @param obj1 对象1
     * @param obj2 对象2
     * @returns 相等返回true，否则返回false
     */
    static equals(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) {
            return true;
        }
        // 判断是否有一个为空 或者类型不一致
        if (
            this.isEmpty(obj1) ||
            this.isEmpty(obj2) ||
            typeof obj1 !== typeof obj2
        ) {
            return false;
        }
        // 如果是数组
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            // 如果长度不一致，则相等
            if (obj1.length !== obj2.length) {
                return false;
            }
            // 遍历数组，判断每个元素是否相等
            for (let i = 0; i < obj1.length; i++) {
                if (!this.equals(obj1[i], obj2[i])) {
                    return false;
                }
            }
        }
        // 如果是对象，则进行深度比较 先比较原型链
        if (typeof obj1 === 'object') {
            if (Object.getPrototypeOf(obj1) !== Object.getPrototypeOf(obj2)) {
                return false;
            }
            for (const key in obj1) {
                if (!this.equals(obj1[key], obj2[key])) {
                    return false;
                }
            }
        }
        return true;
    }
}
