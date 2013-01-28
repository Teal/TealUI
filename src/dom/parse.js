/** * @author xuld */include("dom/base.js");

/**
 * 解析一个 html 字符串，返回相应的原生节点。
 * @param {String/Element} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
 * @param {Element} context=document 生成节点使用的文档中的任何节点。
 * @param {Boolean} cachable=true 指示是否缓存节点。这会加速下次的解析速度。
 * @return {Element/TextNode/DocumentFragment} 如果 HTML 是纯文本，返回 TextNode。如果 HTML 包含多个节点，返回 DocumentFragment 。否则返回 Element。
 * @static
 */Dom.parse = function (html, context, cachable) {

	// 不是 html，直接返回。
	if (typeof html === 'string') {

		var cache = Dom.parse.cache || (Dom.parse.cache = {}),
			srcHTML = html;

		// 仅缓存 512B 以内的 HTML 字符串。
		cachable = cachable !== false && srcHTML.length < 512;
		context = context && context.ownerDocument || document;

		assert(context.createElement, 'Dom.parseNode(html, context, cachable): {context} 必须是 DOM 节点。', context);

		// 查找是否存在缓存。
		if (cachable && (html = cache[srcHTML]) && html.ownerDocument === context) {

			// 复制并返回节点的副本。
			html = html.cloneNode(true);

		} else {

			// 测试查找 HTML 标签。
			var tag = /<([!\w:]+)/.exec(srcHTML);

			if (tag) {

				assert.isString(srcHTML, 'Dom.parseNode(html, context, cachable): {html} ~');
				html = context.createElement("div");

				var wrap = parseFix[tag[1].toLowerCase()] || parseFix.$default;

				// IE8- 会过滤字符串前的空格。
				// 为了保证全部浏览器统一行为，此处删除全部首尾空格。

				html.innerHTML = wrap[1] + srcHTML.trim().replace(rXhtmlTag, "<$1></$2>") + wrap[2];

				// UE67: 如果节点未添加到文档。需要重置 checkbox 的 checked 属性。
				if (navigator.isQuirks) {
					each(html.getElementsByTagName('INPUT'), function (elem) {
						if (rCheckBox.test(elem.type)) {
							elem.checked = elem.defaultChecked;
						}
					});
				}

				// 转到正确的深度。
				// IE 肯能无法正确完成位置标签的处理。
				for (tag = wrap[0]; tag--;)
					html = html.lastChild;

				assert.isNode(html, "Dom.parseNode(html, context, cachable): 无法根据 {html} 创建节点。", srcHTML);

				// 如果解析包含了多个节点。
				if (html.previousSibling) {
					wrap = html.parentNode;

					html = new Dom();
					for (srcHTML = wrap.firstChild; srcHTML; srcHTML = srcHTML.nextSibling) {
						html.push(srcHTML);
					}

					cachable = false;

				} else {

					// 删除用于创建节点的父 DIV 标签。
					html.parentNode.removeChild(html);

					// 一般使用最后的节点， 如果存在最后的节点，使用父节点。
					// 如果有多节点，则复制到片段对象。
					if (cachable && !/<(?:script|object|embed|option|style)/i.test(srcHTML)) {
						cache[srcHTML] = html.cloneNode(true);
					}

					html = new Dom([html]);

				}

			} else {

				// 创建文本节点。
				html = new Dom([context.createTextNode(srcHTML)]);
			}

		}

	} else if(!(html instanceof Dom)) {
		html = Dom.get(html);
	}

	return html;

};