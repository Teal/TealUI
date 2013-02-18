

/**
 * 创建一个指定标签的节点，并返回这个节点的 Dom 对象包装对象。
 * @param {String} tagName 要创建的节点标签名。
 * @param {String} className 用于新节点的 CSS 类名。
 * @static
 * @example
 * 动态创建一个 div 元素（以及其中的所有内容），并将它追加到 body 元素中。在这个函数的内部，是通过临时创建一个元素，并将这个元素的 innerHTML 属性设置为给定的标记字符串，来实现标记到 DOM 元素转换的。所以，这个函数既有灵活性，也有局限性。
 * #####JavaScript:
 * <pre>Dom.create("div", "cls").appendTo(document.body);</pre>
 *
 * 创建一个 div 元素同时设定 class 属性。
 * #####JavaScript:
 * <pre>Dom.create("div", "className");</pre>
 * #####结果:
 * <pre lang="htm" format="none">{&lt;div class="className"&gt;&lt;/div&gt;}</pre>
 */
Dom.create = function (tagName, className) {
	assert.isString(tagName, 'Dom.create(tagName, className): {tagName} ~');
	var elem = document.createElement(tagName);
	if (className)
		elem.className = className;
	return new Dom([elem]);
};

// 如果 node 不是原生节点，认为 node 是一个 Dom 对象。
if (!node.nodeType) {

    // 第一个节点，直接添加。
    if (node.length) {
        html = Dom.manip(node[0], html, fn);

        // 其它节点，复制后添加。
        for (i = 1; node[i]; i++) {
            Dom.manip(node[i], html.cloneNode(true), fn);
        }
    }

} else




	//function each(obj, fn) {
	//    for (var i in obj) {
	//        fn(obj[i], i);
	//    }
	//}


	////Dom._find = Dom.find;

	////Dom.find = function (a, b) {
	////	return Dom._find(a, b)[0] || null;
	////}

	//Dom._get = Dom.get;

	//Dom.get = function (a, b) {
	//    return Dom._get(a, b) && Dom._get(a, b)[0] || null;
	//}

	//each(Dom.prototype, function (a, mm) {
	//    if (!Dom[mm]) {
	//        Dom[mm] = function (elem, args1, args2, args3) {
	//            return new Dom([elem])[mm](args1, args2, args3);
	//        };
	//    }
	//});

	//Dom.last = function (elem) {
	//    return new Dom([elem]).last()[0] || null;
	//};

	//Dom.first = function (elem) {
	//    return new Dom([elem]).first()[0] || null;
	//};

	//Dom.next = function (elem) {
	//    return new Dom([elem]).next()[0] || null;
	//};

	//Dom.prev = function (elem) {
	//    return new Dom([elem]).prev()[0] || null;
	//};


	//Dom.remove = function (elem) {
	//    return Dom.prototype.remove.apply(new Dom([elem]), [].slice.call(arguments, 1));
	//}



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


