/**
 * @author xuld
 */


include("core/class/base.js");

//include("jquery/jquery-1.9.0.js");
//include("dom/jquery-adapter.js");

var Dom = (function () {

	var ap = Array.prototype,

		Dom = Class({

			/**
			 * 获取当前集合的节点个数。
			 * @type {Number}
			 * @property
			 */
			length: 0,

			constructor: function (nodelist) {
				if (nodelist) {
					var i = 0;
					while (nodelist[i])
						this[this.length++] = nodelist[i++];
				}
			}

		});

	// 复制数组函数。
	Object.map("push indexOf each forEach splice slice sort unique", function (fnName, index) {
		Dom.prototype[fnName] = index < 4 ? ap[fnName] : function () {
			return new Dom(ap[fnName].apply(this, arguments));
		};
	});

	Object.extend(Dom, {

    	/**
		 * 执行一个 CSS 选择器，返回一个新的 {@link DomList} 对象。
		 * @param {String/NodeList/DomList/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点列表。
		 * @return {Element} 如果没有对应的节点则返回一个空的 DomList 对象。
	 	 * @static
	 	 * @see DomList
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
    	query: function (selector) {
    		return selector ?
				typeof selector === 'string' ?
					document.query(selector) :
					selector.nodeType || selector.setTimeout ?
						new DomList([selector]) :
						typeof selector.length === 'number' ?
							selector instanceof DomList ?
    							selector :
								new DomList(selector) :
							new DomList([Dom.getNode(selector)]) :
				new DomList;
    	},

    	/**
		 * 执行一个 CSS 选择器，返回第一个元素对应的 {@link Dom} 对象。
		 * @param {String/NodeList/DomList/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点。
		 * @return {Element} 如果没有对应的节点则返回一个空的 DomList 对象。
	 	 * @static
	 	 * @see DomList
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
    	find: function (selector) {
    		return typeof selector === "string" ?
				document.find(selector) :
				Dom.get(selector);
    	},

    	/**
		 * 根据一个 *id* 或原生节点获取一个 {@link Dom} 类的实例。
		 * @param {String/Node/Dom/DomList} id 要获取元素的 id 或用于包装成 Dom 对象的任何元素，如是原生的 DOM 节点、原生的 DOM 节点列表数组或已包装过的 Dom 对象。。
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
    	get: function (id) {
    		return typeof id === "string" ?
				(id = document.getElementById(id)) && new Dom(id) :
				id ?
					id.nodeType || id.setTimeout ?
						new Dom(id) :
						id.node ?
							id instanceof Dom ?
    					id :
								new Dom(id.node) :
							Dom.get(id[0]) :
					null;
    	},

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
    	parse: function (html, context, cachable) {
    		return (html = Dom.parseNode(html, context, cachable)) ? html.nodeType ? new Dom(html) : html : null;
    	},

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
    	create: function (tagName, className) {
    		return new Dom(Dom.createNode(tagName, className || ''));
    	},

		div: document.createElement('div')
	});

    return Dom;

})();