
/**
 * 判断指定字符串是否为网址。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isUrl("http://teal.github.io/") // true
 */
export default function isUrl(value: string) {
    return /^(\w+:)?\/\/.+$/.test(value);
}
