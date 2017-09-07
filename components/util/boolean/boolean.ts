/**
 * 将指定的字符串转为布尔型。
 * @param value 要转换的字符串。
 * @return 如果字符串为空或 `false`/`0`/`off`/`no` 则返回 false，否则返回 true。
 * @example parse("true") // true
 */
export function parse(value: string | null | undefined) {
    return !!value && !/^(false|0|off|no)$/.test(value);
}
