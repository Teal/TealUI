/** * @author xuld */

//#region Core
/**
 * 搜索所有与指定表达式匹配的元素。
 * @param {String} 用于查找的表达式。
 * @return {NodeList} 返回满足要求的节点的列表。
 * @example
 * 从所有的段落开始，进一步搜索下面的span元素。与Dom.query("p span")相同。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;, how are you?&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").query("span")</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;span&gt;Hello&lt;/span&gt; ]</pre>
 */
dp.query = function (selector) {

	return multipleContexts(selector, this, new Dom());

	assert.isString(selector, "Dom#find(selector): selector ~。");
	assert(selector, "Dom#find(selector): {selector} 不能为空。", selector);
	var elem = this.node, result;

	if (elem.nodeType !== 1) {
		return document.query.call(this, selector)
	}

	try {
		var oldId = elem.id, displayId = oldId;
		if (!oldId) {
			elem.id = displayId = '__SELECTOR__';
			oldId = 0;
		}
		result = elem.querySelectorAll('#' + displayId + ' ' + selector);
	} catch (e) {
		result = query(selector, this);
	} finally {
		if (oldId === 0) {
			elem.removeAttribute('id');
		}
	}



	return new Dom(result);
};

/**
 * 搜索所有与指定CSS表达式匹配的第一个元素。
 * @param {String} selecter 用于查找的表达式。
 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
 * @example
 * 从所有的段落开始，进一步搜索下面的span元素。与Dom.find("p span")相同。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;, how are you?&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").find("span")</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;span&gt;Hello&lt;/span&gt; ]</pre>
 */
dp.find = function (selector) {

	return this.query(selector).item(0);// Selector.one(selector, this[0], new Dom());

	assert.isString(selector, "Dom#find(selector): selector ~");
	var elem = this.node, result;
	if (elem.nodeType !== 1) {
		return document.find.call(this, selector)
	}

	try {
		var oldId = elem.id, displayId = oldId;
		if (!oldId) {
			elem.id = displayId = '__SELECTOR__';
			oldId = 0;
		}
		result = elem.querySelector('#' + displayId + ' ' + selector);
	} catch (e) {
		result = query(selector, this)[0];
	} finally {
		if (oldId === 0) {
			elem.removeAttribute('id');
		}
	}

	return result ? new Dom(result) : null;
};

dp.filter = function (expression) {
	if (typeof expression === 'string') {
		expression = function (elem) {
			return Dom.match(elem, expression);
		};
	}

	var ret = new Dom(), i = 0;
	for (; i < this.length; i++) {
		if (expression(this[i]) !== false) {
			ret.push(this[i]);
		}
	}
	return ret;
};

/**
 * 检查当前 Dom 对象是否符合指定的表达式。
 * @param {String} String
 * @return {Boolean} 如果匹配表达式就返回 true，否则返回  false 。
 * @example
 * 由于input元素的父元素是一个表单元素，所以返回true。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;form&gt;&lt;input type="checkbox" /&gt;&lt;/form&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("input[type='checkbox']").match("input")</pre>
 * #####结果:
 * <pre lang="htm" format="none">true</pre>
 */
dp.match = function (selector) {
	for (var i = 0; i < this.length; i++) {
		if (!Dom.match(this[i], selector)) {
			return false;
		}
	}
	return true;
};

//#endregion

//#region Attribute

dp.getAttribute = function (name, type) {
	return this.length ? Dom.getAttribute(this[0], name, type) : null;
};

dp.setAttribute = function (name, value) {
	return iterate(this, Dom.setAttribute, name, value);
};

dp.getText = function () {
	return this.length ? Dom.getText(this[0]) : null;
};

dp.setText = function (name, value) {
	return iterate(this, Dom.setText, name, value);
};


/**
 * 取得当前 Dom 对象的html内容。
 * @return {String} HTML 字符串。
 * @example
 * 获取 id="a" 的节点的内部 html。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
 * #####JavaScript:
 * <pre>$Dom.query("a").getHtml();</pre>
 * #####结果:
 * <pre lang="htm" format="none">"&lt;p/&gt;"</pre>
 */
