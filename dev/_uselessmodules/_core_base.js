


	/**
	 * 将一个字符转为大写。
	 * @param {String} ch 参数。
	 * @param {String} match 字符。
	 * @return {String} 转为大写之后的字符串。
	 */
	function toUpperCase(ch, match) {
		return match.toUpperCase();
	}




/**
 * 将字符串转为骆驼格式。
 * @return {String} 返回的内容。
 * @remark
 * 比如 "awww-bwww-cwww" 的骆驼格式为 "awwBwwCww"
 * @example
 * <pre>
 * "font-size".toCamelCase(); //     "fontSize"
 * </pre>
 */
toCamelCase: function () {
	return this.replace(/-(\w)/g, toUpperCase);
},

/**
 * 将字符首字母大写。
 * @return {String} 处理后的字符串。
 * @example
 * <pre>
 * "aa".capitalize(); //     "Aa"
 * </pre>
 */
capitalize: function () {

	// 使用正则实现。
	return this.replace(/(\b[a-z])/g, toUpperCase);
}



    
///**
// * 快速判断一个节点满足制定的过滤器。
// * @param {Node} elem 元素。
// * @param {String/Function/Undefined} filter 过滤器。
// * @return {Boolean} 返回结果。
// */
//function applyFilter(elem, filter) {
//    return !filter || (typeof filter === 'string' ? /^(?:[-\w:]|[^\x00-\xa0]|\\.)+$/.test(filter) ? elem.tagName === filter.toUpperCase() : Dom.match(elem, filter) : filter(elem));
//}




    
///**
// * 判断一个节点是否有子节点。
// * @param {Dom} dom 子节点。
// * @param {Boolean} allowSelf=false 如果为 true，则当当前节点等于指定的节点时也返回 true 。
// * @return {Boolean} 存在子节点则返回true 。
// */
//dp.contains = function (dom, allowSelf) {
//    if (typeof dom === "string")
//        return (allowSelf && this.match(dom)) || !!this.find(dom).length;

//    return (allowSelf && this[0] === dom) || Dom.contains(this[0], dom);
//};
