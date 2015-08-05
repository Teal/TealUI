/**
 * @fileOverview 枚举即将常用的字段用统一的数字编码存储表示，程序中使用字段名指代难记的数字。
 * @author xuld
 */

/**
 * 枚举相关功能。
 */
var Enum = {

    // #region @Enum.getName

    /**
     * 根据枚举值返回其枚举名。
     * @param {Object} enumType 枚举类型对象。
     * @param {Number} enumValue 枚举的内容。
     * @returns {String} 返回枚举键。如果不存在则返回 @null。
     * @example Enum.getName(WeekDay, 0) // 'sunday'
     */
    getName: function (enumType, enumValue) {
        for (var key in enumType) {
            if (enumType[key] === enumValue) {
                return key;
            }
        }
        return null;
    },

    // #endregion

    // #region @Enum.hasFlags

    /**
     * 判断指定枚举值是否包含指定的标记位。
     * @param {Number} enumValue 要判断的枚举值。
     * @param {Number} flags 要判断的枚举标记项。
     * @returns {Boolean} 如果包含标记位则返回 @true，否则返回 @false。
     * @example
     * var Flags = {
     *     red: 1 << 1,
     *     yellow: 1 << 2,
     *     blue: 1 << 3,
     * };
     * Enum.hasFlags(Flags.red | Flags.yellow, Flags.red); // true
     */
    hasFlags: function (enumValue, flags) {
        return (enumValue & flags) === flags;
    },

    // #endregion

    // #region @Enum.setFlag

    /**
     * 设置指定枚举的标记位。
     * @param {Number} enumValue 要判断的枚举值。
     * @param {Number} flags 要设置的枚举标记项。
     * @param {Boolean} value 如果设置为 @true 表示添加标记位，否则清空标记位。
     * @returns {Number} 返回更新后的枚举值。
     * @example
     * var Flags = {
     *     red: 1 << 1,
     *     yellow: 1 << 2,
     *     blue: 1 << 3,
     * };
     * var flag = 0;
     * flag = Enum.setFlag(flag, Flags.red, true);
     */
    setFlag: function (enumValue, flags, value) {
        return value ? enumValue | flags : enumValue & ~flags;
    }

    // #endregion

};