dp.getHtml = function () {
	return this.length ? this[0].innerHTML : null;
};

/**
 * 设置当前 Dom 对象的 Html 内容。
 * @param {String} value 用于设定HTML内容的值。
 * @return this
 * @example
 * 设置一个节点的内部 html
 * #####HTML:
 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.get("a").setHtml("&lt;a/&gt;");</pre>
 * #####结果:
 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;a/&gt;&lt;/div&gt;</pre>
 */
dp.setHtml = function (value) {

	var notUseInnerHTML = /<(?:script|style)/i.test(value);

	// 如果存在 <script> 或 <style> ，则不能使用 innerHTML 设置。
	if (!notUseInnerHTML) {
		var i = 0,
			map = parseFix.$default,
			elem;

		while (i < this.length) {

			elem = this[i++];

			try {

				// 对每个子元素清空内存。
				// each(elem.getElementsByTagName("*"), clean);

				// 内部执行 innerHTML 。
				elem.innerHTML = (map[1] + value + map[2]).replace(rXhtmlTag, "<$1></$2>");

				// 如果 innerHTML 出现错误，则直接使用节点方式操作。
			} catch (e) {
				notUseInnerHTML = true;
				break;
			}

			// IE6 需要包装节点，此处解除包装的节点。
			if (map[0] > 0) {
				value = elem.lastChild;
				elem.removeChild(elem.firstChild);
				elem.removeChild(value);
				while (value.firstChild)
					elem.appendChild(value.firstChild);
			}

		}
	}

	if (notUseInnerHTML) {
		this.empty().append(value);
	}

	return this;
};


//#endregion


//#region Event

dp.on = function (type, fn, scope) {
	var i = 0, len = this.length;
	while (i < len) {
		Dom.on(this[i++], type, fn, scope);
	}
	return this;
};

dp.un = function (type, fn) {
	return iterate(this, Dom.un, type, fn);
};

dp.trigger = function (type, e) {
	return iterate(this, Dom.trigger, type, e);
};

// Dom 函数。
map('focus blur select click reset', function (funcName) {
	dp[funcName] = function () {
		return iterate(this, function (elem) {
			elem[funcName]();
		});
	};
});

/**
 * 模拟提交表单。
 */
dp.submit = function () {

	// 当手动调用 submit 的时候，不会触发 submit 事件，因此手动模拟  #8

	return iterate(this, function (elem) {

		var e = new Dom.Event();
		e.target = elem;
		e.type = 'submit';
		Dom.trigger(elem, e.type, e);
		if (e.returnValue !== false) {
			elem.submit();
		}

	});

};

//#endregion

//#region Class


/**
 * 为当前 Dom 对象添加指定的 Css 类名。
 * @param {String} className 一个或多个要添加到元素中的CSS类名，用空格分开。
 * @return this
 * @example
 * 为匹配的元素加上 'selected' 类。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").addClass("selected");</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt; ]</pre>
 *
 * 为匹配的元素加上 selected highlight 类。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").addClass("selected highlight");</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;p class="selected highlight"&gt;Hello&lt;/p&gt; ]</pre>
 */
dp.addClass = function (className) {
	assert.isString(className, "Dom#addClass(className): {className} ~");

	return iterate(this, function (elem, className, classList) {

		// 加速为不存在 class 的元素设置 class 。
		if (elem.className || classList.length === 1) {
			className = " " + elem.className + " ";

			for (var i = 0; i < classList.length; i++) {
				if (className.indexOf(" " + classList[i] + " ") < 0) {
					className += classList[i] + " ";
				}
			}

		}

		elem.className = className.trim();

	}, className, className.split(/\s+/));

};

