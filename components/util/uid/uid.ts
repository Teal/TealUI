/**
 * 生成用户唯一标识。
 * @param length 标识的长度。
 * @param chars 所有可用的字符。
 */
export default function uid(length = 36, chars = "0123456789abcdef") {
    const r = [chars.charAt(Date.now() % chars.length)];
    for (let i = 1; i < length; i++) {
        r[i] = chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return r.join("");
}
