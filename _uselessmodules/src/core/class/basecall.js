/**
 * @author xuld
 * @fileOverview 为类提供调用父类函数的功能。
 */

include("core/base.js");

/**
 * 调用父类的成员函数。
 * @param {String} fnName 调用的函数名。
 * @param {Object} [...] 调用的参数。如果不填写此项，则自动将当前函数的全部参数传递给父类的函数。
 * @return {Object} 返回父类函数的返回值。
 * @protected
 * @example
 * <pre>
 *
 * // 创建一个类 A
 * var A = new Class({
 *    fn: function (a, b) {
 * 	    alert(a + b);
 *    }
 * });
 *
 * // 创建一个子类 B
 * var B = A.extend({
 * 	  fn: function (a, b) {
 * 	    this.base('fn'); // 子类 B#a 调用父类 A#a
 * 	    this.base('fn', 2, 4); // 子类 B#a 调用父类 A#a
 *    }
 * });
 *
 * new B().fn(1, 2); // 输出 3 和 6
 * </pre>
 */
Class.Base.prototype.base = function (fnName) {

	var me = this.constructor,

		fn = this[fnName],

		oldFn = fn,

		args = arguments;

	assert(fn, "Class.Base#base(fnName, args): 子类不存在 {fnName} 的属性或方法。", fnName);

	// 标记当前类的 fn 已执行。
	fn.$bubble = true;

	assert(!me || me.prototype[fnName], "Class.Base#base(fnName, args): 父类不存在 {fnName} 的方法。", fnName);

	// 保证得到的是父类的成员。

	do {
		me = me.base;
		assert(me && me.prototype[fnName], "Class.Base#base(fnName, args): 父类不存在 {fnName} 的方法。", fnName);
	} while ('$bubble' in (fn = me.prototype[fnName]));

	assert.isFunction(fn, "Class.Base#base(fnName, args): 父类的成员 {fn}不是一个函数。  ");

	fn.$bubble = true;

	// 确保 bubble 记号被移除。
	try {
		if (args.length <= 1)
			return fn.apply(this, args.callee.caller.arguments);
		args[0] = this;
		return fn.call.apply(fn, args);
	} finally {
		delete fn.$bubble;
		delete oldFn.$bubble;
	}
};