/**
 * 从当前 Dom 对象中删除全部或者指定的类。
 * @param {String} [className] 一个或多个要删除的CSS类名，用空格分开。如果不提供此参数，将清空 className 。
 * @return this
 * @example
 * 从匹配的元素中删除 'selected' 类
 * #####HTML:
 * <pre lang="htm" format="none">
 * &lt;p class="selected first"&gt;Hello&lt;/p&gt;
 * </pre>
 * #####JavaScript:
 * <pre>Dom.query("p").removeClass("selected");</pre>
 * #####结果:
 * <pre lang="htm" format="none">
 * [ &lt;p class="first"&gt;Hello&lt;/p&gt; ]
 * </pre>
 */
dp.removeClass = function (className) {
	assert(!className || className.split, "Dom#removeClass(className): {className} ~");

	return iterate(this, function (elem, className, classList) {

		if (className) {
			className = " " + elem.className + " ";
			for (var i = classList.length; i--;) {
				className = className.replace(" " + classList[i] + " ", " ");
			}
			className = className.trim();
		}

		elem.className = className;

	}, className, className && className.split(/\s+/));

};

/**
 * 如果存在（不存在）就删除（添加）一个类。
 * @param {String} className CSS类名。
 * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
 * @return this
 * @see #addClass
 * @see #removeClass
 * @example
 * 为匹配的元素切换 'selected' 类
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").toggleClass("selected");</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt;, &lt;p&gt;Hello Again&lt;/p&gt; ]</pre>
 */
dp.toggleClass = function (className, state) {

	return this.length === 1 ? this[(state == undefined ? this.hasClass(className) : !state) ? 'removeClass' : 'addClass'](className) : iterate(this, function (elem) {
		new Dom([elem]).toggleClass(className, state);
	});
};

/**
 * 检查当前 Dom 对象是否含有某个特定的类。
 * @param {String} className 要判断的类名。只允许一个类名。
 * @return {Boolean} 如果存在则返回 true。
 * @example
 * 隐藏包含有某个类的元素。
 * #####HTML:
 * <pre lang="htm" format="none">
 * &lt;div class="protected"&gt;&lt;/div&gt;&lt;div&gt;&lt;/div&gt;
 * </pre>
 * #####JavaScript:
 * <pre>Dom.query("div").on('click', function(){
 * 	if ( this.hasClass("protected") )
 * 		this.hide();
 * });
 * </pre>
 */
dp.hasClass = function (className) {
	var i = 0;
	while (i < this.length) {
		if (Dom.hasClass(this[i++], className)) {
			return true;
		}
	}
	return false;
};

//#endregion

//#region Traversing



/**
 * 获取当前 Dom 对象的第一个子节点对象。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
 * @example
 * 获取匹配的第二个元素
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").first(1)</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
 */
dp.first = createTreeWalker('nextSibling', 'firstChild');

/**
 * 获取当前 Dom 对象的最后一个子节点对象。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
 * @example
 * 获取匹配的第二个元素
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").getChild(1)</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
 */
dp.last = createTreeWalker('previousSibling', 'lastChild');

/**
 * 获取当前 Dom 对象的下一个相邻节点对象。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
 * @example
 * 找到每个段落的后面紧邻的同辈元素。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").getNext()</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;p&gt;Hello Again&lt;/p&gt;, &lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt; ]</pre>
 */
dp.next = createTreeWalker('nextSibling');

/**
 * 获取当前 Dom 对象的上一个相邻的节点对象。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
 * @example
 * 找到每个段落紧邻的前一个同辈元素。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").getPrevious()</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt; ]</pre>
 *
 * 找到每个段落紧邻的前一个同辈元素中类名为selected的元素。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/div&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").getPrevious("div")</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
 */
dp.prev = createTreeWalker('previousSibling');

/**
 * 获取当前 Dom 对象的全部直接子节点。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {NodeList} 返回满足要求的节点的列表。
 * @example
 *
 * 查找DIV中的每个子元素。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("div").getChildren()</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;span&gt;Hello Again&lt;/span&gt; ]</pre>
 *
 * 在每个div中查找 div。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;&lt;/div&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("div").getChildren("div")</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
 */
dp.children = createTreeDir('nextSibling', 'firstChild');

/**
 * 获取当前 Dom 对象以后的全部相邻节点对象。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {Dom} 返回一个 Dom 对象。
 */
