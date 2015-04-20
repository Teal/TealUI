
//#exclude dom/core.js
//#include core/core.js

/**
 * 提供操作 DOM 的静态高效方法。
 * @static
 * @class
 */
var Dom = {

    // #region 创建、查找和获取

    /**
	 * 执行一个 CSS 选择器，返回所有匹配的节点列表。
	 * @param {String} selector 要执行的 CSS 选择器。
	 * @param {Document} context 执行的上下文文档。
	 * @return {NodeList} 返回匹配的节点列表。
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
    query: $.find,

    /**
	 * 执行一个 CSS 选择器，返回匹配的第一个节点。
	 * @param {String} selector 要执行的 CSS 选择器。
	 * @param {Document} context 执行的上下文文档。
	 * @return {Element} 返回匹配的节点。
	 */
    find: function (selector, context) {
        return $(selector, context)[0];
    },

    /**
     * 判断指定节点是否符合指定的选择器。
     * @param {Element} elem 要测试的元素。
	 * @param {String} selector 要测试的 CSS 选择器。
     * @return {Boolean} 如果表达式匹配则返回 true，否则返回  false 。
     * @example
     * 由于input元素的父元素是一个表单元素，所以返回true。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;form&gt;&lt;input type="checkbox" /&gt;&lt;/form&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.matches(Dom.find('input'), "input")</pre>
     * #####结果:
     * <pre lang="htm" format="none">true</pre>
     */
    matches: $.find.matchesSelector,

    /**
	 * 根据 *id* 获取节点。
	 * @param {String} id 要获取元素的 ID。
	 * @return {Element} 返回匹配的节点。
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
	 * <pre>&lt;p id="a"&gt;once&lt;/p&gt;</pre>
	 */
    get: function (id) {
        return document.getElementById(id);
    },

    /**
     * 解析一个 html 字符串，返回相应的 DOM 对象。
     * @param {String} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
     * @return {Element} 返回包含所有已解析的节点的 DOM 对象。
     * @static
     */
    parse: function (html, context) {
        return $(html, context)[0];
    },

    // #endregion

    // #region 事件

    /**
     * 设置在 DOM 解析完成后的回调函数。
     * @param {Function} callback 当 DOM 解析完成后的回调函数。
     */
    ready: $,

    /**
     * 为指定元素添加一个事件监听器。
     * @param {Element} elem 要处理的元素。
     * @param {String} eventName 要添加的事件名。
     * @param {Function} eventListener 要添加的事件监听器。
     */
    on: $.event.add,

    /**
     * 删除指定元素的一个或多个事件监听器。
     * @param {Element} elem 要处理的元素。
     * @param {String} eventName 要删除的事件名。
     * @param {Function} eventListener 要删除的事件处理函数。
     */
    off: $.event.remove,

    /**
     * 触发一个事件，执行已添加的监听器。
     * @param {Element} elem 要处理的元素。
     * @param {String} eventName 要触发的事件名。
     * @param {Object} eventArgs 传递给监听器的事件对象。
     */
    trigger: function (elem, eventName, eventArgs) {
        $.event.trigger(eventName, eventArgs, elem);
    },

    // #endregion

    // #region 文档遍历

    /**
	 * 获取指定节点的文档。
	 * @param {Node} node 要获取的节点。
	 * @return {Document} 文档。
	 */
    getDocument: function (/*Node*/node) {
        return node.ownerDocument || node.document || node;
    },

    /**
     * 判断指定节点是否包含目标节点。
     * @param {Element} node 要判断的容器节点。
     * @param {Element} child 要判断的子节点。
     * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
     * @static
     */
    contains: function (node, child) {
        return node === child || $.contains(node, child);
    },

    /**
     * 获取指定节点及父节点对象中第一个满足指定 CSS 选择器或函数的节点。
     * @param {Node} node 节点。
     * @param {String} selector 用于判断的元素的 CSS 选择器。
     * @param {Node} [context=document] 只在指定的节点内搜索此元素。
     * @return {Node} 如果要获取的节点满足要求，则返回要获取的节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
     * @remark
     * closest 和 parent 最大区别就是 closest 会测试当前的元素。
     */
    closest: function (/*Node*/node, selector, context) {
        return $(node).closest(selector, context)[0];
    },

    /**
     * 获取指定节点的父元素。
     * @param {Node} node 要获取的节点。
     * @return {Element} 返回父节点。如果不存在，则返回 null 。
     * @example
     * 找到每个span元素的所有祖先元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.parent(Dom.find("span"))</pre>
     */
    parent: function (/*Node*/node) {
        return $(node).parent()[0];
    },

    /**
     * 获取指定节点的第一个子元素。
     * @param {Node} node 要获取的节点。
     * @return {Element} 返回一个元素。如果不存在，则返回 null 。
     * @example
     * 获取匹配的第二个元素
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.first(Dom.find("p"))</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
     */
    first: function (/*Node*/node) {
        return $(node).children()[0];
    },

    /**
     * 获取指定节点的最后一个子节点对象。
     * @param {Node} node 要获取的节点。
     * @return {Element} 返回一个元素。如果不存在，则返回 null 。
     * @example
     * 获取匹配的第二个元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.last(Dom.find("p"))</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
     */
    last: function (/*Node*/node) {
        return $(node).children().last()[0];
    },

    /**
     * 获取指定节点的下一个相邻节点对象。
     * @param {Node} node 要获取的节点。
     * @return {Element} 返回一个元素。如果不存在，则返回 null 。
     * @example
     * 找到每个段落的后面紧邻的同辈元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.next(Dom.find("p"))</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p&gt;Hello Again&lt;/p&gt;, &lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt; ]</pre>
     */
    next: function (/*Node*/node) {
        return $(node).next()[0];
    },

    /**
     * 获取指定节点的上一个相邻的节点对象。
     * @param {Node} node 要获取的节点。
     * @return {Element} 返回一个元素。如果不存在，则返回 null 。
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
     * <pre>Dom.prev(Dom.find("p"))</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
     */
    prev: function (node) {
        return $(node).prev()[0];
    },

    /**
     * 获取指定节点的全部直接子元素。
     * @param {Node} node 要获取的节点。
     * @return {NodeList} 返回所有元素列表。
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
     * <pre>Dom.children(Dom.find("div"))</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
     */
    children: function (node) {
        return $(node).children();
    },

    // #endregion

    // #region 增删操作

    /**
     * 插入一个HTML 到末尾。
	 * @param {Node} node 要获取的节点。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    append: function (node, html) {
        $(node).append(html);
        return node.lastChild;
    },

    /**
     * 插入一个 HTML 到顶部。
	 * @param {Node} node 要获取的节点。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    prepend: function (node, html) {
        $(node).prepend(html);
        return node.firstChild;
    },

    /**
     * 插入一个HTML 到前面。
	 * @param {Node} node 要获取的节点。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    before: function (node, html) {
        $(node).before(html);
        return node.previousSibling;
    },

    /**
     * 插入一个HTML 到后面。
	 * @param {Node} node 要获取的节点。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    after: function (node, html) {
        $(node).after(html);
        return node.nextSibling;
    },

    /**
     * 如果指定节点未添加到 DOM 树，则进行添加。
	 * @param {Node} node 要获取的节点。
	 * @param {Node} parentNode 渲染的父节点。
	 * @param {Node} refNode 插入的引用节点。
     */
    render: function (node, parentNode, refNode) {
        if (parentNode) {
            parentNode.insertBefore(node, refNode || null);
        } else if (!Dom.contains(Dom.getDocument(node), node)) {
            Dom.getDocument(node).body.appendChild(node);
        }
    },

    /**
     * 移除指定节点或其子对象。
	 * @param {Node} node 要获取的节点。
     * @remark
     * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
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
    remove: function (/*Node*/node) {
        $(node).remove();
    },

    /**
     * 创建并返回指定节点的副本。
	 * @param {Node} node 要获取的节点。
     * @param {Boolean} deep=true 是否复制子元素。
     * @param {Boolean} cloneDataAndEvent=false 是否复制数据和事件。
     * @param {Boolean} keepId=false 是否复制 id 。
     * @return {Node} 新节点对象。
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
    clone: $.clone,

    // #endregion

    // #region 样式和属性

    /**
     * 获取元素的属性值。
     * @param {Element} elem 要获取的元素。
     * @param {String} name 要获取的属性名称。
     * @return {String} 返回属性值。如果元素没有相应属性，则返回 null 。
     * @static
     */
    getAttr: $.attr,

    /**
     * 设置或删除一个 HTML 属性值。
     * @param {String} name 要设置的属性名称。
     * @param {String} value 要设置的属性值。当设置为 null 时，删除此属性。
     * @return this
     * @example
     * 为图像设置 src 属性。
     * #####HTML:
     * <pre lang="htm" format="none">
     * &lt;img/&gt;
     * </pre>
     * #####JavaScript:
     * <pre>Dom.setAttr(Dom.find("img"), "src","test.jpg");</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;img src= "test.jpg" /&gt; , &lt;img src= "test.jpg" /&gt; ]</pre>
     *
     * 将文档中图像的src属性删除
     * #####HTML:
     * <pre lang="htm" format="none">&lt;img src="test.jpg"/&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.setAttr(Dom.find("img"), "src");</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;img /&gt; ]</pre>
     */
    setAttr: $.attr,

    getProp: $.prop,

    setProp: $.prop,

    _fixText: function (node) {
        return (Dom._textFix || (Dom._textFix = {
            'INPUT': 'value',
            'SELECT': 'value',
            'TEXTAREA': 'value',
            '#text': 'nodeValue',
            '#comment': 'nodeValue'
        }))[node.nodeName] || 'textContent';
    },

    /**
     * 获取一个元素对应的文本。
     * @param {Element} node 元素。
     * @return {String} 值。对普通节点返回 text 属性。
     * @static
     */
    getText: function (/*Element*/node) {
        return node[Dom._fixText(node)] || '';
    },

    /**
     * 设置指定节点的文本内容。对于输入框则设置其输入的值。
     * @param {String} 用于设置元素内容的文本。
     * @return this
     * @see #setHtml
     * @remark 与 {@link #setHtml} 类似, 但将编码 HTML (将 "&lt;" 和 "&gt;" 替换成相应的HTML实体)。
     * @example
     * 设定文本框的值。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;input type="text"/&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.setText(Dom.find("input"),"hello world!");</pre>
     */
    setText: function (/*Element*/node, value) {
        node[Dom._fixText(node)] = value;
    },

    /**
     * 获取指定节点的 Html。
     * @return {String} HTML 字符串。
     * @example
     * 获取 id="a" 的节点的内部 html。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.getHtml(document.body);</pre>
     * #####结果:
     * <pre lang="htm" format="none">"&lt;p/&gt;"</pre>
     */
    getHtml: function (/*Element*/elem) {
        return elem.innerHTML;
    },

    /**
     * 设置指定节点的 Html。
     * @param {String} value 要设置的 Html。
     * @example
     * 设置一个节点的内部 html
     * #####HTML:
     * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.setHtml(Dom.get("a"), "&lt;a/&gt;");</pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;a/&gt;&lt;/div&gt;</pre>
     */
    setHtml: function (/*Element*/elem, value) {
        elem.innerHTML = value;
    },

    /**
     * 检查是否含指定类名。
     * @param {Element} elem 要测试的元素。
     * @param {String} className 类名。
     * @return {Boolean} 如果存在返回 true。
     * @static
     */
    hasClass: function (/*Element*/elem, className) {
        return $(elem).hasClass(className);
    },

    /**
     * 为指定节点添加指定的 Css 类名。
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
     * <pre>Dom.addClass(Dom.find("p"), "selected highlight");</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected highlight"&gt;Hello&lt;/p&gt; ]</pre>
     */
    addClass: function (/*Element*/elem, className) {
        $(elem).addClass(className);
    },

    /**
     * 从指定节点中删除全部或者指定的类。
     * @param {String} [className] 一个或多个要删除的CSS类名，用空格分开。如果不提供此参数，将清空 className 。
     * @return this
     * @example
     * 从匹配的元素中删除 'selected' 类
     * #####HTML:
     * <pre lang="htm" format="none">
     * &lt;p class="selected first"&gt;Hello&lt;/p&gt;
     * </pre>
     * #####JavaScript:
     * <pre>Dom.removeClass(Dom.find("p"), "selected");</pre>
     * #####结果:
     * <pre lang="htm" format="none">
     * [ &lt;p class="first"&gt;Hello&lt;/p&gt; ]
     * </pre>
     */
    removeClass: function (/*Element*/elem, className) {
        $(elem).removeClass(className);
    },

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
     * <pre>Dom.toggleClass(Dom.find("p"), "selected");</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt;, &lt;p&gt;Hello Again&lt;/p&gt; ]</pre>
     */
    toggleClass: function (elem, className, value) {
        $(elem).toggleClass(className);
    },

    /**
     * 读取指定节点的当前样式，返回字符串。
     * @param {Element} elem 要获取的元素。
     * @param {String} camelizedCssPropertyName 已转为骆驼格式的 CSS 属性名。
     * @return {String} 字符串。
     */
    styleString: $.css,

    /**
     * 读取指定节点的当前样式，返回数值。
     * @param {Element} elem 要获取的元素。
     * @param {String} camelizedCssPropertyName 已转为骆驼格式的 CSS 属性名。
     * @return {Number} 数值。
     */
    styleNumber: function (/*Element*/elem, camelizedCssPropertyName) {
        return parseFloat($.css(elem, camelizedCssPropertyName));
    },

    /**
     * 到骆驼模式。
     * @param {String} name 匹配的内容。
     * @return {String} 返回的内容。
     */
    camelCase: $.camelCase,

    /**
     * 获取指定节点的样式。
     * @param {Element} elem 要获取的元素。
     * @param {String} cssPropertyName CSS 属性名。
     * @return {String} 字符串。
     */
    getStyle: $.css,

    /**
     * 设置指定节点的样式。
     * @param {Element} elem 要设置的元素。
     * @param {String} cssPropertyName CSS 属性名或 CSS 字符串。
     * @param {String/Number} value CSS属性值，数字如果不加单位，则会自动添加像素单位。
     * @example
     * 将所有段落的字体颜色设为红色并且背景为蓝色。
     * <pre>Dom.query("p").setStyle('color', "#ff0011");</pre>
     */
    setStyle: $.css,

    /**
     * 设置一个元素可移动。
     * @param {Element} elem 要处理的元素。
     * @static
     */
    movable: function (/*Element*/elem) {
        if (!/^(?:abs|fix)/.test(Dom.styleString(elem, "position")))
            elem.style.position = "relative";
    },

    /**
     * 判断当前元素是否是隐藏的。
     * @param {Element} elem 要判断的元素。
     * @return {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
     */
    isHidden: function (/*Element*/elem) {
        return Dom.styleString(elem, 'display') === 'none';
    },

    /**
     * 通过设置 display 属性来显示元素。
     * @param {Element} elem 要处理的元素。
     * @static
     */
    show: function (/*Element*/elem) {
        $(elem).show();
    },

    /**
     * 通过设置 display 属性来隐藏元素。
     * @param {Element} elem 要处理的元素。
     * @static
     */
    hide: function (/*Element*/elem) {
        $(elem).hide();
    },

    /**
     * 通过设置 display 属性切换显示或隐藏元素。
     * @param {Element} elem 要处理的元素。
     * @param {Boolean?} value 要设置的元素。
     * @static
     */
    toggle: function (/*Element*/elem, value) {
        $(elem).toggle(value);
    },

    // #endregion

    // #region 定位和尺寸

    /**
	 * 根据不同的内容进行计算。
	 * @param {Element} elem 要计算的元素。
	 * @param {String} expression 要计算的表达式。其中使用变量代表 CSS 属性值，如 "width+paddingLeft"。
	 * @return {Number} 返回计算的值。
	 * @static
	 */
    calc: function (/*Element*/elem, expression) {
        return eval(expression.replace(/(\w+)/g, 'Dom.styleNumber(elem, "$1")'))
    },

    /**
     * 获取指定节点的可视区域大小。包括 border 大小。
	 * @param {Element} elem 要计算的元素。
     * @return {Point} 大小。
     * @remark
     * 此方法对可见和隐藏元素均有效。
     * 获取元素实际占用大小（包括内边距和边框）。
     * @example
     * 获取第一段落实际大小。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.getSize(Dom.find("p:first"));</pre>
     * #####结果:
     * <pre lang="htm" format="none">{x=200,y=100}</pre>
     */
    getSize: function (/*Element*/elem) {
        return elem.nodeType === 9 ? {
            x: elem.documentElement.clientWidth,
            y: elem.documentElement.clientHeight,
        } : {
            x: elem.offsetWidth,
            y: elem.offsetHeight
        };
    },

    /**
     * 设置指定节点的可视区域大小。
     * @param {Element} elem 要设置的元素。
     * @param {Number/Point} x 要设置的宽或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的高。如果不设置，使用 null 。
     * @return this
     * @remark
     * 设置元素实际占用大小（包括内边距和边框，但不包括滚动区域之外的大小）。
     * 此方法对可见和隐藏元素均有效。
     * @example
     * 设置 id=myP 的段落的大小。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p id="myP"&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.setSize(Dom.get("myP"), {x:200,y:100});</pre>
     */
    setSize: function (/*Element*/elem, value) {
        if (value.x != null) {
            elem.style.width = value.x - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
        }
        if (value.y != null) {
            elem.style.height = value.y - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
        }
    },

    /**
     * 获取指定节点的滚动区域大小。
	 * @param {Element} elem 要计算的元素。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * getScrollSize 获取的值总是大于或的关于 getSize 的值。
     * 此方法对可见和隐藏元素均有效。
     */
    getScrollSize: function (/*Element*/elem) {
        return elem.nodeType === 9 ? {
            x: Math.max(elem.documentElement.scrollWidth, elem.body.scrollWidth, elem.clientWidth),
            y: Math.max(elem.documentElement.scrollHeight, elem.body.scrollHeight, elem.clientHeight)
        } : {
            x: elem.scrollWidth,
            y: elem.scrollHeight
        };
    },

    /**
     * 获取文档的滚动位置。
	 * @param {Document} doc 要计算的文档。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     */
    getDocumentScroll: function (/*Document*/doc) {
        return Dom.getScroll(doc);
    },

    /**
     * 获取指定节点的相对位置。
	 * @param {Element} elem 要计算的元素。
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
    getOffset: function (/*Element*/elem) {
        var pos = $(elem).position();
        return {
            x: pos.left,
            y: pos.top
        };
    },

    /**
     * 设置指定节点相对父元素的偏移。
     * @param {Element} elem 要设置的元素。
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
    setOffset: function (/*Element*/elem, value) {

        //#assert(value, "Dom#setOffset(value): {value} 必须有 'x' 和 'y' 属性。", value);

        elem = elem.style;

        if (value.y != null) {
            elem.top = value.y + 'px';
        }

        if (value.x != null) {
            elem.left = value.x + 'px';
        }

    },

    /**
     * 获取用于让指定节点定位的父对象。
     * @param {Element} elem 要设置的元素。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     */
    offsetParent: function (/*Element*/elem) {
        return $(elem).offsetParent()[0];
    },

    /**
     * 获取指定节点的绝对位置。
	 * @param {Element} elem 要计算的元素。
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
    getPosition: function (/*Element*/elem) {
        return $(elem).offset();
    },

    /**
     * 设置指定节点的绝对位置。
     * @param {Element} elem 要设置的元素。
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
    setPosition: function (/*Element*/elem, value) {
        $(elem).offset({ left: value.x, top: value.y });
    },

    /**
     * 获取指定节点的滚动条的位置。
	 * @param {Element} elem 要计算的元素。
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
    getScroll: function (/*Element*/elem) {
        return {
            x: $(elem).scrollLeft(),
            y: $(elem).scrollTop()
        };
    },

    /**
     * 设置指定节点的滚动条位置。
     * @param {Element} elem 要设置的元素。
     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
     * @return this
     */
    setScroll: function (/*Element*/elem, value) {
        $(elem).scrollLeft(value.x);
        $(elem).scrollTop(value.y);
    }

    // #endregion

};
