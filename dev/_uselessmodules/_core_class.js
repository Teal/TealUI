




/**
 * 将一个原生的 Javascript 函数对象转换为一个类。
 * @param {Function/Class} constructor 用于转换的对象，将修改此对象，让它看上去和普通的类一样。
 * @return {Function} 返回生成的类。
 * @remark 转换后的类将有继承、扩展等功能。
 * @example <pre>
 * function myFunc(){}
 * 
 * Class.Native(myFunc);
 * 
 * // 现在可以直接使用 implement 函数了。
 * myFunc.implement({
 * 	  a: 2
 * });
 * </pre>
 */
Class.Native = function (constructor) {
	return Object.extend(constructor, Base);
};