dp.nextAll = createTreeDir('nextSibling');

/**
 * 获取当前 Dom 对象以前的全部相邻节点对象。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {Dom} 返回一个 Dom 对象。
 */
dp.prevAll = createTreeDir('previousSibling');

/**
 * 获取当前 Dom 对象以上的全部相邻节点对象。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {Dom} 返回一个 Dom 对象。
 */
dp.parents = createTreeDir('parentNode');

/**
 * 获取当前 Dom 对象的全部兄弟节点对象。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {Dom} 返回一个 Dom 对象。
 */
dp.siblings = function (filter) {
	var ret = this.prevAll(filter);
	ret.push.apply(ret, this.nextAll(filter));
	return ret;
};

/**
 * 获取当前 Dom 对象的在原节点的位置。
 * @param {Boolean} args=true 如果 args 为 true ，则计算文本节点。
 * @return {Number} 位置。从 0 开始。
 */
dp.index = function (filter) {
	if (!this.length) {
		return -1;
	}
	var i = 0, elem = this[0];
	while (elem = elem.previousSibling)
		if (elem.nodeType === 1 || filter === null)
			i++;
	return i;
};

/**
 * 获取当前 Dom 对象的指定位置的直接子节点。
 * @param {Integer} index 用于查找子元素的 CSS 选择器 或者 元素在 Dom 对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。如果 args 是小于 0 的数字，则从末尾开始计算。
 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
 * @example
 * 获取第1个子节点。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.find("span").child(1)</pre>
 */
dp.child = function (index) {

	//assert(typeof index === 'function' || typeof index === 'number' || typeof index === 'string' , 'Dom#child(index): {index} 必须是函数、数字或字符串。');

	var first = 'firstChild',
		next = 'nextSibling';

	if (index < 0) {
		index = ~index;
		first = 'lastChild';
		next = 'previousSibling';
	}

	first = this.length && this[0][first];

	while (first) {
		if (first.nodeType === 1 && index-- <= 0) {
			return new Dom([first]);
		}

		first = first[next];
	}

	return new Dom();
};

/**
 * 获取当前 Dom 对象的父节点对象。
 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在 Dom 对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
 * @example
 * 找到每个span元素的所有祖先元素。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.find("span").parent()</pre>
 */
dp.parent = createTreeWalker('parentNode');

/**
 * 编辑当前 Dom 对象及父节点对象，找到第一个满足指定 CSS 选择器或函数的节点。
 * @param {String/Function} [filter] 用于判断的元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
 * @param {Dom/String} [context=document] 只在指定的节点内搜索此元素。
 * @return {Dom} 如果当前节点满足要求，则返回当前节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
 * @remark
 * closest 和 parent 最大区别就是 closest 会测试当前的元素。
 */
dp.closest = function (selector, context) {
	var ret = new Dom();
	var node = this.length && this[0];

	while (node) {
		if (Dom.match(node, selector)) {
			if (!context || Dom.query(context).contains(node))
				ret.push(node);
			break;
		}

		node = node.parentNode;
	}

	return ret;
};





//#endregion




//#region Set

/**
 * 快速设置当前 Dom 对象的样式、属性或事件。
 * @param {String/Object} name 属性名。可以是一个 css 属性名或 html 属性名。如果属性名是on开头的，则被认为是绑定事件。 - 或 - 属性值，表示 属性名/属性值 的 JSON 对象。
 * @param {Object} [value] 属性值。
 * @return this
 * @remark
 * 此函数相当于调用 setStyle 或 setAttr 。数字将自动转化为像素值。
 * @example
 * 将所有段落字体设为红色、设置 class 属性、绑定 click 事件。
 * <pre>
 * Dom.query("p").set("color","red").set("class","cls-red").set("onclick", function(){alert('clicked')});
 * </pre>
 *
 * - 或 -
 *
 * <pre>
 * Dom.query("p").set({
 * 		"color":"red",
 * 		"class":"cls-red",
 * 		"onclick": function(){alert('clicked')}
 * });
 * </pre>
 */
