/**
 * @fileOverview 定义命名空间以避免组件冲突。
 * @author xuld
 */

/**
 * 定义命名空间。
 * @param {String} ns 要创建的命名空间。
 * @returns {Object} 如果命名空间已存在则返回之前的命名空间，否则返回新创建的命名空间。
 * @example namespace("MyNameSpace.SubNamespace")
 */
function namespace(ns) {
    typeof console === "object" && console.assert(typeof ns === "string", "namespace(ns: 必须是字符串)");

	// 取值，创建。
	ns = ns.split('.');

	// 如果第1个字符是 ., 则表示内置使用的名字空间。
	var current = window, i = -1;

	// 依次创建对象。
	while (++i < ns.length) {
	    current = current[ns[i]] || (current[ns[i]] = {});
	}

	// 如果对象已存在，则拷贝成员到最后一个对象。
	return current;

}