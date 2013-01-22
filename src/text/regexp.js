/**
 * @author xuld
 */

/**
 * 从字符串创建正则式。
 * @param {Object} regexp 字符串。
 * @param {String} flag 标记。
 * @return {RegExp} 返回一个正则表达式对象。
 * @memberOf RegExp
 */
RegExp.create = function (value, flag) {

    assert.isString(value, "RegExp.create(value, flag): {value} ~");
		
    // 正则替换。
    // 返回。
    return new RegExp(value.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1'), flag);
};