// #todo


interface Array<T> {

    /**
     * 合并当前数组和另一个数组并返回一个新数组。
     * @param other 要合并的数组。
     * @returns 返回新数组。
     * @example ["I", "love"].concat(["you"]); // ["I", "love", "you"]
     * @since ES4
     */
    concat(other: T[]);

}

if (!Array.prototype.concat) {

    /**
     * 合并当前数组和另一个数组并返回一个新数组。
     * @param other 要合并的数组。
     * @returns 返回新数组。
     * @example ["I", "love"].concat(["you"]); // ["I", "love", "you"]
     * @since ES4
     */
    Array.prototype.concat = function (other) {
        var result = this.slice(0);
        result.push.apply(result, other);
        return result;
    };

}
