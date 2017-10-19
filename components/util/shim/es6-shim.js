define(["require", "exports", "./shim"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 判断两个对象是否相等。
     * @param obj1 要比较的第一个对象。
     * @param obj2 要比较的第二个对象。
     * @return 如果对象相等则返回 true，否则返回 false。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    Object.is = Object.is || function (obj1, obj2) {
        if (obj1 === obj2) {
            return obj1 !== 0 || 1 / obj1 === 1 / obj2;
        }
        else {
            return obj1 !== obj1 && obj2 !== obj2;
        }
    };
    /**
     * 设置对象的原型。
     * @param obj 对象。
     * @param proto 要设置的原型。
     * @example setPrototypeOf({}, {a: 2}).a // 2
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
     */
    Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
        obj.__proto__ = proto;
        return obj;
    };
    /**
     * 填充数组每个项为指定的值。
     * @param value 要填充的值。
     * @param startIndex 开始填充的索引（从 0 开始）。
     * @param endIndex 结束填充的索引（从 0 开始，不含）。
     * @example [1, 2].fill(1)
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
     */
    Array.prototype.fill = Array.prototype.fill || function (value, startIndex, endIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        if (endIndex === void 0) { endIndex = this.length; }
        for (; startIndex < endIndex; startIndex++) {
            this[startIndex] = value;
        }
        return this;
    };
    /**
     * 判断一个数字是否是整数。
     * @param obj 要判断的数字。
     * @return 如果是整数则返回 true，否则返回 false。
     * @example isInteger(7) // true
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
     */
    Number.isInteger = Number.isInteger || (function (value) { return typeof value === "number" && isFinite(value) && Math.floor(value) === value; });
});
//# sourceMappingURL=es6-shim.js.map