
interface ObjectConstructor {

    /**
     * 在对象指定键之前插入一个键值对。
     * @param obj 要插入的对象。
     * @param refKey 插入的位置。新键值对将插入在指定的键前。如果指定键不存在则插入到末尾。
     * @param newKey 新插入的键。
     * @param newValue 新插入的值。
     * @returns 返回 *obj*。
     * @example Object.insertBefore({a:1}, 'a', 'b', 2) // {b:2, a: 1}
     */
    insertBefore(obj: any, refKey: string, newKey: string, newValue: any);

}

/**
 * 在对象指定键之前插入一个键值对。
 * @param obj 要插入的对象。
 * @param refKey 插入的位置。新键值对将插入在指定的键前。如果指定键不存在则插入到末尾。
 * @param newKey 新插入的键。
 * @param newValue 新插入的值。
 * @returns 返回 *obj*。
 * @example Object.insertBefore({a:1}, 'a', 'b', 2) // {b:2, a: 1}
 */
Object.insertBefore = function (obj, refKey, newKey, newValue) {
    // #assert obj != null
    let tmpObj;
    for (let key in obj) {
        if (key === refKey) tmpObj = {};
        if (tmpObj) {
            tmpObj[key] = obj[key];
            delete obj[key];
        }
    }
    obj[newKey] = newValue;
    for (let key in tmpObj) {
        obj[key] = tmpObj[key];
    }
    return obj;
};
