// #todo


interface Array<T> {

}

if (!Array.isArray) {

    /**
     * 判断一个对象是否是数组。
     * @param {Object} obj 要判断的对象。
     * @returns {Boolean} 如果 @obj 是数组则返回 @true，否则返回 @false。
     * @example
     * Array.isArray([]); // true
     * 
     * Array.isArray(document.getElementsByTagName("div")); // false
     * 
     * Array.isArray(new Array); // true
     * @since ES5
     */
    Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

}
