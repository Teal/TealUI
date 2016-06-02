// #todo


/**
 * 获取当前时间的时间戳。
 * @returns {Number} 返回当前时间的时间戳。
 * @example Date.now(); // 相当于 new Date().getTime()
 * @since ES5
 */
Date.now = Date.now || function () {
    return +new Date;
};
