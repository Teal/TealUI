/**
 * @author xuld
 * @fileOverview 提供 DOM 操作的辅助函数。
 */

/**
 * 提供操作 DOM 的静态高效方法。
 * @static
 * @class
 */
var Dom = {

    // #region 通用

    /**
     * 遍历指定的节点列表并对每个节点执行回调。
     * @param {NodeList} nodeList 要遍历的节点列表:
     * @param {Function} callback 对每个元素运行的回调函数。函数的参数依次为:
     *
     * - {Node} elem 当前元素。
     * - {Number} index 当前元素的索引。
     * - {Dom} array 当前正在遍历的数组。
     *
     * 可以让函数返回 **false** 来强制中止循环。
     * @param {Object} [bind] 定义 *callback* 执行时 **this** 的值。
     * @return {Boolean} 如果循环是因为 *callback* 返回 **false** 而中止，则返回 **false**， 否则返回 **true**。
     */
    each: function (nodeList, callback, bind) {
        for (var i = 0, node; node = nodeList[i]; i++) {
            if (callback.call(bind, node, i, nodeList) === false) {
                return false;
            }
        }
        return true;
    },

    /**
     * 设置在 DOM 解析完成后的回调函数。
     * @param {Function} callback 当 DOM 解析完成后的回调函数。
     */
    ready: function (callback) {
        if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
            callback.call(document);
        } else {
            document.addEventListener('DOMContentLoaded', callback, false);
        }
    },

    /**
     * 解析一个 html 字符串，返回相应的 DOM 对象。
     * @param {String} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
     * @return {Element} 返回包含所有已解析的节点的 DOM 对象。
     * @static
     */
    parse: function (html, context) {
        if (typeof html !== 'object') {
            context = context && context !== document ? context.createElement('div') : (Dom._parseContainer || (Dom._parseContainer = document.createElement('div')));
            context.innerHTML = html;
            html = context.firstChild;
        }
        return html;
    },

    // #endregion

    // #region 获取节点

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
    query: function (selector, context) {
        return (context || document).querySelectorAll(selector);
    },

    /**
	 * 执行一个 CSS 选择器，返回匹配的第一个节点。
	 * @param {String} selector 要执行的 CSS 选择器。
	 * @param {Document} context 执行的上下文文档。
	 * @return {Element} 返回匹配的节点。
	 */
    find: function (selector, context) {
        return (context || document).querySelector(selector);
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
    matches: function (elem, selector) {

        // 基于原生的判断。
        var nativeMatchesSelector = elem.matchesSelector || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.oMatchesSelector;
        if (nativeMatchesSelector) {
            return nativeMatchesSelector.call(elem, selector);
        }

        // 原生不支持：使用内置的判断。
        var parent = elem.parentNode, tempParent = !parent && Dom.getDocument(elem).body;
        tempParent && tempParent.appendChild(elem);
        try {
            return Array.prototype.indexOf.call(Dom.query(selector, parent), elem) >= 0;
        } finally {
            tempParent && tempParent.removeChild(elem);
        }

    },

    // #endregion

    // #region 事件

    /**
     * 为指定元素添加一个事件监听器。
     * @param {Element} elem 要处理的元素。
     * @param {String} eventName 要添加的事件名。
     * @param {String} [proxySelector] 代理的选择器。
     * @param {Function} eventListener 要添加的事件监听器。
     */
    on: function (elem, eventName, proxySelector, eventListener) {
        if (!eventListener) {
            eventListener = proxySelector;
            proxySelector = '';
        }

        if (proxySelector) {
            var oldListener = eventListener;
            eventListener = function(e) {
                var actucalTarget = Dom.closest(e.target, proxySelector, elem);
                return actucalTarget && oldListener.call(actucalTarget, e);
            };
        }

        elem.addEventListener(eventName, eventListener, false);
    },

    /**
     * 删除指定元素的一个或多个事件监听器。
     * @param {Element} elem 要处理的元素。
     * @param {String} eventName 要删除的事件名。
     * @param {Function} eventListener 要删除的事件处理函数。
     */
    off: function (elem, eventName, eventListener) {
        if (!eventListener) {
            eventListener = proxyClass;
            proxyClass = '';
        }
        elem.removeEventListener(eventName, eventListener, false);
    },

    /**
     * 触发一个事件，执行已添加的监听器。
     * @param {Element} elem 要处理的元素。
     * @param {String} eventName 要触发的事件名。
     * @param {Object} eventArgs 传递给监听器的事件对象。
     */
    trigger: function (elem, eventName, eventArgs) {
        var eventFix = Dom.triggerFix;
        if (!eventFix) {
            Dom.triggerFix = eventFix = {};
            eventFix.click = eventFix.mousedown = eventFix.mouseup = eventFix.mousemove = 'MouseEvents';
        }

        var event = document.createEvent(eventFix[eventName] || 'Events'),
            bubbles = true;
        for (var name in eventArgs) {
            name === 'bubbles' ? (bubbles = !!e[name]) : (event[name] = eventArgs[name]);
        }
        event.initEvent(eventName, bubbles, true);
        elem.dispatchEvent(event);
    },

    // #endregion

    // #region 文档遍历

    /**
     * 判断指定节点是否包含目标节点。
     * @param {Element} node 要判断的容器节点。
     * @param {Element} child 要判断的子节点。
     * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
     * @static
     */
    contains: function (node, child) {
        return node.contains(child);
    },

    /**
     * 获取指定节点及父节点对象中第一个满足指定 CSS 选择器或函数的节点。
     * @param {Node} node 节点。
     * @param {String} selector 用于判断的元素的 CSS 选择器。
     * @param {Node} [context=document] 只在指定的节点内搜索此元素。
     * @return {Node} 如果要获取的节点满足要求，则返回要获取的节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
     */
    closest: function (node, selector, context) {
        while (node && node != context) {
            if (Dom.matches(node, selector)) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    },

    /**
	 * 获取指定节点的文档。
	 * @param {Node} node 要获取的节点。
	 * @return {Document} 文档。
	 */
    getDocument: function (node) {
        return node.ownerDocument || node.document || node;
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
    getParent: function (node) {
        return node.parentNode;
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
    getFirst: function (node) {
        return node.firstElementChild;
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
    getLast: function (node) {
        return node.lastElementChild;
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
    getNext: function (node) {
        return node.nextElementSibling;
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
    getPrev: function (node) {
        return node.previousElementSibling;
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
    getChildren: function (node) {
        return node.children;
    },

    // #endregion

    // #region 增删操作

    /**
     * 插入一段 HTML 到末尾。
	 * @param {Node} node 要获取的节点。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    append: function (node, html) {
        var c = Dom.parse(html, Dom.getDocument(node)).parentNode;
        while (c.firstChild) {
            node.appendChild(c.firstChild);
        }
        return node.lastChild;
    },

    /**
     * 插入一段 HTML 到顶部。
	 * @param {Node} node 要获取的节点。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    prepend: function (node, html) {
        var c = Dom.parse(html, Dom.getDocument(node)).parentNode, p = node.firstChild;
        while (c.firstChild) {
            node.insertBefore(c.firstChild, p);
        }
        return node.firstChild;
    },

    /**
     * 插入一段 HTML 到前面。
	 * @param {Node} node 要获取的节点。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    before: function (node, html) {
        var c = Dom.parse(html, Dom.getDocument(node)).parentNode, p = node.parentNode;
        while (c.firstChild) {
            p.insertBefore(c.firstChild, node);
        }
        return node.previousSibling;
    },

    /**
     * 插入一段 HTML 到后面。
	 * @param {Node} node 要获取的节点。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    after: function (node, html) {
        return node.nextSibling ? Dom.before(node.nextSibling, html) : Dom.append(node.parentNode, html);
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
     * <pre>Dom.each(Dom.query("p"), Dom.remove);</pre>
     * #####结果:
     * <pre lang="htm" format="none">how are &lt;p&gt;you?&lt;/p&gt;</pre>
     */
    remove: function (node) {
        node.parentNode && node.parentNode.removeChild(node);
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
     * <pre>Dom.prepend(Dom.find("p"), Dom.clone(Dom.find("b"));</pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;&lt;b&gt;Hello&lt;/b&gt;, how are you?&lt;/p&gt;</pre>
     */
    clone: function (node, deep) {
        return node.cloneNode(deep !== false);
    },

    // #endregion

    // #region 属性和样式

    /**
     * 检查是否含指定类名。
     * @param {Element} elem 要测试的元素。
     * @param {String} className 类名。
     * @return {Boolean} 如果存在返回 true。
     * @static
     */
    hasClass: function (elem, className) {
        return elem.classList.contains(className);
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
    addClass: function (elem, className) {
        if (elem.classList) {
            elem.classList.add(className);
        } else if ((" " + elem.className + " ").indexOf(className) < 0) {
            elem.className += ' ' + className;
        }
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
    removeClass: function (elem, className) {
        if (elem.classList) {
            elem.classList.remove(className);
        } else {
            elem.className = className ? (" " + elem.className + " ").replace(" " + classList[i] + " ", " ").trim() : '';
        }
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
        (value == undefined ? Dom.hasClass(elem, className) : !value) ? Dom.removeClass(elem, className) : Dom.addClass(elem, className);
    },

    /**
     * 获取元素的属性值。
     * @param {Element} elem 要获取的元素。
     * @param {String} name 要获取的属性名称。
     * @return {String} 返回属性值。如果元素没有相应属性，则返回 null 。
     * @static
     */
    getAttr: function (elem, name) {
        return name in elem ? elem[name] : elem.getAttribute(name);
    },

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
    setAttr: function (elem, name, value) {
        if (name in elem) {
            elem[name] = value;
        } else if (value === null) {
            elem.removeAttribute(name);
        } else {
            elem.setAttribute(name, value);
        }
    },

    _textAttrFix: {
        'INPUT': 'value',
        'SELECT': 'value',
        'TEXTAREA': 'value',
        '#text': 'nodeValue',
        '#comment': 'nodeValue'
    },

    /**
     * 获取一个元素对应的文本。
     * @param {Node} node 元素。
     * @return {String} 值。对普通节点返回 text 属性。
     * @static
     */
    getText: function (node) {
        return node[Dom._textAttrFix[node.nodeName] || 'textContent'] || '';
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
    setText: function (node, value) {
        node[Dom._textAttrFix[node.nodeName] || 'textContent'] = value;
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
    getHtml: function (elem) {
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
    setHtml: function (elem, value) {
        elem.innerHTML = value;
    },

    /**
     * 读取指定节点的当前样式，返回数值。
     * @param {Element} elem 要获取的元素。
     * @param {String} camelizedCssPropertyName 已转为骆驼格式的 CSS 属性名。
     * @return {Number} 数值。
     */
    getStyleNumber: function (elem, cssPropertyName) {
        var value = elem.style[cssPropertyName];
        return value && (value = parseFloat(value)) != null ? value : (parseFloat(elem.ownerDocument.defaultView.getComputedStyle(elem, '')[cssPropertyName]) || 0);
    },

    /**
	 * 根据不同的内容进行计算。
	 * @param {Element} elem 要计算的元素。
	 * @param {String} expression 要计算的表达式。其中使用变量代表 CSS 属性值，如 "width+paddingLeft"。
	 * @return {Number} 返回计算的值。
	 * @static
	 */
    calcStyle: function (elem, expression) {
        var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
        return eval(expression.replace(/(\w+)/g, '(parseFloat(computedStyle.$1)||0)'));
    },

    /**
     * 获取指定节点的样式。
     * @param {Element} elem 要获取的元素。
     * @param {String} cssPropertyName CSS 属性名。
     * @return {String} 字符串。
     */
    getStyle: function (elem, cssPropertyName) {
        return elem.style[cssPropertyName] || elem.ownerDocument.defaultView.getComputedStyle(elem, '')[cssPropertyName];
    },

    /**
     * 设置指定节点的样式。
     * @param {Element} elem 要设置的元素。
     * @param {String} cssPropertyName CSS 属性名或 CSS 字符串。
     * @param {String/Number} value CSS属性值，数字如果不加单位，则会自动添加像素单位。
     * @example
     * 将所有段落的字体颜色设为红色并且背景为蓝色。
     * <pre>Dom.query("p").setStyle('color', "#ff0011");</pre>
     */
    setStyle: function (elem, cssPropertyName, value) {
        elem.style[cssPropertyName] = value;
    },

    /**
     * 判断当前元素是否是隐藏的。
     * @param {Element} elem 要判断的元素。
     * @return {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
     */
    isHidden: function (elem) {
        return Dom.getStyle(elem, 'display') === 'none';
    },

    /**
     * 通过设置 display 属性来显示元素。
     * @param {Element} elem 要处理的元素。
     * @static
     */
    show: function (/*Element*/elem) {

        // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
        elem.style.display = '';

        // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
        if (Dom.isHidden(elem)) {
            var defaultDisplay = elem.style.defaultDisplay;
            if (!defaultDisplay) {
                var defaultDisplayCache = Dom.defaultDisplayCache || (Dom.defaultDisplayCache = {});
                defaultDisplay = defaultDisplayCache[elem.nodeName];
                if (!defaultDisplay) {
                    var elem = document.createElement(nodeName);
                    document.body.appendChild(elem);
                    defaultDisplay = Dom.getStyle(elem);
                    if (defaultDisplay === 'none') {
                        defaultDisplay = 'block';
                    }
                    defaultDisplayCache[nodeName] = defaultDisplay;
                    document.body.removeChild(elem);
                }
            }
            elem.style.display = defaultDisplay;
        }

    },

    /**
     * 通过设置 display 属性来隐藏元素。
     * @param {Element} elem 要处理的元素。
     * @static
     */
    hide: function (elem) {
        var currentDisplay = Dom.getStyle(elem, 'display');
        if (currentDisplay !== 'none') {
            elem.style.defaultDisplay = currentDisplay;
            elem.style.display = 'none';
        }
    },

    /**
     * 通过设置 display 属性切换显示或隐藏元素。
     * @param {Element} elem 要处理的元素。
     * @param {Boolean?} value 要设置的元素。
     * @static
     */
    toggle: function (elem, value) {
        (value == null ? Dom.isHidden(elem) : value) ? Dom.show(elem) : Dom.hide(elem);
    },

    // #endregion

    // #region 尺寸和定位

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
    getSize: function (elem) {
        return elem.nodeType === 9 ? {
            width: elem.documentElement.clientWidth,
            height: elem.documentElement.clientHeight,
        } : {
            width: elem.offsetWidth,
            height: elem.offsetHeight
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
    setSize: function (elem, value) {
        if (value.width != null) {
            elem.style.width = value.width - Dom.calcStyle(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
        }
        if (value.height != null) {
            elem.style.height = value.height - Dom.calcStyle(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
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
    getScrollSize: function (elem) {
        return elem.nodeType === 9 ? {
            width: Math.max(elem.documentElement.scrollWidth, elem.body.scrollWidth, elem.clientWidth),
            height: Math.max(elem.documentElement.scrollHeight, elem.body.scrollHeight, elem.clientHeight)
        } : {
            width: elem.scrollWidth,
            height: elem.scrollHeight
        };
    },

    /**
     * 获取文档的滚动位置。
	 * @param {Document} doc 要计算的文档。
     * @return {Point} 返回的对象包含两个整型属性：left 和 top。
     */
    documentScroll: function (doc) {
        var win;
        return 'pageXOffset' in (win = doc.defaultView || doc.parentWindow) ? {
            left: win.pageXOffset,
            top: win.pageYOffset
        } : {
            left: doc.documentElement.scrollLeft,
            top: doc.documentElement.scrollTop
        };
    },

    /**
     * 获取指定节点的相对位置。
	 * @param {Element} elem 要计算的元素。
     * @return {Point} 返回的对象包含两个整型属性：left 和 top。
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
    getOffset: function (elem) {

        // 如果设置过 left top ，这是非常轻松的事。
        var left = Dom.getStyle(elem, 'left'),
            top = Dom.getStyle(elem, 'top');

        // 如果未设置过。
        if ((!left || !top || left === 'auto' || top === 'auto') && Dom.getStyle(elem, "position") === 'absolute') {

            // 绝对定位需要返回绝对位置。
            top = Dom.offsetParent(elem);
            left = Dom.getPosition(elem);
            if (!/^(?:BODY|HTML|#document)$/i.test(top.nodeName)) {
                var t = Dom.getPosition(top);
                left.left -= t.left;
                lefy.top -= t.top;
            }
            left.left -= Dom.getStyleNumber(elem, 'marginLeft') + Dom.getStyleNumber(top, 'borderLeftWidth');
            left.top -= Dom.getStyleNumber(elem, 'marginTop') + Dom.getStyleNumber(top, 'borderTopWidth');

            return left;
        }

        // 碰到 auto ， 空 变为 0 。
        return {
            left: parseFloat(left) || 0,
            top: parseFloat(top) || 0
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
    setOffset: function (elem, value) {
        elem = elem.style;
        if (value.top != null) {
            elem.top = value.top + 'px';
        }
        if (value.left != null) {
            elem.left = value.left + 'px';
        }
    },

    /**
     * 获取用于让指定节点定位的父对象。
     * @param {Element} elem 要设置的元素。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     */
    offsetParent: function (elem) {
        var p = elem;
        while ((p = p.offsetParent) && !/^(?:BODY|HTML|#document)$/i.test(p.nodeName) && Dom.getStyle(p, "position") === "static");
        return p || Dom.getDocument(elem).body;
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
    getPosition: function (elem) {

        // 对于 document，返回 scroll 。
        if (elem.nodeType === 9) {
            return Dom.getDocumentScroll(elem);
        }

        var bound = elem.getBoundingClientRect !== undefined ? elem.getBoundingClientRect() : { left: 0, top: 0 },
            doc = Dom.getDocument(elem),
            html = doc.documentElement,
            htmlScroll = Dom.getDocumentScroll(doc);
        return {
            left: bound.left + htmlScroll.left - html.clientLeft,
            top: bound.top + htmlScroll.top - html.clientTop
        };
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
    setPosition: function (elem, value) {

        // 确保对象可移动。
        Dom.movable(elem);

        var currentPosition = Dom.getPosition(elem),
            offset = Dom.getOffset(elem);

        offset.left = value.left == null ? null : offset.left + value.left - currentPosition.left;
        offset.top = value.top == null ? null : offset.top + value.top - currentPosition.top;

        Dom.setOffset(elem, offset);

    },

    /**
     * 设置一个元素可移动。
     * @param {Element} elem 要处理的元素。
     * @static
     */
    movable: function (elem) {
        if (!/^(?:abs|fix)/.test(Dom.getStyle(elem, "position")))
            elem.style.position = "relative";
    },

    /**
     * 获取文档的滚动位置。
	 * @param {Document} doc 要计算的文档。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     */
    getDocumentScroll: function (doc) {
        var win;
        return 'pageXOffset' in (win = doc.defaultView || doc.parentWindow) ? {
            left: win.pageXOffset,
            top: win.pageYOffset
        } : {
            left: doc.documentElement.scrollLeft,
            top: doc.documentElement.scrollTop
        };
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
    getScroll: function (elem) {
        return elem.nodeType === 9 ? Dom.getDocumentScroll(elem) : {
            left: elem.scrollLeft,
            top: elem.scrollTop
        };
    },

    /**
     * 设置指定节点的滚动条位置。
     * @param {Element} elem 要设置的元素。
     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
     * @return this
     */
    setScroll: function (elem, value) {
        if (elem.nodeType === 9) {
            (elem.defaultView || elem.parentWindow).scrollTo(
                value.left != null ? value.left : Dom.getDocumentScroll(elem).left,
                value.top != null ? value.top : Dom.getDocumentScroll(elem).top
            );
        } else {
            if (value.left != null) {
                elem.scrollLeft = value.left;
            }
            if (value.top != null) {
                elem.scrollTop = value.top;
            }
        }
    },

    // #endregion

    // #region 特效

    /**
     * 基于 CSS 3 实现动画效果。
     * @param {Element} elem 要设置的节点。
     * @param {Function} callback 要设置的回调。
     * @param {Number} duration=300 指定特效的执行时间。
     */
    animate: function (elem, from, to, duration, ease, callback, dalay) {

        if (duration === undefined) {
            duration = 300;
        }

        ease = ease || 'ease-in';
        dalay = dalay || 0;

        // 获取或初始化配置对象。
        var fxOptions = Dom._fxOptions;
        if (!fxOptions) {
            Dom._fxOptions = fxOptions = {};

            fxOptions.prefix = '';
            var prefix = {
                transition: '',
                webkitTransition: 'webkit',
                mozTransition: 'moz',
                oTransition: 'o'
            };
            for (var key in prefix) {
                if (key in elem.style) {
                    fxOptions.prefix = prefix[key];
                    break;
                }
            }

            fxOptions.transitionEnd = fxOptions.prefix ? fxOptions.prefix + 'TransitionEnd' : 'transitionend';
            fxOptions.transition = fxOptions.prefix ? fxOptions.prefix + 'Transition' : 'transition';
            fxOptions.transform = fxOptions.prefix ? fxOptions.prefix + 'Transform' : 'transform';
        }

        // 直接支持 transforms 属性。
        for (var key in to) {
            if (/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i.test(key)) {
                to.transforms = to.transforms || '';
                to.transforms = key + '(' + to[key] + ') ' + to.transforms;
                delete to[key];
            }

            // 更新 'auto' 值。
            if (to[key] === 'auto') {
                var oldStyle = elem.style[key];
                elem.style[key] = '';
                to[key] = Dom.getStyle(elem, key);
                elem.style[key] = oldStyle;
            }
            
            // 设置初始值。
            elem.style[key] = from && key in from ? from[key] : elem.style[key] || Dom.getStyle(elem, key);
        }
        
        // 生成渐变样式。
        var transitions = [];
        for (var key in to) {
            transitions.push(key + ' ' + duration + 'ms ' + ease + ' ' + dalay + 's ');
        }
        elem.style[fxOptions.transition] = transitions.join(',');

        // 设置回调函数。
        var timer;
        var proxy = function(e) {

            // 确保事件不是冒泡的。
            if (e && e.target !== e.currentTarget) {
                return;
            }

            // 确保当前函数只执行一次。
            if (timer) {
                clearTimeout(timer);
                timer = 0;

                // 删除特效。
                elem.style[fxOptions.transition] = '';

                // 解绑事件。
                elem.removeEventListener(fxOptions.transitionEnd, proxy, false);

                // 执行回调。
                callback && callback.call(this)
            }

        };

        elem.addEventListener(fxOptions.transitionEnd, proxy, false);
        timer = setTimeout(proxy, duration);

        // 触发页面重计算以保证效果可以触发。
        elem.offsetWidth && elem.clientLeft;

        // 设置 CSS 属性以激活样式。
        for (var key in to) {
            elem.style[key] = to[key];
        }

    },

    // #endregion

};

/**
 * 快速调用 Dom.get 或 Dom.find 或 Dom.parse 或 Dom.ready。
 * @param {Function/String/Node} selector 要执行的 CSS 选择器或 HTML 片段或 DOM Ready 函数。
 * @return {Dom} 返回匹配的节点列表。
 */
var $ = $ || (function() {
    function $(selector) {
        if (selector) {
            if (selector.constructor === String) {
                return new addAll(/^</.test(selector) ? Dom.parse(selector).parentNode.childNodes : Dom.query(selector));
            }
            if (selector instanceof Function) {
                return Dom.ready(selector);
            }
        }
        return new addAll([selector]);
    }

    function addAll(domList) {
        domList && Dom.each(domList, function (elem) {
            this[this.length++] = elem;
        }, this);
    }

    $.prototype = addAll.prototype = [];
    return $;
})();
