/**
 * 获取枚举类型中定义的字段。
 * @param enumType 枚举类型对象。
 * @return 返回所有键组成的数组。
 */
export function getNames(enumType: object) {
    const result: string[] = [];
    for (const key in enumType) {
        if (typeof (enumType as any)[key] === "number") {
            result.push(key);
        }
    }
    return result;
}

/**
 * 根据枚举值返回其枚举名。
 * @param enumType 枚举类型对象。
 * @param enumValue 枚举的内容。
 * @return 返回枚举键。如果不存在则返回 undefined。
 * @example getName(WeekDay, 0) // 'sunday'
 */
export function getName(enumType: any, enumValue: any) {
    let result = "";
    for (const key in enumType) {
        if (hasFlag(enumValue, enumType[key])) {
            if (result) result += "|";
            result += key;
        }
    }
    return result || undefined;
}

/**
 * 判断指定枚举值是否包含指定的标记位。
 * @param enumValue 要判断的枚举值。
 * @param flags 要判断的枚举标记项。
 * @return 如果包含标记位则返回 true，否则返回 false。
 * @example
 * var Flags = {
 *     red: 1 << 1,
 *     yellow: 1 << 2,
 *     blue: 1 << 3,
 * };
 * Enum.hasFlag(Flags.red | Flags.yellow, Flags.red) // true
 */
export function hasFlag(enumValue: number, flag: number) {
    return (enumValue & flag) === flag;
}

/**
 * 设置指定枚举的标记位。
 * @param enumValue 要判断的枚举值。
 * @param flags 要设置的枚举标记项。
 * @param value 如果设置为 true 表示添加标记位，否则清空标记位。
 * @return 返回更新后的枚举值。
 * @example
 * var Flags = {
 *     red: 1 << 1,
 *     yellow: 1 << 2,
 *     blue: 1 << 3,
 * };
 * var flag = 0;
 * flag = Enum.setFlag(flag, Flags.red, true)
 */
export function setFlag(enumValue: number, flag: number, value: boolean) {
    return value ? enumValue | flag : enumValue & ~flag;
}
