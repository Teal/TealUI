// #todo


interface ObjectConstructor {

    /**
     * 设置对象指定属性的值。
     * @param obj 要设置的对象。
     * @param prop 要设置的属性表达式。如 `a.b[0][6]`。
     * @param value 要设置的值。
     * @returns 返回 *obj*。
     * @example Object.set({}, "a[1].b", 2) // {a:[undefined, {b: 2}]}
     */
    set<T>(obj: T, prop: string, value: any): T;

}

/**
 * 设置对象指定属性的值。
 * @param obj 要设置的对象。
 * @param prop 要设置的属性表达式。如 `a.b[0]`。
 * @param value 要设置的值。
 * @returns 返回 *obj*。
 * @example Object.set({}, "a[1].b", 2) // {a:[undefined, {b: 2}]}
 */
Object.set = function (obj: any, prop: string, value: any) {
    if (obj == null) obj = {};

    let t = obj;
    prop.replace(/\.?\s*([^\.\[]+)|\[\s*([^\]]*)\s*\]/g, (source: string, propName: string, indexer: string, index: number) => {
        let key = propName || indexer;
        if (index + source.length === prop.length) {
            t[key] = value;
        } else {
            if (t[key] == null) t[key] = propName ? {} : [];
            t = t[key];
        }
        return "";
    });

    return obj;
};
