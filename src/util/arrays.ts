import ObjectsUtil from '@util/objects';

export default class ArrayUtils {
    /**
     * 在一个集合中删除掉指定的元素，返回新的集合
     * @param array 集合
     * @param items 元素
     * @returns 不包含指定元素的集合
     */
    static remove<T>(array: T[], ...items: T[]): T[] {
        return array.filter((item) => !items.includes(item));
    }

    /**
     * 去重一个集合
     * @param array 集合
     * @returns  去重后的集合
     */
    static distinct<T>(array: T[]): T[] {
        // 获取每个元素，并且通过ObjectsUtil.equals判断是否相等 如果相等表示重复，则返回false，否则返回true
        return array.filter((item, index, self) => {
            return self.findIndex((t) => ObjectsUtil.equals(t, item)) === index;
        });
    }
}
