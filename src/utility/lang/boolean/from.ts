// #todo


interface BooleanConstructor {

    /**
     * 解析字符串为布尔类型。
     * @param value 要解析的字符串。
     * @returns 返回结果值。如果字符串为空或 `false/0/off/no` 则返回 false，否则返回 true。
     * @example Boolean.from("true")
     */
    from(value: string): boolean;

}

/**
 * 解析字符串为布尔类型。
 * @param value 要解析的字符串。
 * @returns 返回结果值。如果字符串为空或 `false/0/off/no` 则返回 false，否则返回 true。
 * @example Boolean.from("true")
 */
Boolean.from = function (value) {
    return !!value && !/^(false|0|off|no)$/.test(value);
};
