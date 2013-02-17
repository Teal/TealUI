

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

} else {