dp.set = function (options, value) {

	var key,
		setter;

	// .set(key, value)
	if (typeof options === 'string') {
		key = options;
		options = {};
		options[key] = value;
	}

	for (key in options) {
		value = options[key];

		// .setStyle(css, value)
		if (key in document.documentElement.style)
			this.setStyle(key, value);

			// .on(event, value)
		else if (/^on(\w+)/.test(key))
			value ? this.on(RegExp.$1, value) : this.un(RegExp.$1);

			// .setAttribute(attr, value);
		else
			this.setAttribute(key, value);

	}

	return this;
};

//#endregion

//#region Clone

dp.clone = function (deep, cloneDataAndEvent, keepId) {
	var ret = new Dom();
	for (var i = 0; i < this.length; i++) {
		ret[ret.length++] = Dom.clone(this[i], deep, cloneDataAndEvent, keepId);
	}
	return ret;
};

//#endregion

//#region Manipulation

/**
 * 将当前 Dom 对象添加到其它节点或 Dom 对象中。
 * @param {Node/String} parent=document.body 节点 Dom 对象或节点的 id 字符串。
 * @return this
 * @remark
 * this.appendTo(parent) 相当于 parent.append(this) 。
 * @example
 * 把所有段落追加到ID值为foo的元素中。
 * #####HTML:
 * <pre lang="htm" format="none">
 * &lt;p&gt;I would like to say: &lt;/p&gt;&lt;div id="foo"&gt;&lt;/div&gt;
 * </pre>
 * #####JavaScript:
 * <pre>Dom.query("p").appendTo("foo");</pre>
 * #####结果:
 * <pre lang="htm" format="none">
 * &lt;div id="foo"&gt;&lt;p&gt;I would like to say: &lt;/p&gt;&lt;/div&gt;
 * </pre>
 *
 * 创建一个新的div节点并添加到 document.body 中。
 * <pre>
 * Dom.create("div").appendTo();
 * </pre>
 */
dp.appendTo = function (parent) {
	(parent ? Dom.query(parent) : new Dom([document.body])).append(this);
	return this;
};

/**
 * 插入一个HTML 到末尾。
 * @param {String/Node/Dom} html 要插入的内容。
 * @return {Dom} 返回插入的新节点对象。
 */
dp.append = function (html) {
	return Dom.manip(this, function (elem, node) {
		elem.appendChild(node);
	}, html);
};

/**
 * 插入一个HTML 到顶部。
 * @param {String/Node/Dom} html 要插入的内容。
 * @return {Dom} 返回插入的新节点对象。
 */
dp.prepend = function (html) {
	return Dom.manip(this, function (elem, node) {
		elem.insertBefore(node, elem.firstChild);
	}, html);
};

/**
 * 插入一个HTML 到前面。
 * @param {String/Node/Dom} html 要插入的内容。
 * @return {Dom} 返回插入的新节点对象。
 */
dp.before = function (html) {
	return Dom.manip(this, function (elem, node) {
		elem.parentNode && elem.parentNode.insertBefore(node, elem);
	}, html);
};

/**
 * 插入一个HTML 到后面。
 * @param {String/Node/Dom} html 要插入的内容。
 * @return {Dom} 返回插入的新节点对象。
 */
dp.after = function (html) {
	return Dom.manip(this, function (elem, node) {
		elem.parentNode && elem.parentNode.insertBefore(node, elem.nextSibling);
	}, html);
};

