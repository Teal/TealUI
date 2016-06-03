// #todo


interface String {

    /**
     * 获得当前字符串按字节计算的长度（英文算一个字符，中文算两个个字符）。
     * @returns 返回长度值。
     * @example "a中文".byteLength() // 5
     */
    byteLength(): number;

}

/**
 * 获得当前字符串按字节计算的长度（英文算一个字符，中文算两个个字符）。
 * @returns 返回长度值。
 * @example "a中文".byteLength() // 5
 */
String.prototype.byteLength = function () {
    let arr = this.match(/[^\x00-\xff]/g);
    return this.length + (arr ? arr.length : 0);
};
