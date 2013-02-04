
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function (elem) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if (!nodeType) {
			// If no nodeType, this is expected to be an array
			for (; (node = elem[i]) ; i++) {
				// Do not traverse comment nodes
				ret += getText(node);
			}
		} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if (typeof elem.textContent === "string") {
				return elem.textContent;
			} else {
				// Traverse its children
				for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText(elem);
				}
			}
		} else if (nodeType === 3 || nodeType === 4) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};


// bug: Safari  e.target 返回文本节点   #504
//  不修复 -ms-  样式
//  不特殊处理  Chrome margin-right 的值。
// getWidth/getHeight  不支持 document
// setStyle("fontSize", NaN)  不被支持





// 可用的宏
//  CompactMode - 兼容模式 - 支持 IE6+ FF3+ Chrome10+ Opera10.5+ Safari5+ , 若无此宏，将只支持 HTML5。



	/**
	 * 获取 Dom 对象第一个元素的返回值。
	 */
	function iterateGetter(dom, getter, args1) {
		return dom.length ? getter(dom[0], args1) : null;
	}

	/**
	 * 遍历 Dom 对象，并对每个元素执行 getter。返回执行后新生成的 Dom 对象。
	 */
	function iterateDom(dom, getter, args1) {
		var ret = new Dom(),
			i = 0,
			j,
			len = dom.length,
			nodelist;
		for (; i < len; i++) {
			nodelist = getter(dom[i], args1);
			for (j = 0; nodelist[j]; j++) {
				if (ret.indexOf(nodelist[j]) < 0) {
					ret[ret.length++] = nodelist[j];
				}
			}
		}

		return ret;
	}



	Dom.iterateGetter = iterateGetter;
	Dom.iterateDom = iterateDom;




//Dom.fetchStyles = function (style, styles) {
//    var ret = {};
//    for (var name in styles) {
//        ret[name] = elem[name];
//    }

//    return ret;
//};





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

/**
 * 对数组每个元素通过一个函数过滤。返回所有符合要求的元素的数组。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * 如果函数返回 **true**，则当前元素会被添加到返回值数组。
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @return {Array} 返回一个新的数组，包含过滤后的元素。
 * @remark 目前除了 IE8-，主流浏览器都已内置此函数。
 * @see #each
 * @see #forEach
 * @see Object.map
 * @example
 * <pre>
 * [1, 7, 2].filter(function (key) {
 * 		return key < 5;
 * })  //  [1, 2]
 * </pre>
 */
filter: function (fn, scope) {
	assert.isFunction(fn, "Array#filter(fn, scope): {fn} ~");
	var r = [];
	ap.forEach.call(this, function (value, i, array) {
		if (fn.call(scope, value, i, array))
			r.push(value);
	});
	return r;
},