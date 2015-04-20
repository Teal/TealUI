/**
 * @author xuld
 */

var Enum = function(data) {
	if (!this instanceof Enum) {
		return new Enum(data);
	}

	return Object.extend(this, data);
};

/**
 * 根据某个值返回枚举的大小。
 * @param {Object} enumObj 枚举类型对象。
 * @param {Number} enumValue 枚举的内容。
 */
Enum.getName = function(enumObj, enumValue){
	for(var i in enumObj)
		if( enumObj[i] === enumValue)
			return i;
	return null;
};