
//#include core/class.js
//#exclude dom/base.js

var Dom = (function($){

	//#region Core

	/**
	 * Object.extend 简写。
	 * @type Function
	 */
	var extend = Object.extend,

		/**
		 * 数组原型。
		 * @type Object
		 */
		ap = Array.prototype,

		/**
		 * 用于测试的元素。
		 * @type Element
		 */
		html = document.documentElement,

		Dom = function (nodelist, context) {
			return $(nodelist, context);
		},

		/**
		 * Dom.prototype 简写。
		 */
		dp = Dom.prototype = $.prototype;

	extend(Dom, Class.Base);

	dp.item = function (index) {
		var node = this[index < 0 ? this.length + index : index];
		return new Dom(node && [node]);
	};

	dp.access = function (getter, setter, args, valueIndex, emptyGet) {

		// 如果参数够数，则设置属性，否则为获取属性。
		if (args.length > valueIndex) {
			for (var i = 0, len = this.length; i < len; i++) {
				setter(this[i], args[0], args[1])
			}
			return this;
		}

		return this.length ? getter(this[0], args[0], args[1]) : emptyGet;
	};

	dp.iterate = function (fn, args) {
		var i = 0, len = this.length;
		ap.unshift.call(args, 0);
		while (i < len) {
			args[0] = this[i++];
			fn.apply(Dom, args);
		}
		return this;
	};

	dp.indexOf = ap.indexOf;

	dp.forEach = ap.each;

	// 复制数组函数。
	Object.map("splice slice sort unique", function (fnName, index) {
		dp[fnName] = function () {
			return new Dom(ap[fnName].apply(this, arguments));
		};
	});

	function proxy(fn) {
		return function (elem) {
			return $.fn[fn].apply($(elem), ap.slice.call(arguments, 1));
		};
	}

	//#endregion

	//#region Helper

	/**
	 * 获取元素的文档。
	 * @param {Node} node 元素。
	 * @return {Document} 文档。
	 */
	function getDocument(node) {
		////assert.isNode(node, 'Dom.getDocument(node): {node} ~', node);
		return node.ownerDocument || node.document || node;
	}

	/**
	 * 执行一个 CSS 选择器，返回一个新的 {@link Dom} 对象。
	 * @param {String/NodeList/Dom/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点列表。
	 * @return {Element} 如果没有对应的节点则返回一个空的 Dom 对象。
	 * @static
	 * @see Dom
	 * @example
	 * 找到所有 p 元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 * </pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.query("p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * [  &lt;p&gt;one&lt;/p&gt; ,&lt;p&gt;two&lt;/p&gt;, &lt;p&gt;three&lt;/p&gt;  ]
	 * </pre>
	 * 
	 * <br>
	 * 找到所有 p 元素，并且这些元素都必须是 div 元素的子元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.query("div &gt; p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * [ &lt;p&gt;two&lt;/p&gt; ]
	 * </pre>
	 * 
	 * <br>
	 * 查找所有的单选按钮(即: type 值为 radio 的 input 元素)。
	 * <pre>Dom.query("input[type=radio]");</pre>
	 */
	Dom.query = $;

	/**
	 * 根据一个 *id* 或原生节点获取一个 {@link Dom} 类的实例。
	 * @param {String/Node/Dom/Dom} id 要获取元素的 id 或用于包装成 Dom 对象的任何元素，如是原生的 DOM 节点、原生的 DOM 节点列表数组或已包装过的 Dom 对象。。
	 * @return {Dom} 此函数返回是一个 Dom 类型的变量。通过这个变量可以调用所有文档中介绍的 DOM 操作函数。如果无法找到指定的节点，则返回 null 。此函数可简写为 $。
	 * @static
	 * @example
	 * 找到 id 为 a 的元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p id="a"&gt;once&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 * </pre>
	 * #####JavaScript:
	 * <pre>Dom.get("a");</pre>
	 * #####结果:
	 * <pre>{&lt;p id="a"&gt;once&lt;/p&gt;}</pre>
	 * 
	 * <br>
	 * 返回 id 为 a1 的 DOM 对象
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;p id="a1"&gt;&lt;/p&gt; &lt;p id="a2"&gt;&lt;/p&gt; </pre>
	 *
	 * #####JavaScript:
	 * <pre>Dom.get(document.getElecmentById('a1')) // 等效于 Dom.get('a1')</pre>
	 * <pre>Dom.get(['a1', 'a2']); // 等效于 Dom.get('a1')</pre>
	 * <pre>Dom.get(Dom.get('a1')); // 等效于 Dom.get('a1')</pre>
	 * 
	 * #####结果:
	 * <pre>{&lt;p id="a1"&gt;&lt;/p&gt;}</pre>
	 */
	Dom.get = function (id) {
		return typeof id !== "string" ? (!id || id.nodeType || id.setInterval ? id : id[0]) || null : document.getElementById(id);
	};

	/**
	 * 执行一个 CSS 选择器，返回第一个元素对应的 {@link Dom} 对象。
	 * @param {String/NodeList/Dom/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点。
	 * @return {Element} 如果没有对应的节点则返回一个空的 Dom 对象。
	 * @static
	 * @see Dom
	 * @example
	 * 找到第一个 p 元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 * </pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.find("p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * {  &lt;p&gt;one&lt;/p&gt;  }
	 * </pre>
	 * 
	 * <br>
	 * 找到第一个 p 元素，并且这些元素都必须是 div 元素的子元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.find("div &gt; p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * { &lt;p&gt;two&lt;/p&gt; }
	 * </pre>
	 */
	Dom.find = function (selector, context) {
		return typeof selector !== "string" ? (!selector || selector.nodeType || selector.setInterval ? selector : selector[0]) || null : ($.find(selector, context)[0] || null);
	};

	Dom.match = $.find.matchesSelector;

	/**
	 * 获取当前类对应的数据字段。
	 * @protected override
	 * @return {Object} 一个可存储数据的对象。
	 * @remark
	 * 此函数会在原生节点上创建一个 $data 属性以存储数据。
	 */
	Dom.data = $._data;

	/**
	 * 获取元素的文档。
	 * @param {Element} elem 元素。
	 * @return {Document} 文档。
	 * @static
	 */
	Dom.getDocument = getDocument;

	//#endregion

	//#region Parse

	/**
	 * 解析一个 html 字符串，返回相应的原生节点。
	 * @param {String/Element} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
	 * @param {Element} context=document 生成节点使用的文档中的任何节点。
	 * @param {Boolean} cachable=true 指示是否缓存节点。这会加速下次的解析速度。
	 * @return {Element/TextNode/DocumentFragment} 如果 HTML 是纯文本，返回 TextNode。如果 HTML 包含多个节点，返回 DocumentFragment 。否则返回 Element。
	 * @static
	 */
	Dom.parseNode = function (html, context, cachable) {

		// 不是 html，直接返回。
		if (typeof html === 'string') {
			html = $.parseHTML(html);
			if (html.length === 1) {
				html = html[0];
			}
		}

		return html;

	};

	/**
	 * 根据提供的原始 HTML 标记字符串，解析并动态创建一个节点，并返回这个节点的 Dom 对象包装对象。
	 * @param {String/Node} html 用于动态创建DOM元素的HTML字符串。
	 * @param {Document} ownerDocument=document 创建DOM元素所在的文档。
	 * @param {Boolean} cachable=true 指示是否缓存节点。
	 * @return {Dom} Dom 对象。
	 * @static
	 * @remark
	 * 可以传递一个手写的 HTML 字符串，或者由某些模板引擎或插件创建的字符串，也可以是通过 AJAX 加载过来的字符串。但是在你创建 input 元素的时会有限制，可以参考第二个示例。当然这个字符串可以包含斜杠 (比如一个图像地址)，还有反斜杠。当创建单个元素时，请使用闭合标签或 XHTML 格式。
	 * 在这个函数的内部，是通过临时创建一个元素，并将这个元素的 innerHTML 属性设置为给定的标记字符串，来实现标记到 DOM 元素转换的。所以，这个函数既有灵活性，也有局限性。
	 * 
	 * @example
	 * 动态创建一个 div 元素（以及其中的所有内容），并将它追加到 body 元素中。
	 * #####JavaScript:
	 * <pre>Dom.parse("&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;").appendTo(document.body);</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;]</pre>
	 * 
	 * 创建一个 &lt;input&gt; 元素必须同时设定 type 属性。因为微软规定 &lt;input&gt; 元素的 type 只能写一次。
	 * #####JavaScript:
	 * <pre>
	 * // 在 IE 中无效:
	 * Dom.parse("&lt;input&gt;").setAttr("type", "checkbox");
	 * // 在 IE 中有效:
	 * Dom.parse("&lt;input type='checkbox'&gt;");
	 * </pre>        
	 */
	Dom.parse = function (html, context, cachable) {
		return Dom.query(Dom.parseNode(html, context, cachable));
	};

	//#endregion

	//#region Attribute

	/**
	 * 获取元素的属性值。
	 * @param {Node} elem 元素。
	 * @param {String} name 要获取的属性名称。
	 * @return {String} 返回属性值。如果元素没有相应属性，则返回 null 。
	 * @static
	 */
	Dom.getAttr = Dom.setAttr = $.attr;

	/**
	 * 获取一个元素对应的文本。
	 * @param {Element} elem 元素。
	 * @return {String} 值。对普通节点返回 text 属性。
	 * @static
	 */
	Dom.getText = $.text;

	/**
	 * 设置当前 Dom 对象的文本内容。对于输入框则设置其输入的值。
	 * @param {String} 用于设置元素内容的文本。
	 * @return this
	 * @see #setHtml
	 * @remark 与 {@link #setHtml} 类似, 但将编码 HTML (将 "&lt;" 和 "&gt;" 替换成相应的HTML实体)。
	 * @example
	 * 设定文本框的值。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;input type="text"/&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("input").setText("hello world!");</pre>
	 */
	Dom.setText = proxy('text');

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
	Dom.getHtml = proxy('html');

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
	Dom.setHtml = proxy('html');

	//#endregion

	//#region Style

	//#if CompactMode

	if (typeof html.style.userSelect === 'undefined') {
		$.cssHooks.userSelect = {
			get: function (elem) {
				return styleString(elem, 'userSelect');
			},

			unselectable: 'unselectable' in html ? function (elem, value) {
				elem.unselectable = value ? 'on' : '';
			} : 'onselectstart' in html ? function (elem, value) {
				elem.onselectstart = value ? function () { return false; } : null;
			} : function (elem, value) {
				elem.style.MozUserSelect = value ? 'none' : '';
			},

			set: function (elem, value) {

				if (value === 'none') {
					this.unselectable(elem, true);
				} else if (elem.style.userSelect === 'none') {
					this.unselectable(elem, false);
				}

				elem.style.userSelect = value;
			}
		};
	}

	//#endif

	Dom.camelCase = $.camelCase;

	/**
	 * 根据不同的内容进行计算。
	 * @param {Element} elem 元素。
	 * @param {String} type 要计算的值。一个 type 是一个 js 表达式，它有一些内置的变量来表示元素的相关计算值。预定义的变量有：
	 *
	 *		- ml: marginLeft (同理有 r=right, t=top, b=bottom，x=left+right,y=top+bottom 下同)
	 *		- bl: borderLeftWidth
	 *		- pl: paddingLeft
	 *		- sx: bl + pl + height (同理有 y)
	 *		- css 样式: 如 height, left
	 *
	 * @return {Number} 计算值。
	 * @static
	 */
	Dom.calc = (function () {

		/**
		 * 样式表。
		 * @static
		 * @type Object
		 */
		var parseCache = {},

			init,

			tpl;

		if (window.getComputedStyle) {
			init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
			tpl = '(parseFloat(c["#"])||0)';
		} else {
			init = 'return ';
			tpl = '(parseFloat(Dom.getStyle(e, "#"))||0)';
		}

		/**
		 * 翻译 type。
		 * @param {String} type 输入字符串。
		 * @return {String} 处理后的字符串。
		 */
		function format(type) {
			return tpl.replace('#', type);
		}

		return function (elem, type) {
			////assert.isElement(elem, "Dom.calc(elem, type): {elem} ~");
			////assert.isString(type, "Dom.calc(elem, type): {type} ~");
			return (parseCache[type] || (parseCache[type] = new Function("e", init + type.replace(/\w+/g, format))))(elem);
		}
	})();

	/**
	 * 设置一个元素可拖动。
	 * @param {Element} elem 要设置的节点。
	 * @static
	 */
	Dom.movable = function (elem) {
		////assert.isElement(elem, "Dom.movable(elem): 参数 elem ~");
		if (!/^(?:abs|fix)/.test(styleString(elem, "position")))
			elem.style.position = "relative";
	};

	/**
	 * 读取样式数字。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。必须使用骆驼规则的名字。
	 * @return {String} 字符串。
	 * @static
	 */
	Dom.getStyle = Dom.styleString = function (elem, name) {
		return $(elem).css(name);
	};

	/**
	 * 读取样式数字。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。必须使用骆驼规则的名字。
	 * @return {String} 字符串。
	 * @static
	 */
	Dom.styleNumber = function (elem, name) {
		return parseFloat(Dom.styleString(elem, name)) || 0;
	};

	/**
	 * 判断当前元素是否是隐藏的。
	 * @return {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
	 */
	Dom.isHidden = function (elem) {
		return Dom.styleString(elem, 'display') === 'none';
	};

	/**
	 * 设置一个样式属性的值。
	 * @param {String} name CSS 属性名或 CSS 字符串。
	 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则会自动添加像素单位。
	 * @return this
	 * @example
	 * 将所有段落的字体颜色设为红色并且背景为蓝色。
	 * <pre>Dom.query("p").setStyle('color', "#ff0011");</pre>
	 */
	Dom.setStyle = function (elem, name, value) {
		$(elem).css(name, value);
	};

	//#endregion

	//#region Event

	Dom.defineEvents = function (events, hooks) {

		var eventFix = $.event.special;

		map(events, function (eventName) {

			// 支持 bind 字段：自动添加和删除指定的父事件。
			if (hooks.bindType) {

				hooks.add = function (elem, type, fn) {
					Dom.addListener(elem, this.bindType, fn);
				};

				hooks.remove = function (elem, type, fn) {
					defaultEvent.remove(elem, this.bind, fn);
				};
			}

			// 将已有的信息拷贝回来。
			if (eventFix[eventName]) {
				eventFix[eventName] = extend(extend({}, eventFix[eventName]), hooks);
			} else {
				eventFix[eventName] = hooks;
			}
		});
	};

	Dom.un = proxy('off');

	//#endregion
	
	//#region Traversing

	Object.map('first last next prev parent closest', function (fn) {
		Dom[fn] = function (elem) {
			return $.fn[fn].apply($(elem), ap.slice.call(arguments, 1))[0];
		};
	});

	Object.map('on trigger hasClass addClass removeClass toggleClass children nextAll prevAll parents', proxy, Dom);

	/**
     * 获取当前 Dom 对象的在原节点的位置。
     * @param {Boolean} args=true 如果 args 为 true ，则计算文本节点。
     * @return {Number} 位置。从 0 开始。
     */
	Dom.index = function (node) {
		var i = 0;
		while (node = node.previousSibling)
			if (node.nodeType === 1)
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
	Dom.child = function (node, index) {

		////assert(typeof index === 'function' || typeof index === 'number' || typeof index === 'string' , 'Dom#child(index): {index} 必须是函数、数字或字符串。');

		var first = 'firstChild',
            next = 'nextSibling';

		if (index < 0) {
			index = ~index;
			first = 'lastChild';
			next = 'previousSibling';
		}

		first = node[first];

		while (first) {
			if (first.nodeType === 1 && index-- <= 0) {
				return first;
			}

			first = first[next];
		}

		return null;
	};

	//#endregion

	//#region Clone

	/**
	 * 创建并返回当前 Dom 对象的副本。
	 * @param {Boolean} deep=true 是否复制子元素。
	 * @param {Boolean} cloneDataAndEvent=false 是否复制数据和事件。
	 * @param {Boolean} keepId=false 是否复制 id 。
	 * @return {Dom} 新 Dom 对象。
	 *
	 * @example
	 * 克隆所有b元素（并选中这些克隆的副本），然后将它们前置到所有段落中。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;, how are you?&lt;/p&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("b").clone().prependTo("p");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;&lt;b&gt;Hello&lt;/b&gt;, how are you?&lt;/p&gt;</pre>
	 */
	Dom.clone = $.clone;

	//#endregion

	//#region Manipulation

	/**
	 * 判断指定节点之后有无存在子节点。
	 * @param {Element} elem 节点。
	 * @param {Element} child 子节点。
	 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
	 * @static
	 */
	Dom.contains = function (node, child) {
		return node === child || $.contains(node, child);
	};

	Dom.manip = function (node, html, fn) {

		html = Dom.parseNode(html, node);

		$(node)[fn](html);

		return html;

	};

	Dom.render = function (node, parent, refNode) {
		if (parent) {
			parent.insertBefore(node, refNode || null);
		} else if (!Dom.contains(document.body, node)) {
			document.body.appendChild(node);
		}
	};

	/**
	 * 判断一个节点是否有元素节点或文本节点。
	 * @param {Element} elem 要测试的元素。
	 * @return {Boolean} 如果存在子节点，则返回 true，否则返回 false 。
	 */
	Dom.isEmpty = function (elem) {
		for (elem = elem.firstChild; elem; elem = elem.nextSibling)
			if (elem.nodeType === 1 || elem.nodeType === 3)
				return false;
		return true;
	};

	/**
	 * 插入一个HTML 到末尾。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
	Dom.append = function (node, html) {
		return Dom.manip(node, html, 'append');
	};

	/**
	 * 插入一个HTML 到顶部。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
	Dom.prepend = function (node, html) {
		return Dom.manip(node, html, 'prepend');
	};

	/**
	 * 插入一个HTML 到前面。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
	Dom.before = function (node, html) {
		return Dom.manip(node, html, 'before');
	};

	/**
	 * 插入一个HTML 到后面。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
	Dom.after = function (node, html) {
		return Dom.manip(node, html, 'after');
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
	Dom.remove = function (node) {
		node.parentNode && node.parentNode.removeChild(node);
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
	Dom.empty = proxy("empty");

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
	Dom.dispose = proxy("remove");

	//#endregion

	//#region Dimension

	/**
     * 设置当前 Dom 对象的显示大小。
     * @param {Number/Point} x 要设置的宽或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的高。如果不设置，使用 null 。
     * @return this
     * @remark
     * 设置元素实际占用大小（包括内边距和边框，但不包括滚动区域之外的大小）。
     *
     * 此方法对可见和隐藏元素均有效。
     * @example
     * 设置 id=myP 的段落的大小。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p id="myP"&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.get("myP").setSize({x:200,y:100});</pre>
     */
	Dom.setSize = function (elem, value) {
		if (value.x != null)
			Dom.setWidth(elem, value.x - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight'));

		if (value.y != null)
			Dom.setHeight(elem, value.y - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight'));

	};

	/**
     * 获取当前 Dom 对象的可视区域大小。包括 border 大小。
     * @return {Point} 位置。
     * @remark
     * 此方法对可见和隐藏元素均有效。
     * 
     * 获取元素实际占用大小（包括内边距和边框）。
     * @example
     * 获取第一段落实际大小。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p:first").getSize();</pre>
     * #####结果:
     * <pre lang="htm" format="none">{x=200,y=100}</pre>
     */
	Dom.getSize = function (elem) {
		var ret;
		if (elem.nodeType === 9) {
			elem = elem.documentElement;
			ret = {
				x: elem.clientWidth,
				y: elem.clientHeight
			};
		} else {
			ret = {
				x: elem.offsetWidth,
				y: elem.offsetHeight
			};
		}

		return ret;

	};

	/**
     * 获取当前 Dom 对象设置CSS宽度(width)属性的值（不带滚动条）。
     * @param {Number} value 设置的宽度值。
     * @return this
     * @example
     * 将所有段落的宽设为 20。
     * <pre>Dom.query("p").setWidth(20);</pre>
     */
	Dom.setWidth = $.cssHooks.width.set;

	/**
     * 获取当前 Dom 对象的CSS width值。（不带滚动条）。
     * @return {Number} 获取的值。
     * 取得元素当前计算的宽度值（px）。
     * @example
     * 获取第一段的宽。
     * <pre>Dom.query("p").item(0).getWidth();</pre>
     * 
     * 获取当前HTML文档宽度。
     * <pre>document.getWidth();</pre>
     */
	Dom.getWidth = $.cssHooks.width.get;

	/**
     * 获取当前 Dom 对象设置CSS高度(hidth)属性的值（不带滚动条）。
     * @param {Number} value 设置的高度值。
     * @return this
     * @example
     * 将所有段落的高设为 20。
     * <pre>Dom.query("p").setHeight(20);</pre>
     */
	Dom.setHeight = $.cssHooks.height.set;

	/**
     * 获取当前 Dom 对象的CSS height值。（不带滚动条）。
     * @return {Number} 获取的值。
     * 取得元素当前计算的高度值（px）。
     * @example
     * 获取第一段的高。
     * <pre>Dom.query("p").item(0).getHeight();</pre>
     * 
     * 获取当前HTML文档高度。
     * <pre>document.getHeight();</pre>
     */
	Dom.getHeight = $.cssHooks.height.get;

	/**
     * 获取当前 Dom 对象的滚动区域大小。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * getScrollSize 获取的值总是大于或的关于 getSize 的值。
     * 
     * 此方法对可见和隐藏元素均有效。
     */
	Dom.getScrollSize = function (elem) {
		var ret = null, elem, body;

		if (elem.nodeType === 9) {
			body = elem.body;
			elem = elem.documentElement;
			ret = {
				x: Math.max(elem.scrollWidth, body.scrollWidth, elem.clientWidth),
				y: Math.max(elem.scrollHeight, body.scrollHeight, elem.clientHeight)
			};
		} else {
			ret = {
				x: elem.scrollWidth,
				y: elem.scrollHeight
			};
		}

		return ret;
	};

	//#endregion

	//#region Offset

	/**
     * 获取用于让当前 Dom 对象定位的父对象。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     */
	Dom.offsetParent = function (elem) {
		return $(elem).offsetParent();
	};

	function css2p(value) {
		return {
			x: value.left,
			y: value.top
		};
	}

	function p2css(value) {
		return {
			left: value.x,
			top: value.y
		};
	}

	/**
     * 获取当前 Dom 对象的绝对位置。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * 此方法只对可见元素有效。
     * @example
     * 获取第二段的偏移
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>
     * var p = Dom.query("p").item(1);
     * var position = p.getPosition();
     * trace( "left: " + position.x + ", top: " + position.y );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 0, top: 35&lt;/p&gt;</pre>
     */
	Dom.getPosition = function (elem) {
		return css2p($(elem).offset());
	};

	/**
     * 设置当前 Dom 对象的绝对位置。
     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
     * @return this
     * @remark
     * 如果对象原先的position样式属性是static的话，会被改成relative来实现重定位。
     * @example
     * 设置第二段的位置。
     * #####HTML:
     * <pre lang="htm" format="none">
     * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;
     * </pre>
     * #####JavaScript:
     * <pre>
     * Dom.query("p:last").setPosition({ x: 10, y: 30 });
     * </pre>
     */
	Dom.setPosition = function (elem, value) {
		return $(elem).offset(p2css(value));
	};

	/**
     * 获取当前 Dom 对象的相对位置。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * 此方法只对可见元素有效。
     * 
     * 获取匹配元素相对父元素的偏移。
     * @example
     * 获取第一段的偏移
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:<pre>
     * var p = Dom.query("p").item(0);
     * var offset = p.getOffset();
     * trace( "left: " + offset.x + ", top: " + offset.y );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
     */
	Dom.getOffset = function (elem) {
		return css2p($(elem).position());
	};

	/**
     * 设置当前 Dom 对象相对父元素的偏移。
     * @param {Point} value 要设置的 x, y 对象。
     * @return this
     * @remark
     * 此函数仅改变 CSS 中 left 和 top 的值。
     * 如果当前对象的 position 是static，则此函数无效。
     * 可以通过 {@link #setPosition} 强制修改 position, 或先调用 {@link Dom.movable} 来更改 position 。
     *
     * @example
     * 设置第一段的偏移。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>
     * Dom.query("p:first").setOffset({ x: 10, y: 30 });
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
     */
	Dom.setOffset = function (elem, value) {

		elem = elem.style;

		if (value.y != null)
			elem.top = value.y + 'px';

		if (value.x != null)
			elem.left = value.x + 'px';
	};

	/**
     * 获取当前 Dom 对象的滚动条的位置。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * 此方法对可见和隐藏元素均有效。
     *
     * @example
     * 获取第一段相对滚动条顶部的偏移。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>
     * var p = Dom.query("p").item(0);
     * trace( "scrollTop:" + p.getScroll() );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">
     * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;scrollTop: 0&lt;/p&gt;
     * </pre>
     */
	Dom.getScroll = function (elem) {
		elem = $(elem);
		return {
			x: elem.scrollLeft(),
			y: elem.scrollTop()
		};
	};

	/**
     * 设置当前 Dom 对象的滚动条位置。
     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
     * @return this
     */
	Dom.setScroll = function (elem, value) {
		elem = $(elem);
		if (value.x == null)
			elem.scrollLeft(value.x);
		if (value.y == null)
			elem.scrollTop(value.y);
	};

	//#endregion

	//#region DOMReady

	Dom.ready = function (fn) {
		return $(document).ready(fn);
	};

	Dom.load = function (fn) {
		if (Dom.isLoaded) {
			fn();
		} else
			$(window).load(fn);
	};

	Dom.load(function () {
		Dom.isReady = Dom.isLoaded = true;
	});

	//#endregion

	//#region Export

	return Dom;

	//#endregion

})(jQuery);
