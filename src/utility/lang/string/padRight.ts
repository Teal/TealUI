
interface String {

    padRight(): string;

}

/**
 * 将字符串扩展到指定长度，不够的部分在右边使用@paddingChar 补齐。
 * @param {Number} totalLength 对齐之后的总长度。
 * @param {String} [paddingChar=" "] 填补空白的字符。
 * @returns {String} 返回处理后的字符串。
 * @example "6".padRight(3, '0'); // "600"
 */
String.prototype.padRight = function (totalLength, paddingChar) {
    return this + new Array(totalLength - this.length + 1).join(paddingChar || " ");
};