/**
 * 将一个节点用另一个节点替换。
 * @param {String/Node/Dom} html 用于将匹配元素替换掉的内容。
 * @return {Element} 替换之后的新元素。
 * 将所有匹配的元素替换成指定的HTML或DOM元素。
 * @example
 * 把所有的段落标记替换成加粗的标记。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;cruel&lt;/p&gt;&lt;p&gt;World&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").replaceWith("&lt;b&gt;Paragraph. &lt;/b&gt;");</pre>
 * #####结果:
 * <pre lang="htm" format="none">&lt;b&gt;Paragraph. &lt;/b&gt;&lt;b&gt;Paragraph. &lt;/b&gt;&lt;b&gt;Paragraph. &lt;/b&gt;</pre>
 *
 * 用第一段替换第三段，可以发现他是移动到目标位置来替换，而不是复制一份来替换。
 * #####HTML:<pre lang="htm" format="none">
 * &lt;div class=&quot;container&quot;&gt;
 * &lt;div class=&quot;inner first&quot;&gt;Hello&lt;/div&gt;
 * &lt;div class=&quot;inner second&quot;&gt;And&lt;/div&gt;
 * &lt;div class=&quot;inner third&quot;&gt;Goodbye&lt;/div&gt;
 * &lt;/div&gt;
 * </pre>
 * #####JavaScript:
 * <pre>Dom.find('.third').replaceWith(Dom.find('.first'));</pre>
 * #####结果:
 * <pre lang="htm" format="none">
 * &lt;div class=&quot;container&quot;&gt;
 * &lt;div class=&quot;inner second&quot;&gt;And&lt;/div&gt;
 * &lt;div class=&quot;inner first&quot;&gt;Hello&lt;/div&gt;
 * &lt;/div&gt;
 * </pre>
 */
dp.replaceWith = function (html) {
	return Dom.manip(this, function (elem, node) {
		var parent = elem.parentNode;
		if (parent) {
			parent.insertBefore(node, elem);
			parent.removeChild(elem);
		}
	}, html);
};

/**
 * 移除当前 Dom 对象或其子对象。
 * @param {Dom} [child] 如果指定了子对象，则删除此对象。
 * @return this
 * @see #dispose
 * @remark
 * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
 * 如果需要彻底删除 Dom 对象，使用 {@link #dispose}方法。
 * @example
 * 从DOM中把所有段落删除。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").remove();</pre>
 * #####结果:
 * <pre lang="htm" format="none">how are</pre>
 *
 * 从DOM中把带有hello类的段落删除
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").remove(".hello");</pre>
 * #####结果:
 * <pre lang="htm" format="none">how are &lt;p&gt;you?&lt;/p&gt;</pre>
 */
dp.remove = function (child) {
	assert(!arguments.length || child, 'Dom#remove(child): {child} 不是合法的节点', child);

	// 判断是删除子节点还是删除本身。
	child = arguments.length ? Dom.query(child, this) : this;

	for (var i = 0, elem; elem = child[i]; i++) {
		elem.parentNode && elem.parentNode.removeChild(elem);
	}

	return this;
};

/**
 * 删除一个节点的所有子节点。
 * @return this
 * @example
 * 把所有段落的子元素（包括文本节点）删除。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello, &lt;span&gt;Person&lt;/span&gt; &lt;a href="#"&gt;and person&lt;/a&gt;&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").empty();</pre>
 * #####结果:
 * <pre lang="htm" format="none">&lt;p&gt;&lt;/p&gt;</pre>
 */
dp.empty = function () {
	for (var i = 0, elem; elem = this[i]; i++) {

		// 删除全部节点。
		while (elem.lastChild) {
			elem.removeChild(elem.lastChild);
		}

		// IE678 中, 删除 <select> 中的选中项。
		if (elem.options && elem.nodeName === "SELECT") {
			elem.options.length = 0;
		}
	}

	return this;
};

/**
 * 彻底删除当前 DOM 对象。释放占用的所有资源。
 * @see #remove
 * @remark 这个方法会同时删除节点绑定的事件以及所有的数据。
 * @example
 * 从DOM中把所有段落删除。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;dispose&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").dispose();</pre>
 * #####结果:
 * <pre lang="htm" format="none">how are</pre>
 *
 * 从DOM中把带有hello类的段落删除。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").dispose(".hello");</pre>
 */
dp.dispose = function () {
	return iterate(this, function (elem) {

		if (elem.nodeType == 1) {
			Object.each(elem.getElementsByTagName("*"), clean);
			clean(elem);
		}

		elem.parentNode && elem.parentNode.removeChild(elem);

	});
};

//#endregion