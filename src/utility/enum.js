/**
 * @author xuld
 */

/**
 * 枚举相关功能。
 */
var Enum = {
    
    /**
     * 根据某个值返回枚举的大小。
     * @param {Object} enumType 枚举类型对象。
     * @param {Number} enumValue 枚举的内容。
     * @returns {String} 返回枚举键。如果不存在则返回空。
     */
    getName: function (enumType, enumValue) {
        for (var key in enumType)
            if (enumType[i] === enumValue)
                return key;
        return null;
    },

    /**
     * 判断指定枚举是否拥有指定的标记位。
     */
    hasFlags: function (enumValue, flags) {
        return (enumValue & flags) === flags;
    },

    /**
     * 设置指定枚举的标记位。
     * @param {Number} enumValue 枚举的内容。
     * @param {Number} flags 设置的标记位。
     * @param {Boolean} value 设置为 true 表示添加标记位，否则是清空标记位。
     */
    setFlag: function (enumValue, flags, value) {
        return value ? enumValue | flags : enumValue & ~flags;
    }

};
