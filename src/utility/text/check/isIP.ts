
/**
 * 判断指定字符串是否为 IP 地址。
 * @param value 要判断的字符串。
 * @returns 如果检验合法则返回 true，否则返回 false。
 * @example isIP("127.0.0.1") // true
 */
export function isIP(value: string) {
    return /^(?:localhost|::1|(?:[01]?\d?\d|2[0-4]\d|25[0-5])(\.(?:[01]?\d?\d|2[0-4]\d|25[0-5])){3})$/.test(value);
}
