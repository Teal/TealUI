/**
 * 根据枚举值返回对应的枚举名。
 * @param enumType 枚举类型。
 * @param enumValue 枚举值。
 * @return 返回枚举名。如果枚举值是多个标记位的组合，则返回以“|”分割的所有枚举名。如果找不到匹配的枚举名则返回 undefined。
 * @example getName({sunday: 0}, 0) // "sunday"
 */
export function getName(enumType: any, enumValue: number) {
    let r: string | undefined;
    for (const key in enumType) {
        if (hasFlag(enumValue, enumType[key])) {
            if (r) {
                r += "|";
            } else {
                r = "";
            }
            r += key;
        }
    }
    return r;
}

/**
 * 获取枚举类型中定义的字段。
 * @param enumType 枚举类型。
 * @return 返回所有键组成的数组。
 */
export function getNames(enumType: object) {
    const r: string[] = [];
    for (const key in enumType) {
        if (typeof (enumType as any)[key] === "number") {
            r.push(key);
        }
    }
    return r;
}

/**
 * 判断枚举值是否包含指定的标记位。
 * @param enumValue 要判断的枚举值。
 * @param flags 要判断的标记项。
 * @return 如果枚举值包含所有标记位则返回 true，否则返回 false。
 * @example
 * var Colors = {
 *     red: 1 << 1,
 *     yellow: 1 << 2,
 *     blue: 1 << 3,
 * };
 * var green = Colors.red | Colors.yellow;
 * hasFlag(green, Colors.red); // true
 */
export function hasFlag(enumValue: number, flag: number) {
    return (enumValue & flag) === flag;
}

/**
 * 设置枚举值的标记位。
 * @param enumValue 要设置的枚举值。
 * @param flags 要设置的标记项。
 * @param value 如果为 true 表示添加标记位，否则删除标记位。
 * @return 返回新枚举值。
 * @example
 * var Colors = {
 *     red: 1 << 1,
 *     yellow: 1 << 2,
 *     blue: 1 << 3,
 * };
 * var color = Colors.red;
 * color = setFlag(color, Colors.yellow, true); // Colors.red | Colors.yellow
 */
export function setFlag(enumValue: number, flag: number, value: boolean) {
    return value ? enumValue | flag : enumValue & ~flag;
}
