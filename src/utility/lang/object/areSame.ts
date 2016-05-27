
interface ObjectConstructor {

    /**
     * 比较两个引用对象的内容是否相同。
     * @param objX 要比较的第一个对象。
     * @param objY 要比较的第二个对象。
     * @returns 如果比较的对象相同则返回 true，否则返回 false。
     * @example Object.areSame([], []) // true
     */
    areSame(objX: any, objY: any): boolean;

}

/**
 * 比较两个引用对象的内容是否相同。
 * @param objX 要比较的第一个对象。
 * @param objY 要比较的第二个对象。
 * @returns 如果比较的对象相同则返回 true，否则返回 false。
 * @example Object.areSame([], []) // true
 */
Object.areSame = function (objX: any, objY: any) {
    if (objX && objY && typeof objX === "object" && typeof objY === "object") {
        for (let key in objX) {
            if (!Object.areSame(objX[key], objY[key])) {
                return false;
            }
        }
        return true;
    }

    return objX === objY;
};
