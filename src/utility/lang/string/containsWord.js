/**
 * 判断字符串是否包含指定单词。
 * @param {String} str 要判断的字符串。
 * @param {String} [separator=' '] 指定单词的分割符，默认为空格。
 * @returns {Boolean} 如果包含指定的单词则返回 @true，否则返回 @false。
 * @example String.containsWord("abc ab", "ab")
 */
String.containsWord = function (str, separator) {
    separator = separator || ' ';
    return (separator ? (separator + this + separator) : this).indexOf(str) >= 0;
};
