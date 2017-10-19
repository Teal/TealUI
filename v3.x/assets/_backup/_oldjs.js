
//// #region 核心
///**
// * @author xuld
// * @fileOverview 提供 DOM 操作的辅助函数。
// */

///**
// * 快速调用 Dom.get 或 Dom.find 或 Dom.parse 或 Dom.ready。
// * @param {Function/String/Node} selector 要执行的 CSS 选择器或 HTML 片段或 DOM Ready 函数。
// * @returns {Dom} 返回匹配的节点列表。
// */
//var $ = $ || function (selector) {
//    return selector instanceof Function ? Dom.ready(selector) :
//        selector && selector.constructor === String ?
//            /^</.test(selector) ? Dom.parse(selector) : Dom.find(selector) :
//            new Dom([selector]);
//};

///**
// * 提供操作 DOM 的静态高效方法。
// * @static
// * @class
// */
//var Dom = {

//    // #region 集合操作

//    /**
//     * 用户自定义 DOM 扩展方法。
//     */
//    prototype: {},

//    /**
//     * 遍历指定的节点列表并对每个节点执行回调。
//     * @param {NodeList} nodeList 要遍历的节点列表:
//     * @param {Function} callback 对每个元素运行的函数。函数的参数依次为:
//     *
//     * - {Object} value 当前元素的值。
//     * - {Number} index 当前元素的索引。
//     * - {Dom} array 当前正在遍历的数组。
//     *
//     * 可以让函数返回 **false** 来强制中止循环。
//     * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
//     * @returns {Boolean} 如果循环是因为 *fn* 返回 **false** 而中止，则返回 **false**， 否则返回 **true**。
//     */
//    each: function (nodeList, callback) {
//        for (var i = 0, node; node = nodeList[i]; i++) {
//            if (callback.call(bind, node, i, nodeList) === false) {
//                return false;
//            }
//        }
//        return true;
//    },

//    // #endregion

//    // #region 创建、查找和获取

//    /**
//	 * 执行一个 CSS 选择器，返回所有匹配的节点列表。
//	 * @param {String} selector 要执行的 CSS 选择器。
//	 * @param {Document} context 执行的上下文文档。
//	 * @returns {NodeList} 返回匹配的节点列表。
//	 * @example
//	 * 找到所有 p 元素。
//	 * #####HTML:
//	 * <pre lang="htm" format="none">
//	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
//	 * </pre>
//	 * 
//	 * #####Javascript:
//	 * <pre>
//	 * Dom.query("p");
//	 * </pre>
//	 * 
//	 * #####结果:
//	 * <pre lang="htm" format="none">
//	 * [  &lt;p&gt;one&lt;/p&gt; ,&lt;p&gt;two&lt;/p&gt;, &lt;p&gt;three&lt;/p&gt;  ]
//	 * </pre>
//	 * 
//	 * <br>
//	 * 找到所有 p 元素，并且这些元素都必须是 div 元素的子元素。
//	 * #####HTML:
//	 * <pre lang="htm" format="none">
//	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
//	 * 
//	 * #####Javascript:
//	 * <pre>
//	 * Dom.query("div &gt; p");
//	 * </pre>
//	 * 
//	 * #####结果:
//	 * <pre lang="htm" format="none">
//	 * [ &lt;p&gt;two&lt;/p&gt; ]
//	 * </pre>
//	 * 
//	 * <br>
//	 * 查找所有的单选按钮(即: type 值为 radio 的 input 元素)。
//	 * <pre>Dom.query("input[type=radio]");</pre>
//	 */
//    query: function (selector, context) {
//        return (context || document).querySelectorAll(selector);
//    },

//    /**
//	 * 执行一个 CSS 选择器，返回匹配的第一个节点。
//	 * @param {String} selector 要执行的 CSS 选择器。
//	 * @param {Document} context 执行的上下文文档。
//	 * @returns {Element} 返回匹配的节点。
//	 */
//    find: function (selector, context) {
//        return (context || document).querySelector(selector);
//    },

//    /**
//     * 判断指定节点是否符合指定的选择器。
//     * @param {Element} elem 要测试的元素。
//	 * @param {String} selector 要测试的 CSS 选择器。
//     * @returns {Boolean} 如果表达式匹配则返回 true，否则返回  false 。
//     * @example
//     * 由于input元素的父元素是一个表单元素，所以返回true。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;form&gt;&lt;input type="checkbox" /&gt;&lt;/form&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.matches(Dom.find('input'), "input")</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">true</pre>
//     */
//    matches: function (elem, selector) {

//        // 基于原生的判断。
//        var nativeMatchesSelector = elem.matchesSelector || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.oMatchesSelector;
//        if (nativeMatchesSelector) {
//            return nativeMatchesSelector.call(elem, selector);
//        }

//        // 原生不支持：使用内置的判断。
//        var parent = elem.parentNode, tempParent = !parent && Dom.getDocument(elem).body;
//        tempParent && tempParent.appendChild(elem);
//        try {
//            return Array.prototype.indexOf.call(Dom.query(selector, parent), elem) >= 0;
//        } finally {
//            tempParent && tempParent.removeChild(elem);
//        }

//    },

//    /**
//	 * 根据 *id* 获取节点。
//	 * @param {String} id 要获取元素的 ID。
//	 * @returns {Element} 返回匹配的节点。
//	 * @static
//	 * @example
//	 * 找到 id 为 a 的元素。
//	 * #####HTML:
//	 * <pre lang="htm" format="none">
//	 * &lt;p id="a"&gt;once&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
//	 * </pre>
//	 * #####JavaScript:
//	 * <pre>Dom.get("a");</pre>
//	 * #####结果:
//	 * <pre>&lt;p id="a"&gt;once&lt;/p&gt;</pre>
//	 */
//    get: function (id) {
//        return document.getElementById(id);
//    },

//    /**
//     * 解析一个 html 字符串，返回相应的 DOM 对象。
//     * @param {String} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
//     * @returns {Element} 返回包含所有已解析的节点的 DOM 对象。
//     * @static
//     */
//    parse: function (html, context) {
//        if (typeof html !== 'object') {
//            context = context && context !== document ? context.createElement('div') : (Dom._parseContainer || (Dom._parseContainer = document.createElement('div')));
//            context.innerHTML = html;
//            html = new Dom(context.childNodes);
//        }
//        return html;
//    },

//    // #endregion

//    // #region 事件

//    /**
//     * 设置在 DOM 解析完成后的回调函数。
//     * @param {Function} callback 当 DOM 解析完成后的回调函数。
//     */
//    ready: function (callback) {
//        if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
//            callback.call(document);
//        } else {
//            document.addEventListener('DOMContentLoaded', callback, false);
//        }
//    },

//    /**
//     * 为 DOM 添加一个事件监听器。
//     * @param {Element} elem 要处理的元素。
//     * @param {String} eventName 要添加的事件名。
//     * @param {Function} eventListener 要添加的事件监听器。
//     */
//    addListener:

//    // #if CompactMode

//    window.attachEvent ? function (elem, eventName, /*Function*/eventListener) {
//        elem.attachEvent('on' + eventName, eventListener);
//    } :

//    // #endif

//    function (/*Element*/elem, eventName, /*Function*/eventListener) {
//        elem.addEventListener(eventName, eventListener, false);
//    },

//    /**
//     * 为 DOM 移除一个事件监听器。
//     * @param {Element} elem 要处理的元素。
//     * @param {String} eventName 要添加的事件名。
//     * @param {Function} eventListener 要添加的事件监听器。
//     */
//    removeListener:

//    // #if CompactMode

//    window.detachEvent ? function (/*Element*/elem, eventName, /*Function*/eventListener) {
//        elem.detachEvent('on' + eventName, eventListener);
//    } :

//    // #endif

//    function (/*Element*/elem, eventName, /*Function*/eventListener) {
//        elem.removeEventListener(eventName, eventListener, false);
//    },

//    /**
//     * 为指定元素添加一个事件监听器。
//     * @param {Element} elem 要处理的元素。
//     * @param {String} eventName 要添加的事件名。
//     * @param {Function} eventListener 要添加的事件监听器。
//     */
//    on: function (/*Element*/elem, eventName, /*Function*/eventListener) {
//        elem.addEventListener(eventName, eventListener, false);
//    },

//    /**
//     * 删除指定元素的一个或多个事件监听器。
//     * @param {Element} elem 要处理的元素。
//     * @param {String} eventName 要删除的事件名。
//     * @param {Function} eventListener 要删除的事件处理函数。
//     */
//    off: function (/*Element*/elem, eventName, /*Function*/eventListener) {
//        elem.removeEventListener(eventName, eventListener, false);
//    },

//    /**
//     * 触发一个事件，执行已添加的监听器。
//     * @param {Element} elem 要处理的元素。
//     * @param {String} eventName 要触发的事件名。
//     * @param {Object} eventArgs 传递给监听器的事件对象。
//     */
//    trigger: function (/*Element*/elem, eventName, eventArgs) {
//        var eventFix = Dom.triggerFix;
//        if (!eventFix) {
//            Dom.triggerFix = eventFix = {};
//            eventFix.click = eventFix.mousedown = eventFix.mouseup = eventFix.mousemove = 'MouseEvents';
//        }

//        var event = document.createEvent(eventFix[eventName] || 'Events'),
//            bubbles = true;
//        for (var name in eventArgs) {
//            name === 'bubbles' ? (bubbles = !!e[name]) : (event[name] = eventArgs[name]);
//        }
//        event.initEvent(eventName, bubbles, true);
//        elem.dispatchEvent(event);
//    },

//    // #endregion

//    // #region 文档遍历

//    /**
//	 * 获取指定节点的文档。
//	 * @param {Node} node 要获取的节点。
//	 * @returns {Document} 文档。
//	 */
//    getDocument: function (/*Node*/node) {
//        return node.ownerDocument || node.document || node;
//    },

//    /**
//     * 判断指定节点是否包含目标节点。
//     * @param {Element} node 要判断的容器节点。
//     * @param {Element} child 要判断的子节点。
//     * @returns {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
//     * @static
//     */
//    contains: function (/*Node*/node, /*Node*/child) {

//        // #if CompactMode

//        if (!node.contains) {
//            while (child) {
//                if (node === child)
//                    return true;
//                child = child.parentNode;
//            }
//            return false;
//        }

//        // #endif

//        return node.contains(child);
//    },

//    /**
//     * 获取指定节点及父节点对象中第一个满足指定 CSS 选择器或函数的节点。
//     * @param {Node} node 节点。
//     * @param {String} selector 用于判断的元素的 CSS 选择器。
//     * @param {Node} [context=document] 只在指定的节点内搜索此元素。
//     * @returns {Node} 如果要获取的节点满足要求，则返回要获取的节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
//     * @remark
//     * closest 和 parent 最大区别就是 closest 会测试当前的元素。
//     */
//    closest: function (/*Node*/node, selector, context) {
//        while (node) {

//            // 如果 node 到达了指定上下文，则停止查找。
//            if (context && node === context) {
//                break;
//            }

//            if (Dom.matches(node, selector)) {
//                break;
//            }

//            node = node.parentNode;
//        }
//        return node;
//    },

//    /**
//     * 获取指定节点的父元素。
//     * @param {Node} node 要获取的节点。
//     * @returns {Element} 返回父节点。如果不存在，则返回 null 。
//     * @example
//     * 找到每个span元素的所有祖先元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.parent(Dom.find("span"))</pre>
//     */
//    parent: function (/*Node*/node) {
//        return node.parentNode;
//    },

//    /**
//     * 获取指定节点的第一个子元素。
//     * @param {Node} node 要获取的节点。
//     * @returns {Element} 返回一个元素。如果不存在，则返回 null 。
//     * @example
//     * 获取匹配的第二个元素
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.first(Dom.find("p"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
//     */
//    first: function (/*Node*/node) {
//        return node.firstElementChild;
//    },

//    /**
//     * 获取指定节点的最后一个子节点对象。
//     * @param {Node} node 要获取的节点。
//     * @returns {Element} 返回一个元素。如果不存在，则返回 null 。
//     * @example
//     * 获取匹配的第二个元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.last(Dom.find("p"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
//     */
//    last: function (/*Node*/node) {
//        return node.lastElementChild;
//    },

//    /**
//     * 获取指定节点的下一个相邻节点对象。
//     * @param {Node} node 要获取的节点。
//     * @returns {Element} 返回一个元素。如果不存在，则返回 null 。
//     * @example
//     * 找到每个段落的后面紧邻的同辈元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.next(Dom.find("p"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p&gt;Hello Again&lt;/p&gt;, &lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt; ]</pre>
//     */
//    next: function (/*Node*/node) {
//        return node.nextElementSibling;
//    },

//    /**
//     * 获取指定节点的上一个相邻的节点对象。
//     * @param {Node} node 要获取的节点。
//     * @returns {Element} 返回一个元素。如果不存在，则返回 null 。
//     * @example
//     * 找到每个段落紧邻的前一个同辈元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("p").getPrevious()</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt; ]</pre>
//     *
//     * 找到每个段落紧邻的前一个同辈元素中类名为selected的元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/div&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.prev(Dom.find("p"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
//     */
//    prev: function (node) {
//        return node.previousElementSibling;
//    },

//    /**
//     * 获取指定节点的全部直接子元素。
//     * @param {Node} node 要获取的节点。
//     * @returns {NodeList} 返回所有元素列表。
//     * @example
//     *
//     * 查找DIV中的每个子元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("div").getChildren()</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;span&gt;Hello Again&lt;/span&gt; ]</pre>
//     *
//     * 在每个div中查找 div。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;&lt;/div&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.children(Dom.find("div"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
//     */
//    children: function (node) {
//        return node.children;
//    },

//    // #endregion

//    // #region 增删操作

//    /**
//     * 插入一个HTML 到末尾。
//	 * @param {Node} node 要获取的节点。
//     * @param {String} html 要插入的内容。
//     * @returns {Node} 返回插入的新节点对象。
//     */
//    append: function (node, html) {
//        var c = Dom.parse(html, Dom.getDocument(node)).parentNode;
//        while (c.firstChild) {
//            node.appendChild(c.firstChild);
//        }
//        return node.lastChild;
//    },

//    /**
//     * 插入一个 HTML 到顶部。
//	 * @param {Node} node 要获取的节点。
//     * @param {String} html 要插入的内容。
//     * @returns {Node} 返回插入的新节点对象。
//     */
//    prepend: function (node, html) {
//        var c = Dom.parse(html, Dom.getDocument(node)).parentNode, p = node.firstChild;
//        while (c.firstChild) {
//            node.insertBefore(c.firstChild, p);
//        }
//        return node.firstChild;
//    },

//    /**
//     * 插入一个HTML 到前面。
//	 * @param {Node} node 要获取的节点。
//     * @param {String} html 要插入的内容。
//     * @returns {Node} 返回插入的新节点对象。
//     */
//    before: function (node, html) {
//        // #assert node.parentNode, "只有存在父节点的才能插入节点到其前面"
//        var c = Dom.parse(html, Dom.getDocument(node)).parentNode, p = node.parentNode;
//        while (c.firstChild) {
//            p.insertBefore(c.firstChild, node);
//        }
//        return node.previousSibling;
//    },

//    /**
//     * 插入一个HTML 到后面。
//	 * @param {Node} node 要获取的节点。
//     * @param {String} html 要插入的内容。
//     * @returns {Node} 返回插入的新节点对象。
//     */
//    after: function (node, html) {
//        // #assert node.parentNode, "只有存在父节点的才能插入节点到其后面"
//        return node.nextSibling ? Dom.before(node.nextSibling, html) : Dom.append(node.parentNode, html);
//    },

//    /**
//     * 如果指定节点未添加到 DOM 树，则进行添加。
//	 * @param {Node} node 要获取的节点。
//	 * @param {Node} parentNode 渲染的父节点。
//	 * @param {Node} refNode 插入的引用节点。
//     */
//    render: function (node, parentNode, refNode) {
//        if (parentNode) {
//            parentNode.insertBefore(node, refNode || null);
//        } else if (!Dom.contains(Dom.getDocument(node), node)) {
//            Dom.getDocument(node).body.appendChild(node);
//        }
//    },

//    /**
//     * 移除指定节点或其子对象。
//	 * @param {Node} node 要获取的节点。
//     * @remark
//     * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
//     * @example
//     * 从DOM中把所有段落删除。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("p").remove();</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">how are</pre>
//     *
//     * 从DOM中把带有hello类的段落删除
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("p").remove(".hello");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">how are &lt;p&gt;you?&lt;/p&gt;</pre>
//     */
//    remove: function (/*Node*/node) {
//        node.parentNode && node.parentNode.removeChild(node);
//    },

//    /**
//     * 创建并返回指定节点的副本。
//	 * @param {Node} node 要获取的节点。
//     * @param {Boolean} deep=true 是否复制子元素。
//     * @param {Boolean} cloneDataAndEvent=false 是否复制数据和事件。
//     * @param {Boolean} keepId=false 是否复制 id 。
//     * @returns {Node} 新节点对象。
//     *
//     * @example
//     * 克隆所有b元素（并选中这些克隆的副本），然后将它们前置到所有段落中。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;, how are you?&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("b").clone().prependTo("p");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;&lt;b&gt;Hello&lt;/b&gt;, how are you?&lt;/p&gt;</pre>
//     */
//    clone: function (/*Node*/node, deep) {
//        return node.cloneNode(deep !== false);
//    },

//    // #endregion

//    // #region 属性和样式

//    /**
//     * 修复部分属性的获取和设置方式。
//     */
//    _fixAttr: function (name) {
//        var attrHooks = Dom._attrHooks;
//        if (!attrHooks) {

//            Dom._attrHooks = attrHooks = {

//                // 默认用于获取和设置属性的钩子。
//                _: function (elem, name, getting, value) {
//                    if (getting) {
//                        return !(name in elem) && elem.getAttribute ? elem[name] : elem.getAttribute(name);
//                    }

//                    if (name in elem || !elem.setAttribute) {
//                        elem[name] = value;
//                    } else if (value === null) {
//                        elem.removeAttribute(name);
//                    } else {
//                        elem.setAttribute(name, value);
//                    }

//                },

//                style: function (elem, name, getting, value) {
//                    elem = elem[name];
//                    if (getting) {
//                        return elem.cssText;
//                    }
//                    elem.cssText = value;
//                },

//                //// NOTE: 不同浏览器获取不支持 tabIndex 的节点的 tabIndex 属性时返回值不同。
//                //// 由于 tabIndex 使用频率低，因此框架不提供兼容支持，参考：
//                //// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
//                //tabIndex: function (elem, name, getting, value) {
//                //    if (getting) {
//                //        var value = elem.getAttributeNode(name);
//                //        value = value && value.specified && value.value || null;
//                //        return type ? value : +value;
//                //    }
//                //    elem[name] = value;
//                //},

//                selected: function (elem, name, getting, value) {

//                    // Webkit、IE 误报 selected 属性。
//                    // 通过调用 parentNode 属性修复。
//                    var parent = elem.parentNode;

//                    // 激活 select, 更新 option 的 select 状态。
//                    if (parent) {
//                        parent.selectedIndex;

//                        // 同理，处理 optgroup 
//                        if (parent.parentNode) {
//                            parent.parentNode.selectedIndex;
//                        }
//                    }

//                    return attrHooks._(elem, name, getting, value);

//                }

//            };

//            // #if CompactMode

//            if (!+"\v") {
//                attrHooks._default = attrHooks._;
//                attrHooks._ = function (elem, name, getting, value) {

//                    // 不是节点则获取属性。
//                    if (!elem.getAttributeNode) {
//                        return attrHooks._default(elem, name, getting, value);
//                    }

//                    var node = elem.getAttributeNode(name);
//                    if (getting) {
//                        return name ? name.value || (name.specified ? "" : null) : null;
//                    }

//                    // 如果 value === null 表示删除节点。
//                    if (value === null) {
//                        if (node) {
//                            node.nodeValue = '';
//                            elem.removeAttributeNode(node);
//                        }
//                    } else if (node) {
//                        node.nodeValue = value;
//                    } else {
//                        elem.setAttribute(name, value);
//                    }

//                };
//            }

//            // #endif

//            Dom._attrFix = {
//                'for': 'htmlFor',
//                'class': 'className',
//                'tabindex': 'tabIndex',
//                'readonly': 'readOnly',
//                'maxlength': 'maxLength',
//                'cellspacing': 'cellSpacing',
//                'cellpadding': 'cellPadding',
//                'rowspan': 'rowSpan',
//                'colspan': 'colSpan',
//                'usemap': 'useMap',
//                'frameborder': 'frameBorder',
//                'contenteditable': 'contentEditable'
//            };

//        }

//        // NOTE: <form> 元素会获取内部存在指定 ID 的节点。

//        return attrHooks[Dom._attrFix[name] || name] || attrHooks._default;
//    },

//    /**
//     * 获取元素的属性值。
//     * @param {Element} elem 要获取的元素。
//     * @param {String} name 要获取的属性名称。
//     * @returns {String} 返回属性值。如果元素没有相应属性，则返回 null 。
//     * @static
//     */
//    getAttr: function (/*Element*/elem, name) {
//        return Dom._fixAttr(name)(elem, name, true);
//    },

//    /**
//     * 设置或删除一个 HTML 属性值。
//     * @param {String} name 要设置的属性名称。
//     * @param {String} value 要设置的属性值。当设置为 null 时，删除此属性。
//     * @returns this
//     * @example
//     * 为图像设置 src 属性。
//     * #####HTML:
//     * <pre lang="htm" format="none">
//     * &lt;img/&gt;
//     * </pre>
//     * #####JavaScript:
//     * <pre>Dom.setAttr(Dom.find("img"), "src","test.jpg");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;img src= "test.jpg" /&gt; , &lt;img src= "test.jpg" /&gt; ]</pre>
//     *
//     * 将文档中图像的src属性删除
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;img src="test.jpg"/&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.setAttr(Dom.find("img"), "src");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;img /&gt; ]</pre>
//     */
//    setAttr: function (elem, name, value) {
//        return Dom._fixAttr(name)(elem, name, false, value);
//    },

//    _fixText: function (node) {
//        return (Dom._textFix || (Dom._textFix = {
//            'INPUT': 'value',
//            'SELECT': 'value',
//            'TEXTAREA': 'value',
//            '#text': 'nodeValue',
//            '#comment': 'nodeValue'
//        }))[node.nodeName] || ('textContent' in document ? 'textContent' : 'innerText');
//    },

//    /**
//     * 获取一个元素对应的文本。
//     * @param {Element} node 元素。
//     * @returns {String} 值。对普通节点返回 text 属性。
//     * @static
//     */
//    getText: function (/*Element*/node) {
//        return node[Dom._fixText(node)] || '';
//    },

//    /**
//     * 设置指定节点的文本内容。对于输入框则设置其输入的值。
//     * @param {String} 用于设置元素内容的文本。
//     * @returns this
//     * @see #setHtml
//     * @remark 与 {@link #setHtml} 类似, 但将编码 HTML (将 "&lt;" 和 "&gt;" 替换成相应的HTML实体)。
//     * @example
//     * 设定文本框的值。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;input type="text"/&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.setText(Dom.find("input"),"hello world!");</pre>
//     */
//    setText: function (/*Element*/node, value) {
//        node[Dom._fixText(node)] = value;
//    },

//    /**
//     * 获取指定节点的 Html。
//     * @returns {String} HTML 字符串。
//     * @example
//     * 获取 id="a" 的节点的内部 html。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.getHtml(document.body);</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">"&lt;p/&gt;"</pre>
//     */
//    getHtml: function (/*Element*/elem) {
//        return elem.innerHTML;
//    },

//    /**
//     * 设置指定节点的 Html。
//     * @param {String} value 要设置的 Html。
//     * @example
//     * 设置一个节点的内部 html
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.setHtml(Dom.get("a"), "&lt;a/&gt;");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;a/&gt;&lt;/div&gt;</pre>
//     */
//    setHtml: function (/*Element*/elem, value) {

//        // #if CompactMode

//        // IE6-8: 需要处理特殊标签。
//        if (!+"\v") {
//            Dom.empty(elem);
//            Dom.append(elem, value);
//            return;
//        }

//        // #endif

//        elem.innerHTML = value;
//    },

//    /**
//     * 删除指定节点的所有子节点。
//     * @returns this
//     * @example
//     * 把所有段落的子元素（包括文本节点）删除。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello, &lt;span&gt;Person&lt;/span&gt; &lt;a href="#"&gt;and person&lt;/a&gt;&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("p").empty();</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">&lt;p&gt;&lt;/p&gt;</pre>
//     */
//    empty: function (elem) {
//        elem.innerHTML = '';
//    },

//    /**
//     * 检查是否含指定类名。
//     * @param {Element} elem 要测试的元素。
//     * @param {String} className 类名。
//     * @returns {Boolean} 如果存在返回 true。
//     * @static
//     */
//    hasClass: function (/*Element*/elem, className) {
//        // #assert className && (!className.indexOf || !/[\s\r\n]/.test(className)), 'className 不能为空，且不允许有空格和换行；如果需要判断 2 个 class 同时存在，可以调用两次本函数： if(hasClass('A') && hasClass('B')) ...")'

//        // #if CompactMode

//        if (!elem.classList) {
//            return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
//        }

//        // #endif

//        return elem.classList.contains(className);
//    },

//    /**
//     * 为指定节点添加指定的 Css 类名。
//     * @param {String} className 一个或多个要添加到元素中的CSS类名，用空格分开。
//     * @returns this
//     * @example
//     * 为匹配的元素加上 'selected' 类。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("p").addClass("selected");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt; ]</pre>
//     *
//     * 为匹配的元素加上 selected highlight 类。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.addClass(Dom.find("p"), "selected highlight");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p class="selected highlight"&gt;Hello&lt;/p&gt; ]</pre>
//     */
//    addClass: function (/*Element*/elem, className) {

//        // #if CompactMode

//        if (!elem.classList) {
//            if ((" " + elem.className + " ").indexOf(className) < 0) {
//                elem.className += ' ' + className;
//            }
//            return;
//        }

//        // #endif

//        elem.classList.add(className);
//    },

//    /**
//     * 从指定节点中删除全部或者指定的类。
//     * @param {String} [className] 一个或多个要删除的CSS类名，用空格分开。如果不提供此参数，将清空 className 。
//     * @returns this
//     * @example
//     * 从匹配的元素中删除 'selected' 类
//     * #####HTML:
//     * <pre lang="htm" format="none">
//     * &lt;p class="selected first"&gt;Hello&lt;/p&gt;
//     * </pre>
//     * #####JavaScript:
//     * <pre>Dom.removeClass(Dom.find("p"), "selected");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">
//     * [ &lt;p class="first"&gt;Hello&lt;/p&gt; ]
//     * </pre>
//     */
//    removeClass: function (/*Element*/elem, className) {

//        // #if CompactMode

//        if (!elem.classList) {
//            elem.className = className ? (" " + elem.className + " ").replace(" " + classList[i] + " ", " ").trim() : '';
//            return;
//        }

//        // #endif

//        className ? elem.classList.remove(className) : (elem.className = '');
//    },

//    /**
//     * 如果存在（不存在）就删除（添加）一个类。
//     * @param {String} className CSS类名。
//     * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
//     * @returns this
//     * @see #addClass
//     * @see #removeClass
//     * @example
//     * 为匹配的元素切换 'selected' 类
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.toggleClass(Dom.find("p"), "selected");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt;, &lt;p&gt;Hello Again&lt;/p&gt; ]</pre>
//     */
//    toggleClass: function (elem, className, value) {

//        // #if CompactMode

//        if (!elem.classList) {
//            ((value == undefined ? Dom.hasClass(elem, className) : !value) ? Dom.removeClass : Dom.addClass)(elem, className);
//            return;
//        }

//        // #endif

//        elem.classList.toggle(className, value);
//    },

//    /**
//     * 读取指定节点的当前样式，返回字符串。
//     * @param {Element} elem 要获取的元素。
//     * @param {String} camelizedCssPropertyName 已转为骆驼格式的 CSS 属性名。
//     * @returns {String} 字符串。
//     */
//    styleString: function (/*Element*/elem, camelizedCssPropertyName) {

//        // #if CompactMode

//        if (!window.getComputedStyle) {
//            if (camelizedCssPropertyName === 'width') {
//                return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
//            }
//            if (camelizedCssPropertyName === 'height') {
//                return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
//            }
//            if (camelizedCssPropertyName === 'opacity') {
//                return /opacity=([^)]*)/.test(Dom.styleString(elem, 'filter')) ? parseInt(RegExp.$1) / 100 + '' : '1';
//            }

//            // currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
//            // currentStyle是运行时期样式与style属性覆盖之后的样式
//            var r = elem.currentStyle[name];

//            // 来自 jQuery
//            // 如果返回值不是一个带px的 数字。 转换为像素单位
//            if (/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {

//                // 保存初始值
//                var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;

//                // 放入值来计算
//                elem.runtimeStyle.left = elem.currentStyle.left;
//                style.left = name === "fontSize" ? "1em" : (r || 0);
//                r = style.pixelLeft + "px";

//                // 回到初始值
//                style.left = left;
//                elem.runtimeStyle.left = rsLeft;

//            }

//            return r;
//        }

//        // #endif

//        return elem.style[camelizedCssPropertyName] || elem.ownerDocument.defaultView.getComputedStyle(elem, '')[camelizedCssPropertyName];
//    },

//    /**
//     * 读取指定节点的当前样式，返回数值。
//     * @param {Element} elem 要获取的元素。
//     * @param {String} camelizedCssPropertyName 已转为骆驼格式的 CSS 属性名。
//     * @returns {Number} 数值。
//     */
//    styleNumber: function (/*Element*/elem, camelizedCssPropertyName) {

//        // #if CompactMode

//        if (!window.getComputedStyle) {
//            return parseFloat(Dom.styleString(elem, camelizedCssPropertyName));
//        }

//        // #endif

//        var value = elem.style[camelizedCssPropertyName];
//        return value && (value = parseFloat(value)) != null ? value : (parseFloat(elem.ownerDocument.defaultView.getComputedStyle(elem, '')[camelizedCssPropertyName]) || 0);
//    },

//    /**
//     * 到骆驼模式。
//     * @param {String} name 匹配的内容。
//     * @returns {String} 返回的内容。
//     */
//    camelCase: function (name) {
//        return name === 'float' ? +"\v" ? 'cssFloat' : 'styleFloat' : name.replace(/-+(\w?)/g, function (match, chr) { return chr.toUpperCase() });
//    },

//    /**
//     * 获取指定节点的样式。
//     * @param {Element} elem 要获取的元素。
//     * @param {String} cssPropertyName CSS 属性名。
//     * @returns {String} 字符串。
//     */
//    getStyle: function (/*Element*/elem, /*String*/cssPropertyName) {
//        return Dom.styleString(elem, Dom.camelCase(cssPropertyName));
//    },

//    /**
//     * 设置指定节点的样式。
//     * @param {Element} elem 要设置的元素。
//     * @param {String} cssPropertyName CSS 属性名或 CSS 字符串。
//     * @param {String/Number} value CSS属性值，数字如果不加单位，则会自动添加像素单位。
//     * @example
//     * 将所有段落的字体颜色设为红色并且背景为蓝色。
//     * <pre>Dom.query("p").setStyle('color', "#ff0011");</pre>
//     */
//    setStyle: function (/*Element*/elem, /*String*/cssPropertyName, value) {

//        // 将属性名转为骆驼形式。
//        cssPropertyName = Dom.camelCase(cssPropertyName);

//        if (!window.getComputedStyle && value === 'opacity') {

//        }

//        // 为数字自动添加 px 单位。
//        if (value != null && value.constructor === Number) {
//            var styleNumbers = Dom.styleNumbers;
//            if (!styleNumbers) {
//                Dom.styleNumbers = styleNumbers = {};
//                'fillOpacity fontWeight lineHeight opacity orphans widows zIndex columnCount zoom'.replace(/\b\w+\b/g, function (value) {
//                    styleNumbers[value] = 1;
//                });
//            }
//            if (!(cssPropertyName in styleNumbers)) {
//                value += 'px';
//            }
//        }

//        elem.style[cssPropertyName] = value;

//    },

//    /**
//     * 设置一个元素可移动。
//     * @param {Element} elem 要处理的元素。
//     * @static
//     */
//    movable: function (/*Element*/elem) {
//        if (!/^(?:abs|fix)/.test(Dom.styleString(elem, "position")))
//            elem.style.position = "relative";
//    },

//    /**
//     * 判断当前元素是否是隐藏的。
//     * @param {Element} elem 要判断的元素。
//     * @returns {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
//     */
//    isHidden: function (/*Element*/elem) {
//        return Dom.styleString(elem, 'display') === 'none';
//    },

//    /**
//     * 通过设置 display 属性来显示元素。
//     * @param {Element} elem 要处理的元素。
//     * @static
//     */
//    show: function (/*Element*/elem) {

//        // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
//        elem.style.display = '';

//        // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
//        if (Dom.isHidden(elem)) {
//            var defaultDisplay = elem.style.defaultDisplay;
//            if (!defaultDisplay) {
//                var defaultDisplayCache = Dom.defaultDisplayCache || (Dom.defaultDisplayCache = {});
//                defaultDisplay = defaultDisplayCache[elem.nodeName];
//                if (!defaultDisplay) {
//                    var elem = document.createElement(nodeName);
//                    document.body.appendChild(elem);
//                    defaultDisplay = Dom.styleString(elem);
//                    if (defaultDisplay === 'none') {
//                        defaultDisplay = 'block';
//                    }
//                    defaultDisplayCache[nodeName] = defaultDisplay;
//                    document.body.removeChild(elem);
//                }
//            }
//            elem.style.display = defaultDisplay;
//        }

//    },

//    /**
//     * 通过设置 display 属性来隐藏元素。
//     * @param {Element} elem 要处理的元素。
//     * @static
//     */
//    hide: function (/*Element*/elem) {
//        var currentDisplay = Dom.styleString(elem, 'display');
//        if (currentDisplay !== 'none') {
//            elem.style.defaultDisplay = currentDisplay;
//            elem.style.display = 'none';
//        }
//    },

//    /**
//     * 通过设置 display 属性切换显示或隐藏元素。
//     * @param {Element} elem 要处理的元素。
//     * @param {Boolean?} value 要设置的元素。
//     * @static
//     */
//    toggle: function (/*Element*/elem, value) {
//        (value == null ? Dom.isHidden(elem) : value) ? Dom.show(elem) : Dom.hide(elem);
//    },

//    // #endregion

//    // #region 尺寸和定位

//    /**
//	 * 根据不同的内容进行计算。
//	 * @param {Element} elem 要计算的元素。
//	 * @param {String} expression 要计算的表达式。其中使用变量代表 CSS 属性值，如 "width+paddingLeft"。
//	 * @returns {Number} 返回计算的值。
//	 * @static
//	 */
//    calc: function (/*Element*/elem, expression) {

//        // #if CompactMode

//        if (!window.getComputedStyle) {
//            return eval(expression.replace(/(\w+)/g, 'Dom.styleNumber(elem, "$1")'));
//        }

//        // #endif

//        var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
//        return eval(expression.replace(/(\w+)/g, '(parseFloat(computedStyle.$1)||0)'));
//    },

//    /**
//     * 获取指定节点的可视区域大小。包括 border 大小。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 大小。
//     * @remark
//     * 此方法对可见和隐藏元素均有效。
//     * 获取元素实际占用大小（包括内边距和边框）。
//     * @example
//     * 获取第一段落实际大小。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.getSize(Dom.find("p:first"));</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">{x=200,y=100}</pre>
//     */
//    getSize: function (/*Element*/elem) {
//        return elem.nodeType === 9 ? {
//            x: elem.documentElement.clientWidth,
//            y: elem.documentElement.clientHeight,
//        } : {
//            x: elem.offsetWidth,
//            y: elem.offsetHeight
//        };
//    },

//    /**
//     * 设置指定节点的可视区域大小。
//     * @param {Element} elem 要设置的元素。
//     * @param {Number/Point} x 要设置的宽或一个包含 x、y 属性的对象。如果不设置，使用 null 。
//     * @param {Number} y 要设置的高。如果不设置，使用 null 。
//     * @returns this
//     * @remark
//     * 设置元素实际占用大小（包括内边距和边框，但不包括滚动区域之外的大小）。
//     * 此方法对可见和隐藏元素均有效。
//     * @example
//     * 设置 id=myP 的段落的大小。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p id="myP"&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.setSize(Dom.get("myP"), {x:200,y:100});</pre>
//     */
//    setSize: function (/*Element*/elem, value) {
//        if (value.x != null) {
//            elem.style.width = value.x - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
//        }
//        if (value.y != null) {
//            elem.style.height = value.y - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
//        }
//    },

//    /**
//     * 获取指定节点的滚动区域大小。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     * @remark
//     * getScrollSize 获取的值总是大于或的关于 getSize 的值。
//     * 此方法对可见和隐藏元素均有效。
//     */
//    getScrollSize: function (/*Element*/elem) {
//        return elem.nodeType === 9 ? {
//            x: Math.max(elem.documentElement.scrollWidth, elem.body.scrollWidth, elem.clientWidth),
//            y: Math.max(elem.documentElement.scrollHeight, elem.body.scrollHeight, elem.clientHeight)
//        } : {
//            x: elem.scrollWidth,
//            y: elem.scrollHeight
//        };
//    },

//    /**
//     * 获取文档的滚动位置。
//	 * @param {Document} doc 要计算的文档。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     */
//    getDocumentScroll: function (/*Document*/doc) {
//        var win;
//        return 'pageXOffset' in (win = doc.defaultView || doc.parentWindow) ? {
//            x: win.pageXOffset,
//            y: win.pageYOffset
//        } : {
//            x: doc.documentElement.scrollLeft,
//            y: doc.documentElement.scrollTop
//        };
//    },

//    /**
//     * 获取指定节点的相对位置。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     * @remark
//     * 此方法只对可见元素有效。
//     * 
//     * 获取匹配元素相对父元素的偏移。
//     * @example
//     * 获取第一段的偏移
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:<pre>
//     * var p = Dom.query("p").item(0);
//     * var offset = p.getOffset();
//     * trace( "left: " + offset.x + ", top: " + offset.y );
//     * </pre>
//     * #####结果:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
//     */
//    getOffset: function (/*Element*/elem) {

//        // 如果设置过 left top ，这是非常轻松的事。
//        var left = Dom.styleString(elem, 'left'),
//            top = Dom.styleString(elem, 'top');

//        // 如果未设置过。
//        if ((!left || !top || left === 'auto' || top === 'auto') && Dom.styleString(elem, "position") === 'absolute') {

//            // 绝对定位需要返回绝对位置。
//            top = Dom.offsetParent(elem);
//            left = Dom.getPosition(elem);
//            if (!/^(?:BODY|HTML|#document)$/i.test(top.nodeName)) {
//                var t = Dom.getPosition(top);
//                left.x -= t.x;
//                lefy.y -= t.y;
//            }
//            left.x -= Dom.styleNumber(elem, 'marginLeft') + Dom.styleNumber(top, 'borderLeftWidth');
//            left.y -= Dom.styleNumber(elem, 'marginTop') + Dom.styleNumber(top, 'borderTopWidth');

//            return left;
//        }

//        // 碰到 auto ， 空 变为 0 。
//        return {
//            x: parseFloat(left) || 0,
//            y: parseFloat(top) || 0
//        };

//    },

//    /**
//     * 设置指定节点相对父元素的偏移。
//     * @param {Element} elem 要设置的元素。
//     * @param {Point} value 要设置的 x, y 对象。
//     * @returns this
//     * @remark
//     * 此函数仅改变 CSS 中 left 和 top 的值。
//     * 如果当前对象的 position 是static，则此函数无效。
//     * 可以通过 {@link #setPosition} 强制修改 position, 或先调用 {@link Dom.movable} 来更改 position 。
//     *
//     * @example
//     * 设置第一段的偏移。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>
//     * Dom.query("p:first").setOffset({ x: 10, y: 30 });
//     * </pre>
//     * #####结果:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
//     */
//    setOffset: function (/*Element*/elem, value) {

//        //#assert(value, "Dom#setOffset(value): {value} 必须有 'x' 和 'y' 属性。", value);

//        elem = elem.style;

//        if (value.y != null) {
//            elem.top = value.y + 'px';
//        }

//        if (value.x != null) {
//            elem.left = value.x + 'px';
//        }

//    },

//    /**
//     * 获取用于让指定节点定位的父对象。
//     * @param {Element} elem 要设置的元素。
//     * @returns {Dom} 返回一个节点对象。如果不存在，则返回 null 。
//     */
//    offsetParent: function (/*Element*/elem) {
//        var p = elem;
//        while ((p = p.offsetParent) && !/^(?:BODY|HTML|#document)$/i.test(p.nodeName) && Dom.styleString(p, "position") === "static");
//        return p || Dom.getDocument(elem).body;
//    },

//    /**
//     * 获取指定节点的绝对位置。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     * @remark
//     * 此方法只对可见元素有效。
//     * @example
//     * 获取第二段的偏移
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>
//     * var p = Dom.query("p").item(1);
//     * var position = p.getPosition();
//     * trace( "left: " + position.x + ", top: " + position.y );
//     * </pre>
//     * #####结果:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 0, top: 35&lt;/p&gt;</pre>
//     */
//    getPosition: function (/*Element*/elem) {

//        // 对于 document，返回 scroll 。
//        if (elem.nodeType === 9) {
//            return Dom.getDocumentScroll(elem);
//        }

//        var bound = elem.getBoundingClientRect !== undefined ? elem.getBoundingClientRect() : { x: 0, y: 0 },
//            doc = Dom.getDocument(elem),
//            html = doc.documentElement,
//            htmlScroll = Dom.getDocumentScroll(doc);
//        return {
//            x: bound.left + htmlScroll.x - html.clientLeft,
//            y: bound.top + htmlScroll.y - html.clientTop
//        };
//    },

//    /**
//     * 设置指定节点的绝对位置。
//     * @param {Element} elem 要设置的元素。
//     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
//     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
//     * @returns this
//     * @remark
//     * 如果对象原先的position样式属性是static的话，会被改成relative来实现重定位。
//     * @example
//     * 设置第二段的位置。
//     * #####HTML:
//     * <pre lang="htm" format="none">
//     * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;
//     * </pre>
//     * #####JavaScript:
//     * <pre>
//     * Dom.query("p:last").setPosition({ x: 10, y: 30 });
//     * </pre>
//     */
//    setPosition: function (/*Element*/elem, value) {

//        // 确保对象可移动。
//        Dom.movable(elem);

//        var currentPosition = Dom.getPosition(elem),
//            offset = Dom.getOffset(elem);

//        offset.x = value.x == null ? null : offset.x + value.x - currentPosition.x;
//        offset.y = value.y == null ? null : offset.y + value.y - currentPosition.y;

//        Dom.setOffset(elem, offset);

//    },

//    /**
//     * 获取指定节点的滚动条的位置。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     * @remark
//     * 此方法对可见和隐藏元素均有效。
//     *
//     * @example
//     * 获取第一段相对滚动条顶部的偏移。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>
//     * var p = Dom.query("p").item(0);
//     * trace( "scrollTop:" + p.getScroll() );
//     * </pre>
//     * #####结果:
//     * <pre lang="htm" format="none">
//     * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;scrollTop: 0&lt;/p&gt;
//     * </pre>
//     */
//    getScroll: function (/*Element*/elem) {
//        return elem.nodeType === 9 ? Dom.getDocumentScroll(elem) : {
//            x: elem.scrollLeft,
//            y: elem.scrollTop
//        };
//    },

//    /**
//     * 设置指定节点的滚动条位置。
//     * @param {Element} elem 要设置的元素。
//     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
//     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
//     * @returns this
//     */
//    setScroll: function (/*Element*/elem, value) {
//        if (elem.nodeType === 9) {
//            (elem.defaultView || elem.parentWindow).scrollTo(
//                value.x != null ? value.x : Dom.getDocumentScroll(elem).x,
//                value.y != null ? value.y : Dom.getDocumentScroll(elem).y
//            );
//        } else {
//            if (value.x != null) {
//                elem.scrollLeft = value.x;
//            }
//            if (value.y != null) {
//                elem.scrollTop = value.y;
//            }
//        }
//    }

//    // #endregion

//};

//// #region 浏览器兼容性
//// #if CompactMode

//// #region 遍历

//if (!('firstElementChild' in document)) {

//    (function (createWalker) {
//        createWalker('first', 'nextSibling', 'firstChild');
//        createWalker('last', 'previousSibling', 'lastChild');
//        createWalker('next', 'nextSibling', 'nextSibling');
//        createWalker('prev', 'previousSibling', 'previousSibling');
//    })(function (funcName, first, next) {
//        Dom[funcName] = function (node) {
//            node = node[first];
//            while (node && node.nodeType !== 1) {
//                node = node[next];
//            }
//            return node;
//        };
//    });

//    Dom.children = function (elem) {
//        return Array.prototype.slice.call(elem, 0).filter(function (elem) {
//            return elem.nodeType === 1;
//        });
//    };

//}

//// #endregion

//// #region 事件




//// #endregion

////#region CSS 选择器

//if (!window.Element || !Element.prototype.querySelector || !+"\v") {

//    /**
//     * 使用指定的选择器代码对指定的结果集进行一次查找。
//     * @param {String} selector 选择器表达式。
//     * @param {DomList/Dom} result 上级结果集，将对此结果集进行查找。
//     * @returns {DomList} 返回新的结果集。
//     */
//    Dom.query = function (selector, context) {

//        function addElementsByTagName(elem, tagName, result) {
//            if (elem.getElementsByTagName) {
//                pushResult(elem.getElementsByTagName(tagName), result);
//            } else if (elem.querySelectorAll) {
//                pushResult(elem.querySelectorAll(tagName), result);
//            }
//        }

//        function pushResult(nodelist, result) {
//            for (var i = 0; nodelist[i]; i++) {
//                result[result.length++] = nodelist[i];
//            }
//        }

//        /**
//         * 抛出选择器语法错误。 
//         * @param {String} message 提示。
//         */
//        function throwError(message) {
//            throw new SyntaxError('An invalid or illegal string was specified : "' + message + '"!');
//        }

//        function filter(result, selector) {

//            var match, filterFn, value, code;

//            // ‘#id’ ‘.className’ ‘:filter’ ‘[attr’
//            while (match = /^([#\.:]|\[\s*)((?:[-\w]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {

//                selector = RegExp.rightContext;

//                if (result.length) {

//                    code = match[0];

//                    filterFn = (Dom._filterFn || (Dom._filterFn = {}))[code];

//                    // 如果不存在指定过滤器的特定函数，则先编译一个。
//                    if (!filterFn) {

//                        filterFn = 'for(var n=0,i=0,e,t;e=r[i];i++){t=';
//                        value = match[2].replace(rBackslash, "");

//                        switch (match[1]) {

//                            // ‘#id’
//                            case "#":
//                                filterFn += 'Dom.getAttr(e,"id")===v';
//                                break;

//                                // ‘.className’
//                            case ".":
//                                filterFn += 'Dom.hasClass(e,v)';
//                                break;

//                                // ‘:filter’
//                            case ":":

//                                filterFn += Dom._pseudos[value] || throwError(match[0]);

//                                // ‘selector:nth-child(2)’
//                                if (match = /^\(\s*("([^"]*)"|'([^']*)'|[^\(\)]*(\([^\(\)]*\))?)\s*\)/.exec(selector)) {
//                                    selector = RegExp.rightContext;
//                                    value = match[3] || match[2] || match[1];
//                                }

//                                break;

//                                // ‘[attr’
//                            default:
//                                value = [value.toLowerCase()];

//                                // ‘selector[attr]’ ‘selector[attr=value]’ ‘selector[attr='value']’  ‘selector[attr="value"]’    ‘selector[attr_=value]’
//                                if (match = /^\s*(?:(\S?=)\s*(?:(['"])(.*?)\2|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/.exec(selector)) {
//                                    selector = RegExp.rightContext;
//                                    if (match[1]) {
//                                        value[1] = match[1];
//                                        value[2] = match[3] || match[4];
//                                        value[2] = value[2] ? value[2].replace(/\\([0-9a-fA-F]{2,2})/g, function (x, y) {
//                                            return String.fromCharCode(parseInt(y, 16));
//                                        }).replace(rBackslash, "") : "";
//                                    }
//                                }

//                                filterFn += 'Dom.getAttr(e,v[0])' + (Selector.relative[value[1]] || throwError(code));

//                        }

//                        filterFn += ';if(t)r[n++]=e;}while(r.length>n)delete r[--r.length];';

//                        Dom._filterFn[code] = filterFn = new Function('r', 'v', filterFn);

//                        filterFn.value = value;

//                    }

//                    filterFn(result, filterFn.value);

//                }

//            }

//            return selector;

//        };

//        var result = [],
//            match,
//            value,
//            prevResult,
//            lastSelector,
//            elem,
//            i,
//            rBackslash = /\\/g;

//        selector = selector.trim();
//        context = context || document;

//        // 解析的第一步: 解析简单选择器

//        // ‘*’ ‘tagName’ ‘.className’ ‘#id’
//        if (match = /^(^|[#.])((?:[-\w]|[^\x00-\xa0]|\\.)+)$/.exec(selector)) {

//            value = match[2].replace(rBackslash, "");

//            switch (match[1]) {

//                // ‘#id’
//                case '#':

//                    // 仅对 document 使用 getElementById 。
//                    if (context.nodeType === 9) {
//                        prevResult = context.getElementById(value);
//                        if (prevResult && prevResult.getAttributeNode("id").nodeValue === value) {
//                            result[result.length++] = prevResult;
//                        }
//                        return result;
//                    }

//                    break;

//                    // ‘.className’
//                case '.':

//                    // 仅优化存在 getElementsByClassName 的情况。
//                    if (context.getElementsByClassName) {
//                        pushResult(context.getElementsByClassName(value), result);
//                        return result;
//                    }

//                    break;

//                    // ‘*’ ‘tagName’
//                default:
//                    addElementsByTagName(context, value, result);
//                    return result;

//            }

//        }

//        // 解析的第二步: 获取所有子节点。并不断进行筛选。

//        prevResult = [context];

//        // 解析分很多步进行，每次解析  selector 的一部分，直到解析完整个 selector 。
//        for (; ;) {

//            // 保存本次处理前的选择器。
//            // 用于在本次处理后检验 selector 是否有变化。
//            // 如果没变化，说明 selector 不能被正确处理，即 selector 包含非法字符。
//            lastSelector = selector;

//            // 解析的第三步: 获取所有子节点。第四步再一一筛选。
//            // 针对子选择器和标签选择器优化(不需要获取全部子节点)。

//            // ‘ selector’ ‘>selector’ ‘~selector’ ‘+selector’
//            if (match = /^\s*([>+~\s])\s*(\*|(?:[-\w*]|[^\x00-\xa0]|\\.)*)/.exec(selector)) {

//                selector = RegExp.rightContext;
//                value = match[2].replace(rBackslash, "").toUpperCase() || "*";

//                for (i = 0; elem = prevResult[i]; i++) {
//                    switch (match[1]) {
//                        case ' ':
//                            addElementsByTagName(elem, value, result);
//                            break;

//                        case '>':
//                            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
//                                if (elem.nodeType === 1 && (value === "*" || value === elem.tagName)) {
//                                    result[result.length++] = elem;
//                                }
//                            }
//                            break;

//                        case '+':
//                            while (elem = elem.nextSibling) {
//                                if (elem.nodeType === 1) {
//                                    if ((value === "*" || value === elem.tagName)) {
//                                        result[result.length++] = elem;
//                                    }
//                                    break;
//                                }
//                            }

//                            break;

//                        case '~':
//                            while (elem = elem.nextSibling) {
//                                if (elem.nodeType === 1 && (value === "*" || value === elem.tagName)) {
//                                    result[result.length++] = elem;
//                                }
//                            }
//                            break;

//                        default:
//                            throwError(match[0]);
//                    }
//                }


//            } else {

//                // ‘tagName’ ‘*’ 
//                if (match = /^((?:[-\w\*]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
//                    value = match[1].replace(rBackslash, "").toUpperCase();
//                    selector = RegExp.rightContext;
//                } else {
//                    value = "*";
//                }

//                for (i = 0; elem = prevResult[i]; i++) {
//                    addElementsByTagName(elem, value, result);
//                }

//            }

//            if (prevResult.length > 1) {
//                result.unique();
//            }

//            // 解析的第四步: 筛选第三步返回的结果。

//            // 如果没有剩余的选择器，说明节点已经处理结束。
//            if (selector) {

//                // 进行过滤筛选。
//                selector = filter(result, selector);

//            }

//            // 如果筛选后没有其它选择器。返回结果。
//            if (!selector) {
//                break;
//            }

//            // 解析的第五步: 解析, 如果存在，则继续。

//            // ‘,selectpr’ 
//            if (match = /^\s*,\s*/.exec(selector)) {
//                result.push.apply(result, Dom.query(RegExp.rightContext, context));
//                result.unique();
//                break;
//            }

//            // 存储当前的结果值，用于下次继续筛选。
//            prevResult = result;

//            // 清空之前的属性值。
//            result = [];

//            // 如果没有一个正则匹配选择器，则这是一个无法处理的选择器，向用户报告错误。
//            if (lastSelector.length === selector.length) {
//                throwError(selector);
//            }
//        }

//        return result;
//    };

//    Dom.find = function (selector, context) {
//        return Dom.query(selector, context)[0];
//    };

//    /**
//     * 用于查找所有支持的伪类的函数集合。
//     * @private
//     * @static
//     */
//    Dom._pseudos = {
//        target: 'window.location&&window.location.hash;t=t&&t.slice(1)===e.id',
//        contains: 'Dom.getText(e).indexOf(v)>=0',
//        hidden: 'Dom.isHidden(e)',
//        visible: '!Dom.isHidden(e)',

//        not: '!Dom.matches(e, v)',
//        has: '!Dom.find(v, e)',

//        selected: 'Dom.getAttr(e, "selected")',
//        checked: 'e.checked',
//        enabled: 'e.disabled===false',
//        disabled: 'e.disabled===true',

//        input: '^(input|select|textarea|button)$/i.test(e.nodeName)',

//        "nth-child": 'Dom.children(elem).indexOf(elem)+1;t=v==="odd"?t%2:v==="even"?t%2===0:t===v',
//        "first-child": '!Dom.prev(elem)',
//        "last-child": '!Dom.next(elem)',
//        "only-child": '!Dom.prev(elem)&&!Dom.next(elem)'

//    };

//    Dom._relative = {
//        'undefined': '!=null',
//        '=': '===v[2]',
//        '~=': ';t=(" "+t+" ").indexOf(" "+v[2]+" ")>=0',
//        '!=': '!==v[2]',
//        '|=': ';t=("-"+t+"-").indexOf("-"+v[2]+"-")>=0',
//        '^=': ';t=t&&t.indexOf(v[2])===0',
//        '$=': ';t=t&&t.indexOf(v[2].length-t.length)===v[2]',
//        '*=': ';t=t&&t.indexOf(v[2])>=0'
//    };

//}

////#endregion

//// #region 其它

//// IE6: 清空缓存。
//if (document.execCommand) {
//    try {
//        document.execCommand("BackgroundImageCache", false, true);
//    } catch (e) { }
//}

//// #endregion

//// #endif
//// #endregion

///**
// * 快速调用 Dom.get 或 Dom.find 或 Dom.parse 或 Dom.ready。
// * @param {Function/String/Node} selector 要执行的 CSS 选择器或 HTML 片段或 DOM Ready 函数。
// * @returns {Dom} 返回匹配的节点列表。
// */
//var $ = $ || function (selector) {
//    return selector instanceof Function ? Dom.ready(selector) :
//        selector && selector.constructor === String ?
//            /^</.test(selector) ? Dom.parse(selector) : Dom.find(selector) :
//            new Dom([selector]);
//};

///**
// * 提供操作 DOM 的高效方法。
// * @class
// */
//function Dom(nodeList) {
//    if (nodeList) {
//        this.addAll(nodeList);
//    }
//}

///**
// * 根据 *id* 获取节点。
// * @param {String/Node} id 要获取元素的 ID。
// * @returns {Dom} 返回匹配的节点。
// * @static
// * @example
// * 找到 id 为 a 的元素。
// * #####HTML:
// * <pre lang="htm" format="none">
// * &lt;p id="a"&gt;once&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
// * </pre>
// * #####JavaScript:
// * <pre>Dom.get("a");</pre>
// * #####结果:
// * <pre>&lt;p id="a"&gt;once&lt;/p&gt;</pre>
// */
//Dom.get = function (id) {
//    return new Dom([id && id.constructor === String ? document.getElementById(id) : id]);
//};

///**
// * 执行一个 CSS 选择器，返回所有匹配的节点列表。
// * @param {String} selector 要执行的 CSS 选择器。
// * @param {Document} context 执行的上下文文档。
// * @returns {Dom} 返回匹配的节点列表。
// * @example
// * 找到所有 p 元素。
// * #####HTML:
// * <pre lang="htm" format="none">
// * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
// * </pre>
// * 
// * #####Javascript:
// * <pre>
// * Dom.query("p");
// * </pre>
// * 
// * #####结果:
// * <pre lang="htm" format="none">
// * [  &lt;p&gt;one&lt;/p&gt; ,&lt;p&gt;two&lt;/p&gt;, &lt;p&gt;three&lt;/p&gt;  ]
// * </pre>
// * 
// * <br>
// * 找到所有 p 元素，并且这些元素都必须是 div 元素的子元素。
// * #####HTML:
// * <pre lang="htm" format="none">
// * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
// * 
// * #####Javascript:
// * <pre>
// * Dom.query("div &gt; p");
// * </pre>
// * 
// * #####结果:
// * <pre lang="htm" format="none">
// * [ &lt;p&gt;two&lt;/p&gt; ]
// * </pre>
// * 
// * <br>
// * 查找所有的单选按钮(即: type 值为 radio 的 input 元素)。
// * <pre>Dom.query("input[type=radio]");</pre>
// */
//Dom.find = function (selector) {
//    return new Dom(document.querySelectorAll(selector));
//};

///**
// * 解析一个 html 字符串，返回相应的 DOM 对象。
// * @param {String} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
// * @returns {Dom} 返回包含所有已解析的节点的 DOM 对象。
// * @static
// */
//Dom.parse = function (html, context) {
//    if (typeof html !== 'object') {
//        context = context && context !== document ? context.createElement('div') : (Dom._parseContainer || (Dom._parseContainer = document.createElement('div')));
//        context.innerHTML = html;
//        html = new Dom(context.childNodes);
//    }
//    return html;
//};

///**
// * 设置在 DOM 解析完成后的回调函数。
// * @param {Function} callback 当 DOM 解析完成后的回调函数。
// */
//Dom.ready = function (callback) {
//    if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
//        callback.call(document);
//    } else {
//        document.addEventListener('DOMContentLoaded', callback, false);
//    }
//};

//// #endregion

//// #region 内部工具函数

//// #endregion

//Dom.prototype = {

//    // #region 数组

//    constructor: Dom,
//    length: 0,
//    indexOf: Array.prototype.length,
//    sort: Array.prototype.sort,
//    splice: Array.prototype.splice, // 让 Firebug 和 Chrome 调试器显示为数组。

//    /**
//     * 连接已有的数组项。
//     * @param {NodeList} nodeList 要添加的节点列表。
//     */
//    addAll: function (nodeList) {
//        for (var i = 0, node; node = nodeList[i]; i++) {
//            this[this.length++] = node;
//        }
//        return this;
//    },

//    /**
//     * 遍历当前对象并对每个节点执行回调。
//     * @param {Function} callback 对每个元素运行的函数。函数的参数依次为:
//     *
//     * - {Object} value 当前元素的值。
//     * - {Number} index 当前元素的索引。
//     * - {Dom} array 当前正在遍历的数组。
//     *
//     * 可以让函数返回 **false** 来强制中止循环。
//     * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
//     * @returns {Boolean} 如果循环是因为 *fn* 返回 **false** 而中止，则返回 **false**， 否则返回 **true**。
//     */
//    each: function (callback, bind) {
//        for (var i = 0; i < this.length; i++) {
//            if (callback.call(bind, this[i], i, this) === false) {
//                return false;
//            }
//        }
//        return true;
//    },

//    // #endregion

//    // #region 节点选择

//    /**
//	 * 执行一个 CSS 选择器，返回匹配的节点。
//	 * @param {String} selector 要执行的 CSS 选择器。
//	 * @returns {Element} 返回匹配的节点。
//	 */
//    find: function (selector) {
//        var result = new Dom();
//        this.each(function (elem) {
//            result.addAll(elem.querySelectorAll(selector));
//        });
//        return result;
//    },

//    /**
//     * 判断指定节点是否符合指定的选择器。
//	 * @param {String} selector 要测试的 CSS 选择器。
//     * @returns {Boolean} 如果表达式匹配则返回 true，否则返回  false 。
//     * @example
//     * 由于input元素的父元素是一个表单元素，所以返回true。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;form&gt;&lt;input type="checkbox" /&gt;&lt;/form&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.matches(Dom.find('input'), "input")</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">true</pre>
//     */
//    is: function (selector) {

//        // 基于原生的判断。
//        var elem = this[0],
//            nativeMatchesSelector = elem.matchesSelector || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.oMatchesSelector;
//        if (nativeMatchesSelector) {
//            return nativeMatchesSelector.call(elem, selector);
//        }

//        // 原生不支持：使用内置的判断。
//        var parent = elem.parentNode, tempParent = !parent && this.document().body;
//        tempParent && tempParent.appendChild(elem);
//        try {
//            return Array.prototype.indexOf.call(Dom.get(parent).find(selector), elem) >= 0;
//        } finally {
//            tempParent && tempParent.removeChild(elem);
//        }

//    },

//    /**
//     * 判断指定节点是否包含目标节点。
//     * @param {Element} node 要判断的容器节点。
//     * @param {Element} child 要判断的子节点。
//     * @returns {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
//     * @static
//     */
//    contains: function (child) {
//        return this[0].contains(child instanceof Dom ? child[0] : child);
//    },

//    // #endregion

//    // #region 事件

//    /**
//     * 为指定元素添加一个事件监听器。
//     * @param {String} eventName 要添加的事件名。
//     * @param {Element} proxyChild? 要委托执行的子元素。
//     * @param {Function} eventHandler 要添加的事件监听器。
//     */
//    on: function (eventName, proxyChild, eventHandler) {

//    },

//    /**
//     * 删除指定元素的一个事件监听器。
//     * @param {String} eventName 要删除的事件名。
//     * @param {Element} proxyChild? 要委托执行的子元素。
//     * @param {Function} eventHandler 要删除的事件处理函数。
//     */
//    off: function (eventName, proxyChild, eventHandler) {

//    },

//    /**
//     * 触发一个事件，执行已添加的监听器。
//     * @param {String} eventName 要触发的事件名。
//     * @param {Object} eventArgs 传递给监听器的事件对象。
//     */
//    trigger: function (eventName, eventArgs) {

//    },

//    // #endregion

//    // #region 文档遍历

//    /**
//	 * 获取指定节点的文档。
//	 * @returns {Dom} 文档。
//	 */
//    document: function () {
//        return Dom.get(this[0].ownerDocument || this[0].document || this[0]);
//    },

//    /**
//     * 获取指定节点的父元素。
//     * @returns {Dom} 返回父节点。
//     * @example
//     * 找到每个span元素的所有祖先元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.parent(Dom.find("span"))</pre>
//     */
//    parent: function () {
//        return new Dom([this[0].parentNode]);
//    },

//    /**
//     * 获取指定节点及父节点对象中第一个满足指定 CSS 选择器或函数的节点。
//     * @param {String} selector 用于判断的元素的 CSS 选择器。
//     * @param {Node} [context=document] 只在指定的节点内搜索此元素。
//     * @returns {Node} 如果要获取的节点满足要求，则返回要获取的节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
//     */
//    closest: function (selector, context) {
//        while (node) {

//            // 如果 node 到达了指定上下文，则停止查找。
//            if (context && node === context) {
//                break;
//            }

//            if (Dom.matches(node, selector)) {
//                break;
//            }

//            node = node.parentNode;
//        }
//        return node;
//    },

//    /**
//     * 获取指定节点的下一个相邻节点对象。
//     * @param {Node} node 要获取的节点。
//     * @returns {Element} 返回一个元素。如果不存在，则返回 null 。
//     * @example
//     * 找到每个段落的后面紧邻的同辈元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.next(Dom.find("p"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p&gt;Hello Again&lt;/p&gt;, &lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt; ]</pre>
//     */
//    next: function () {
//        return node.nextElementSibling;
//    },

//    /**
//     * 获取指定节点的上一个相邻的节点对象。
//     * @param {Node} node 要获取的节点。
//     * @returns {Element} 返回一个元素。如果不存在，则返回 null 。
//     * @example
//     * 找到每个段落紧邻的前一个同辈元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("p").getPrevious()</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt; ]</pre>
//     *
//     * 找到每个段落紧邻的前一个同辈元素中类名为selected的元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/div&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.prev(Dom.find("p"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
//     */
//    prev: function (node) {
//        return node.previousElementSibling;
//    },

//    /**
//     * 获取指定节点的第一个子元素。
//     * @param {Node} node 要获取的节点。
//     * @returns {Element} 返回一个元素。如果不存在，则返回 null 。
//     * @example
//     * 获取匹配的第二个元素
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.first(Dom.find("p"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
//     */
//    first: function () {
//        return Dom.get(this[0].firstElementChild);
//    },

//    /**
//     * 获取指定节点的最后一个子节点对象。
//     * @param {Node} node 要获取的节点。
//     * @returns {Element} 返回一个元素。如果不存在，则返回 null 。
//     * @example
//     * 获取匹配的第二个元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.last(Dom.find("p"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
//     */
//    last: function (/*Node*/node) {
//        return Dom.get(this[0].lastElementChild);
//    },

//    /**
//     * 获取指定节点的全部直接子元素。
//     * @param {Node} node 要获取的节点。
//     * @returns {NodeList} 返回所有元素列表。
//     * @example
//     *
//     * 查找DIV中的每个子元素。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("div").getChildren()</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;span&gt;Hello Again&lt;/span&gt; ]</pre>
//     *
//     * 在每个div中查找 div。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;&lt;/div&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.children(Dom.find("div"))</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
//     */
//    children: function (node) {
//        return node.children;
//    },

//    // #endregion

//    // #region 增删操作

//    /**
//     * 插入一段 HTML 到末尾。
//	 * @param {Node} node 要获取的节点。
//     * @param {String} html 要插入的内容。
//     * @returns {Node} 返回插入的新节点对象。
//     */
//    append: function (node, html) {
//        var c = Dom.parse(html, Dom.getDocument(node)).parentNode;
//        while (c.firstChild) {
//            node.appendChild(c.firstChild);
//        }
//        return node.lastChild;
//    },

//    /**
//     * 插入一段 HTML 到顶部。
//	 * @param {Node} node 要获取的节点。
//     * @param {String} html 要插入的内容。
//     * @returns {Node} 返回插入的新节点对象。
//     */
//    prepend: function (node, html) {
//        var c = Dom.parse(html, Dom.getDocument(node)).parentNode, p = node.firstChild;
//        while (c.firstChild) {
//            node.insertBefore(c.firstChild, p);
//        }
//        return node.firstChild;
//    },

//    /**
//     * 插入一个HTML 到后面。
//	 * @param {Node} node 要获取的节点。
//     * @param {String} html 要插入的内容。
//     * @returns {Node} 返回插入的新节点对象。
//     */
//    after: function (node, html) {
//        return node.nextSibling ? Dom.before(node.nextSibling, html) : Dom.append(node.parentNode, html);
//    },

//    /**
//     * 插入一个HTML 到前面。
//	 * @param {Node} node 要获取的节点。
//     * @param {String} html 要插入的内容。
//     * @returns {Node} 返回插入的新节点对象。
//     */
//    before: function (node, html) {
//        var c = Dom.parse(html, Dom.getDocument(node)).parentNode, p = node.parentNode;
//        while (c.firstChild) {
//            p.insertBefore(c.firstChild, node);
//        }
//        return node.previousSibling;
//    },

//    /**
//     * 如果指定节点未添加到指定父节点或 DOM 树，则进行添加。
//	 * @param {Node} node 要获取的节点。
//	 * @param {Node} parentNode 渲染的父节点。
//	 * @param {Node} refNode 插入的引用节点。
//     */
//    render: function (parentNode, refNode) {
//        if (parentNode) {
//            parentNode.insertBefore(node, refNode || null);
//        } else if (!Dom.contains(Dom.getDocument(node), node)) {
//            Dom.getDocument(node).body.appendChild(node);
//        }
//    },

//    /**
//     * 移除指定节点或其子对象。
//	 * @param {Node} node 要获取的节点。
//     * @remark
//     * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
//     * @example
//     * 从DOM中把所有段落删除。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("p").remove();</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">how are</pre>
//     *
//     * 从DOM中把带有hello类的段落删除
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("p").remove(".hello");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">how are &lt;p&gt;you?&lt;/p&gt;</pre>
//     */
//    remove: function (/*Node*/node) {
//        node.parentNode && node.parentNode.removeChild(node);
//    },

//    /**
//     * 创建并返回指定节点的副本。
//	 * @param {Node} node 要获取的节点。
//     * @param {Boolean} deep=true 是否复制子元素。
//     * @param {Boolean} cloneDataAndEvent=false 是否复制数据和事件。
//     * @param {Boolean} keepId=false 是否复制 id 。
//     * @returns {Node} 新节点对象。
//     *
//     * @example
//     * 克隆所有b元素（并选中这些克隆的副本），然后将它们前置到所有段落中。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;, how are you?&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.query("b").clone().prependTo("p");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;&lt;b&gt;Hello&lt;/b&gt;, how are you?&lt;/p&gt;</pre>
//     */
//    clone: function (/*Node*/node, deep) {
//        return node.cloneNode(deep !== false);
//    },

//    // #endregion

//    // #region 属性和样式

//    /**
//     * 检查是否含指定类名。
//     * @param {Element} elem 要测试的元素。
//     * @param {String} className 类名。
//     * @returns {Boolean} 如果存在返回 true。
//     * @static
//     */
//    hasClass: function (/*Element*/elem, className) {
//        // #assert className && (!className.indexOf || !/[\s\r\n]/.test(className)), 'className 不能为空，且不允许有空格和换行；如果需要判断 2 个 class 同时存在，可以调用两次本函数： if(hasClass('A') && hasClass('B')) ...")'

//        // #if CompactMode

//        if (!elem.classList) {
//            return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
//        }

//        // #endif

//        return elem.classList.contains(className);
//    },

//    /**
//     * 从指定节点中删除全部或者指定的类。
//     * @param {String} [className] 一个或多个要删除的CSS类名，用空格分开。如果不提供此参数，将清空 className 。
//     * @returns this
//     * @example
//     * 从匹配的元素中删除 'selected' 类
//     * #####HTML:
//     * <pre lang="htm" format="none">
//     * &lt;p class="selected first"&gt;Hello&lt;/p&gt;
//     * </pre>
//     * #####JavaScript:
//     * <pre>Dom.removeClass(Dom.find("p"), "selected");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">
//     * [ &lt;p class="first"&gt;Hello&lt;/p&gt; ]
//     * </pre>
//     */
//    removeClass: function (/*Element*/elem, className) {

//        // #if CompactMode

//        if (!elem.classList) {
//            elem.className = className ? (" " + elem.className + " ").replace(" " + classList[i] + " ", " ").trim() : '';
//            return;
//        }

//        // #endif

//        className ? elem.classList.remove(className) : (elem.className = '');
//    },

//    /**
//     * 如果存在（不存在）就删除（添加）一个类。
//     * @param {String} className CSS类名。
//     * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
//     * @returns this
//     * @see #addClass
//     * @see #removeClass
//     * @example
//     * 为匹配的元素切换 'selected' 类
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.toggleClass(Dom.find("p"), "selected");</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt;, &lt;p&gt;Hello Again&lt;/p&gt; ]</pre>
//     */
//    toggleClass: function (elem, className, value) {

//        // #if CompactMode

//        if (!elem.classList) {
//            ((value == undefined ? Dom.hasClass(elem, className) : !value) ? Dom.removeClass : Dom.addClass)(elem, className);
//            return;
//        }

//        // #endif

//        elem.classList.toggle(className, value);
//    },

//    ///**
//    // * 修复部分属性的获取和设置方式。
//    // */
//    //_fixAttr: function (name) {
//    //    var attrHooks = Dom._attrHooks;
//    //    if (!attrHooks) {

//    //        Dom._attrHooks = attrHooks = {

//    //            // 默认用于获取和设置属性的钩子。
//    //            _: function (elem, name, getting, value) {
//    //                if (getting) {
//    //                    return !(name in elem) && elem.getAttribute ? elem[name] : elem.getAttribute(name);
//    //                }

//    //                if (name in elem || !elem.setAttribute) {
//    //                    elem[name] = value;
//    //                } else if (value === null) {
//    //                    elem.removeAttribute(name);
//    //                } else {
//    //                    elem.setAttribute(name, value);
//    //                }

//    //            },

//    //            style: function (elem, name, getting, value) {
//    //                elem = elem[name];
//    //                if (getting) {
//    //                    return elem.cssText;
//    //                }
//    //                elem.cssText = value;
//    //            },

//    //            //// NOTE: 不同浏览器获取不支持 tabIndex 的节点的 tabIndex 属性时返回值不同。
//    //            //// 由于 tabIndex 使用频率低，因此框架不提供兼容支持，参考：
//    //            //// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
//    //            //tabIndex: function (elem, name, getting, value) {
//    //            //    if (getting) {
//    //            //        var value = elem.getAttributeNode(name);
//    //            //        value = value && value.specified && value.value || null;
//    //            //        return type ? value : +value;
//    //            //    }
//    //            //    elem[name] = value;
//    //            //},

//    //            selected: function (elem, name, getting, value) {

//    //                // Webkit、IE 误报 selected 属性。
//    //                // 通过调用 parentNode 属性修复。
//    //                var parent = elem.parentNode;

//    //                // 激活 select, 更新 option 的 select 状态。
//    //                if (parent) {
//    //                    parent.selectedIndex;

//    //                    // 同理，处理 optgroup 
//    //                    if (parent.parentNode) {
//    //                        parent.parentNode.selectedIndex;
//    //                    }
//    //                }

//    //                return attrHooks._(elem, name, getting, value);

//    //            }

//    //        };

//    //        // #if CompactMode

//    //        if (!+"\v") {
//    //            attrHooks._default = attrHooks._;
//    //            attrHooks._ = function (elem, name, getting, value) {

//    //                // 不是节点则获取属性。
//    //                if (!elem.getAttributeNode) {
//    //                    return attrHooks._default(elem, name, getting, value);
//    //                }

//    //                var node = elem.getAttributeNode(name);
//    //                if (getting) {
//    //                    return name ? name.value || (name.specified ? "" : null) : null;
//    //                }

//    //                // 如果 value === null 表示删除节点。
//    //                if (value === null) {
//    //                    if (node) {
//    //                        node.nodeValue = '';
//    //                        elem.removeAttributeNode(node);
//    //                    }
//    //                } else if (node) {
//    //                    node.nodeValue = value;
//    //                } else {
//    //                    elem.setAttribute(name, value);
//    //                }

//    //            };
//    //        }

//    //        // #endif

//    //        Dom._attrFix = {
//    //            'for': 'htmlFor',
//    //            'class': 'className',
//    //            'tabindex': 'tabIndex',
//    //            'readonly': 'readOnly',
//    //            'maxlength': 'maxLength',
//    //            'cellspacing': 'cellSpacing',
//    //            'cellpadding': 'cellPadding',
//    //            'rowspan': 'rowSpan',
//    //            'colspan': 'colSpan',
//    //            'usemap': 'useMap',
//    //            'frameborder': 'frameBorder',
//    //            'contenteditable': 'contentEditable'
//    //        };

//    //    }

//    //    // NOTE: <form> 元素会获取内部存在指定 ID 的节点。

//    //    return attrHooks[Dom._attrFix[name] || name] || attrHooks._default;
//    //},

//    /**
//     * 获取或设置元素的属性值。
//     * @param {Element} elem 要获取的元素。
//     * @param {String} name 要获取的属性名称。
//     * @returns {String} 返回属性值。如果元素没有相应属性，则返回 null 。
//     * @static
//     */
//    attr: function (/*Element*/elem, name) {
//        return Dom._fixAttr(name)(elem, name, true);
//    },

//    ///**
//    // * 设置或删除一个 HTML 属性值。
//    // * @param {String} name 要设置的属性名称。
//    // * @param {String} value 要设置的属性值。当设置为 null 时，删除此属性。
//    // * @returns this
//    // * @example
//    // * 为图像设置 src 属性。
//    // * #####HTML:
//    // * <pre lang="htm" format="none">
//    // * &lt;img/&gt;
//    // * </pre>
//    // * #####JavaScript:
//    // * <pre>Dom.setAttr(Dom.find("img"), "src","test.jpg");</pre>
//    // * #####结果:
//    // * <pre lang="htm" format="none">[ &lt;img src= "test.jpg" /&gt; , &lt;img src= "test.jpg" /&gt; ]</pre>
//    // *
//    // * 将文档中图像的src属性删除
//    // * #####HTML:
//    // * <pre lang="htm" format="none">&lt;img src="test.jpg"/&gt;</pre>
//    // * #####JavaScript:
//    // * <pre>Dom.setAttr(Dom.find("img"), "src");</pre>
//    // * #####结果:
//    // * <pre lang="htm" format="none">[ &lt;img /&gt; ]</pre>
//    // */
//    //setAttr: function (elem, name, value) {
//    //    return Dom._fixAttr(name)(elem, name, false, value);
//    //},

//    //_fixText: function (node) {
//    //    return (Dom._textFix || (Dom._textFix = {
//    //        'INPUT': 'value',
//    //        'SELECT': 'value',
//    //        'TEXTAREA': 'value',
//    //        '#text': 'nodeValue',
//    //        '#comment': 'nodeValue'
//    //    }))[node.nodeName] || ('textContent' in document ? 'textContent' : 'innerText');
//    //},

//    /**
//     * 获取或设置元素对应的文本。
//     * @param {Element} node 元素。
//     * @returns {String} 值。对普通节点返回 text 属性。
//     * @static
//     */
//    text: function (/*Element*/node) {
//        return node[Dom._fixText(node)] || '';
//    },

//    ///**
//    // * 设置指定节点的文本内容。对于输入框则设置其输入的值。
//    // * @param {String} 用于设置元素内容的文本。
//    // * @returns this
//    // * @see #setHtml
//    // * @remark 与 {@link #setHtml} 类似, 但将编码 HTML (将 "&lt;" 和 "&gt;" 替换成相应的HTML实体)。
//    // * @example
//    // * 设定文本框的值。
//    // * #####HTML:
//    // * <pre lang="htm" format="none">&lt;input type="text"/&gt;</pre>
//    // * #####JavaScript:
//    // * <pre>Dom.setText(Dom.find("input"),"hello world!");</pre>
//    // */
//    //setText: function (/*Element*/node, value) {
//    //    node[Dom._fixText(node)] = value;
//    //},

//    /**
//     * 获取或设置指定节点的 HTML。
//     * @returns {String} HTML 字符串。
//     * @example
//     * 获取 id="a" 的节点的内部 html。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.getHtml(document.body);</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">"&lt;p/&gt;"</pre>
//     */
//    html: function (/*Element*/elem) {
//        return elem.innerHTML;
//    },

//    ///**
//    // * 设置指定节点的 Html。
//    // * @param {String} value 要设置的 Html。
//    // * @example
//    // * 设置一个节点的内部 html
//    // * #####HTML:
//    // * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
//    // * #####JavaScript:
//    // * <pre>Dom.setHtml(Dom.get("a"), "&lt;a/&gt;");</pre>
//    // * #####结果:
//    // * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;a/&gt;&lt;/div&gt;</pre>
//    // */
//    //setHtml: function (/*Element*/elem, value) {

//    //    // #if CompactMode

//    //    // IE6-8: 需要处理特殊标签。
//    //    if (!+"\v") {
//    //        Dom.empty(elem);
//    //        Dom.append(elem, value);
//    //        return;
//    //    }

//    //    // #endif

//    //    elem.innerHTML = value;
//    //},

//    ///**
//    // * 删除指定节点的所有子节点。
//    // * @returns this
//    // * @example
//    // * 把所有段落的子元素（包括文本节点）删除。
//    // * #####HTML:
//    // * <pre lang="htm" format="none">&lt;p&gt;Hello, &lt;span&gt;Person&lt;/span&gt; &lt;a href="#"&gt;and person&lt;/a&gt;&lt;/p&gt;</pre>
//    // * #####JavaScript:
//    // * <pre>Dom.query("p").empty();</pre>
//    // * #####结果:
//    // * <pre lang="htm" format="none">&lt;p&gt;&lt;/p&gt;</pre>
//    // */
//    //empty: function (elem) {
//    //    elem.innerHTML = '';
//    //},

//    /**
//     * 读取指定节点的当前样式，返回字符串。
//     * @param {Element} elem 要获取的元素。
//     * @param {String} camelizedCssPropertyName 已转为骆驼格式的 CSS 属性名。
//     * @returns {String} 字符串。
//     */
//    styleString: function (/*Element*/elem, camelizedCssPropertyName) {

//        // #if CompactMode

//        if (!window.getComputedStyle) {
//            if (camelizedCssPropertyName === 'width') {
//                return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
//            }
//            if (camelizedCssPropertyName === 'height') {
//                return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
//            }
//            if (camelizedCssPropertyName === 'opacity') {
//                return /opacity=([^)]*)/.test(Dom.styleString(elem, 'filter')) ? parseInt(RegExp.$1) / 100 + '' : '1';
//            }

//            // currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
//            // currentStyle是运行时期样式与style属性覆盖之后的样式
//            var r = elem.currentStyle[name];

//            // 来自 jQuery
//            // 如果返回值不是一个带px的 数字。 转换为像素单位
//            if (/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {

//                // 保存初始值
//                var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;

//                // 放入值来计算
//                elem.runtimeStyle.left = elem.currentStyle.left;
//                style.left = name === "fontSize" ? "1em" : (r || 0);
//                r = style.pixelLeft + "px";

//                // 回到初始值
//                style.left = left;
//                elem.runtimeStyle.left = rsLeft;

//            }

//            return r;
//        }

//        // #endif

//        return elem.style[camelizedCssPropertyName] || elem.ownerDocument.defaultView.getComputedStyle(elem, '')[camelizedCssPropertyName];
//    },

//    /**
//     * 读取指定节点的当前样式，返回数值。
//     * @param {Element} elem 要获取的元素。
//     * @param {String} camelizedCssPropertyName 已转为骆驼格式的 CSS 属性名。
//     * @returns {Number} 数值。
//     */
//    styleNumber: function (/*Element*/elem, camelizedCssPropertyName) {

//        // #if CompactMode

//        if (!window.getComputedStyle) {
//            return parseFloat(Dom.styleString(elem, camelizedCssPropertyName));
//        }

//        // #endif

//        var value = elem.style[camelizedCssPropertyName];
//        return value && (value = parseFloat(value)) != null ? value : (parseFloat(elem.ownerDocument.defaultView.getComputedStyle(elem, '')[camelizedCssPropertyName]) || 0);
//    },

//    /**
//     * 到骆驼模式。
//     * @param {String} name 匹配的内容。
//     * @returns {String} 返回的内容。
//     */
//    camelCase: function (name) {
//        return name === 'float' ? +"\v" ? 'cssFloat' : 'styleFloat' : name.replace(/-+(\w?)/g, function (match, chr) { return chr.toUpperCase() });
//    },

//    /**
//     * 获取或设置指定节点的样式。
//     * @param {Element} elem 要获取的元素。
//     * @param {String} cssPropertyName CSS 属性名。
//     * @returns {String} 字符串。
//     */
//    css: function (/*Element*/elem, /*String*/cssPropertyName) {
//        return Dom.styleString(elem, Dom.camelCase(cssPropertyName));
//    },

//    ///**
//    // * 设置指定节点的样式。
//    // * @param {Element} elem 要设置的元素。
//    // * @param {String} cssPropertyName CSS 属性名或 CSS 字符串。
//    // * @param {String/Number} value CSS属性值，数字如果不加单位，则会自动添加像素单位。
//    // * @example
//    // * 将所有段落的字体颜色设为红色并且背景为蓝色。
//    // * <pre>Dom.query("p").setStyle('color', "#ff0011");</pre>
//    // */
//    //setStyle: function (/*Element*/elem, /*String*/cssPropertyName, value) {

//    //    // 将属性名转为骆驼形式。
//    //    cssPropertyName = Dom.camelCase(cssPropertyName);

//    //    if (!window.getComputedStyle && value === 'opacity') {

//    //    }

//    //    // 为数字自动添加 px 单位。
//    //    if (value != null && value.constructor === Number) {
//    //        var styleNumbers = Dom.styleNumbers;
//    //        if (!styleNumbers) {
//    //            Dom.styleNumbers = styleNumbers = {};
//    //            'fillOpacity fontWeight lineHeight opacity orphans widows zIndex columnCount zoom'.replace(/\b\w+\b/g, function (value) {
//    //                styleNumbers[value] = 1;
//    //            });
//    //        }
//    //        if (!(cssPropertyName in styleNumbers)) {
//    //            value += 'px';
//    //        }
//    //    }

//    //    elem.style[cssPropertyName] = value;

//    //},

//    /**
//	 * 根据不同的内容进行计算。
//	 * @param {Element} elem 要计算的元素。
//	 * @param {String} expression 要计算的表达式。其中使用变量代表 CSS 属性值，如 "width+paddingLeft"。
//	 * @returns {Number} 返回计算的值。
//	 * @static
//	 */
//    calc: function (/*Element*/elem, expression) {

//        // #if CompactMode

//        if (!window.getComputedStyle) {
//            return eval(expression.replace(/(\w+)/g, 'Dom.styleNumber(elem, "$1")'));
//        }

//        // #endif

//        var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
//        return eval(expression.replace(/(\w+)/g, '(parseFloat(computedStyle.$1)||0)'));
//    },

//    // #endregion

//    // #region 效果

//    /**
//     * 通过设置 display 属性来显示元素。
//     * @param {Element} elem 要处理的元素。
//     * @static
//     */
//    show: function (/*Element*/elem) {

//        // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
//        elem.style.display = '';

//        // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
//        if (Dom.isHidden(elem)) {
//            var defaultDisplay = elem.style.defaultDisplay;
//            if (!defaultDisplay) {
//                var defaultDisplayCache = Dom.defaultDisplayCache || (Dom.defaultDisplayCache = {});
//                defaultDisplay = defaultDisplayCache[elem.nodeName];
//                if (!defaultDisplay) {
//                    var elem = document.createElement(nodeName);
//                    document.body.appendChild(elem);
//                    defaultDisplay = Dom.styleString(elem);
//                    if (defaultDisplay === 'none') {
//                        defaultDisplay = 'block';
//                    }
//                    defaultDisplayCache[nodeName] = defaultDisplay;
//                    document.body.removeChild(elem);
//                }
//            }
//            elem.style.display = defaultDisplay;
//        }

//    },

//    /**
//     * 通过设置 display 属性来隐藏元素。
//     * @param {Element} elem 要处理的元素。
//     * @static
//     */
//    hide: function (/*Element*/elem) {
//        var currentDisplay = Dom.styleString(elem, 'display');
//        if (currentDisplay !== 'none') {
//            elem.style.defaultDisplay = currentDisplay;
//            elem.style.display = 'none';
//        }
//    },

//    /**
//     * 通过设置 display 属性切换显示或隐藏元素。
//     * @param {Element} elem 要处理的元素。
//     * @param {Boolean?} value 要设置的元素。
//     * @static
//     */
//    toggle: function (/*Element*/elem, value) {
//        (value == null ? Dom.isHidden(elem) : value) ? Dom.show(elem) : Dom.hide(elem);
//    },

//    /**
//     * 判断当前元素是否是隐藏的。
//     * @param {Element} elem 要判断的元素。
//     * @returns {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
//     */
//    isHidden: function (/*Element*/elem) {
//        return Dom.styleString(elem, 'display') === 'none';
//    },

//    animate: function (from, to, callback) {

//    },

//    // #endregion

//    // #region 尺寸和定位

//    /**
//     * 获取或设置指定节点的可视区域大小。包括 border 大小。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 大小。
//     * @remark
//     * 此方法对可见和隐藏元素均有效。
//     * 获取元素实际占用大小（包括内边距和边框）。
//     * @example
//     * 获取第一段落实际大小。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>Dom.getSize(Dom.find("p:first"));</pre>
//     * #####结果:
//     * <pre lang="htm" format="none">{x=200,y=100}</pre>
//     */
//    size: function (/*Element*/elem) {
//        return elem.nodeType === 9 ? {
//            x: elem.documentElement.clientWidth,
//            y: elem.documentElement.clientHeight,
//        } : {
//            x: elem.offsetWidth,
//            y: elem.offsetHeight
//        };
//    },

//    ///**
//    // * 设置指定节点的可视区域大小。
//    // * @param {Element} elem 要设置的元素。
//    // * @param {Number/Point} x 要设置的宽或一个包含 x、y 属性的对象。如果不设置，使用 null 。
//    // * @param {Number} y 要设置的高。如果不设置，使用 null 。
//    // * @returns this
//    // * @remark
//    // * 设置元素实际占用大小（包括内边距和边框，但不包括滚动区域之外的大小）。
//    // * 此方法对可见和隐藏元素均有效。
//    // * @example
//    // * 设置 id=myP 的段落的大小。
//    // * #####HTML:
//    // * <pre lang="htm" format="none">&lt;p id="myP"&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//    // * #####JavaScript:
//    // * <pre>Dom.setSize(Dom.get("myP"), {x:200,y:100});</pre>
//    // */
//    //setSize: function (/*Element*/elem, value) {
//    //    if (value.x != null) {
//    //        elem.style.width = value.x - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
//    //    }
//    //    if (value.y != null) {
//    //        elem.style.height = value.y - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
//    //    }
//    //},

//    /**
//     * 获取指定节点的滚动区域大小。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     * @remark
//     * getScrollSize 获取的值总是大于或的关于 getSize 的值。
//     * 此方法对可见和隐藏元素均有效。
//     */
//    scrollSize: function (/*Element*/elem) {
//        return elem.nodeType === 9 ? {
//            x: Math.max(elem.documentElement.scrollWidth, elem.body.scrollWidth, elem.clientWidth),
//            y: Math.max(elem.documentElement.scrollHeight, elem.body.scrollHeight, elem.clientHeight)
//        } : {
//            x: elem.scrollWidth,
//            y: elem.scrollHeight
//        };
//    },

//    /**
//     * 获取文档的滚动位置。
//	 * @param {Document} doc 要计算的文档。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     */
//    getDocumentScroll: function (/*Document*/doc) {
//        var win;
//        return 'pageXOffset' in (win = doc.defaultView || doc.parentWindow) ? {
//            x: win.pageXOffset,
//            y: win.pageYOffset
//        } : {
//            x: doc.documentElement.scrollLeft,
//            y: doc.documentElement.scrollTop
//        };
//    },

//    /**
//     * 获取或设置指定节点的相对位置。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     * @remark
//     * 此方法只对可见元素有效。
//     * 
//     * 获取匹配元素相对父元素的偏移。
//     * @example
//     * 获取第一段的偏移
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:<pre>
//     * var p = Dom.query("p").item(0);
//     * var offset = p.getOffset();
//     * trace( "left: " + offset.x + ", top: " + offset.y );
//     * </pre>
//     * #####结果:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
//     */
//    offset: function (/*Element*/elem) {

//        // 如果设置过 left top ，这是非常轻松的事。
//        var left = Dom.styleString(elem, 'left'),
//            top = Dom.styleString(elem, 'top');

//        // 如果未设置过。
//        if ((!left || !top || left === 'auto' || top === 'auto') && Dom.styleString(elem, "position") === 'absolute') {

//            // 绝对定位需要返回绝对位置。
//            top = Dom.offsetParent(elem);
//            left = Dom.getPosition(elem);
//            if (!/^(?:BODY|HTML|#document)$/i.test(top.nodeName)) {
//                var t = Dom.getPosition(top);
//                left.x -= t.x;
//                lefy.y -= t.y;
//            }
//            left.x -= Dom.styleNumber(elem, 'marginLeft') + Dom.styleNumber(top, 'borderLeftWidth');
//            left.y -= Dom.styleNumber(elem, 'marginTop') + Dom.styleNumber(top, 'borderTopWidth');

//            return left;
//        }

//        // 碰到 auto ， 空 变为 0 。
//        return {
//            x: parseFloat(left) || 0,
//            y: parseFloat(top) || 0
//        };

//    },

//    ///**
//    // * 设置指定节点相对父元素的偏移。
//    // * @param {Element} elem 要设置的元素。
//    // * @param {Point} value 要设置的 x, y 对象。
//    // * @returns this
//    // * @remark
//    // * 此函数仅改变 CSS 中 left 和 top 的值。
//    // * 如果当前对象的 position 是static，则此函数无效。
//    // * 可以通过 {@link #setPosition} 强制修改 position, 或先调用 {@link Dom.movable} 来更改 position 。
//    // *
//    // * @example
//    // * 设置第一段的偏移。
//    // * #####HTML:
//    // * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//    // * #####JavaScript:
//    // * <pre>
//    // * Dom.query("p:first").setOffset({ x: 10, y: 30 });
//    // * </pre>
//    // * #####结果:
//    // * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
//    // */
//    //setOffset: function (/*Element*/elem, value) {

//    //    //#assert(value, "Dom#setOffset(value): {value} 必须有 'x' 和 'y' 属性。", value);

//    //    elem = elem.style;

//    //    if (value.y != null) {
//    //        elem.top = value.y + 'px';
//    //    }

//    //    if (value.x != null) {
//    //        elem.left = value.x + 'px';
//    //    }

//    //},

//    ///**
//    // * 获取用于让指定节点定位的父对象。
//    // * @param {Element} elem 要设置的元素。
//    // * @returns {Dom} 返回一个节点对象。如果不存在，则返回 null 。
//    // */
//    //offsetParent: function (/*Element*/elem) {
//    //    var p = elem;
//    //    while ((p = p.offsetParent) && !/^(?:BODY|HTML|#document)$/i.test(p.nodeName) && Dom.styleString(p, "position") === "static");
//    //    return p || Dom.getDocument(elem).body;
//    //},

//    /**
//     * 获取或设置指定节点的绝对位置。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     * @remark
//     * 此方法只对可见元素有效。
//     * @example
//     * 获取第二段的偏移
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>
//     * var p = Dom.query("p").item(1);
//     * var position = p.getPosition();
//     * trace( "left: " + position.x + ", top: " + position.y );
//     * </pre>
//     * #####结果:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 0, top: 35&lt;/p&gt;</pre>
//     */
//    position: function (/*Element*/elem) {

//        // 对于 document，返回 scroll 。
//        if (elem.nodeType === 9) {
//            return Dom.getDocumentScroll(elem);
//        }

//        var bound = elem.getBoundingClientRect !== undefined ? elem.getBoundingClientRect() : { x: 0, y: 0 },
//            doc = Dom.getDocument(elem),
//            html = doc.documentElement,
//            htmlScroll = Dom.getDocumentScroll(doc);
//        return {
//            x: bound.left + htmlScroll.x - html.clientLeft,
//            y: bound.top + htmlScroll.y - html.clientTop
//        };
//    },

//    ///**
//    // * 设置指定节点的绝对位置。
//    // * @param {Element} elem 要设置的元素。
//    // * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
//    // * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
//    // * @returns this
//    // * @remark
//    // * 如果对象原先的position样式属性是static的话，会被改成relative来实现重定位。
//    // * @example
//    // * 设置第二段的位置。
//    // * #####HTML:
//    // * <pre lang="htm" format="none">
//    // * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;
//    // * </pre>
//    // * #####JavaScript:
//    // * <pre>
//    // * Dom.query("p:last").setPosition({ x: 10, y: 30 });
//    // * </pre>
//    // */
//    //setPosition: function (/*Element*/elem, value) {

//    //    // 确保对象可移动。
//    //    Dom.movable(elem);

//    //    var currentPosition = Dom.getPosition(elem),
//    //        offset = Dom.getOffset(elem);

//    //    offset.x = value.x == null ? null : offset.x + value.x - currentPosition.x;
//    //    offset.y = value.y == null ? null : offset.y + value.y - currentPosition.y;

//    //    Dom.setOffset(elem, offset);

//    //},

//    /**
//     * 获取或设置指定节点的滚动条的位置。
//	 * @param {Element} elem 要计算的元素。
//     * @returns {Point} 返回的对象包含两个整型属性：x 和 y。
//     * @remark
//     * 此方法对可见和隐藏元素均有效。
//     *
//     * @example
//     * 获取第一段相对滚动条顶部的偏移。
//     * #####HTML:
//     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
//     * #####JavaScript:
//     * <pre>
//     * var p = Dom.query("p").item(0);
//     * trace( "scrollTop:" + p.getScroll() );
//     * </pre>
//     * #####结果:
//     * <pre lang="htm" format="none">
//     * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;scrollTop: 0&lt;/p&gt;
//     * </pre>
//     */
//    scroll: function (/*Element*/elem) {
//        return elem.nodeType === 9 ? Dom.getDocumentScroll(elem) : {
//            x: elem.scrollLeft,
//            y: elem.scrollTop
//        };
//    },

//    ///**
//    // * 设置指定节点的滚动条位置。
//    // * @param {Element} elem 要设置的元素。
//    // * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
//    // * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
//    // * @returns this
//    // */
//    //setScroll: function (/*Element*/elem, value) {
//    //    if (elem.nodeType === 9) {
//    //        (elem.defaultView || elem.parentWindow).scrollTo(
//    //            value.x != null ? value.x : Dom.getDocumentScroll(elem).x,
//    //            value.y != null ? value.y : Dom.getDocumentScroll(elem).y
//    //        );
//    //    } else {
//    //        if (value.x != null) {
//    //            elem.scrollLeft = value.x;
//    //        }
//    //        if (value.y != null) {
//    //            elem.scrollTop = value.y;
//    //        }
//    //    }
//    //}

//    // #endregion

//};

////// #region 浏览器兼容性
////// #if CompactMode

////// #region 遍历

////if (!('firstElementChild' in document)) {

////    (function (createWalker) {
////        createWalker('first', 'nextSibling', 'firstChild');
////        createWalker('last', 'previousSibling', 'lastChild');
////        createWalker('next', 'nextSibling', 'nextSibling');
////        createWalker('prev', 'previousSibling', 'previousSibling');
////    })(function (funcName, first, next) {
////        Dom[funcName] = function (node) {
////            node = node[first];
////            while (node && node.nodeType !== 1) {
////                node = node[next];
////            }
////            return node;
////        };
////    });

////    Dom.children = function (elem) {
////        return Array.prototype.slice.call(elem, 0).filter(function (elem) {
////            return elem.nodeType === 1;
////        });
////    };

////}

////// #endregion

////// #region 事件




////// #endregion

//////#region CSS 选择器

////if (!window.Element || !Element.prototype.querySelector || !+"\v") {

////    /**
////     * 使用指定的选择器代码对指定的结果集进行一次查找。
////     * @param {String} selector 选择器表达式。
////     * @param {DomList/Dom} result 上级结果集，将对此结果集进行查找。
////     * @returns {DomList} 返回新的结果集。
////     */
////    Dom.query = function (selector, context) {

////        function addElementsByTagName(elem, tagName, result) {
////            if (elem.getElementsByTagName) {
////                pushResult(elem.getElementsByTagName(tagName), result);
////            } else if (elem.querySelectorAll) {
////                pushResult(elem.querySelectorAll(tagName), result);
////            }
////        }

////        function pushResult(nodelist, result) {
////            for (var i = 0; nodelist[i]; i++) {
////                result[result.length++] = nodelist[i];
////            }
////        }

////        /**
////         * 抛出选择器语法错误。 
////         * @param {String} message 提示。
////         */
////        function throwError(message) {
////            throw new SyntaxError('An invalid or illegal string was specified : "' + message + '"!');
////        }

////        function filter(result, selector) {

////            var match, filterFn, value, code;

////            // ‘#id’ ‘.className’ ‘:filter’ ‘[attr’
////            while (match = /^([#\.:]|\[\s*)((?:[-\w]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {

////                selector = RegExp.rightContext;

////                if (result.length) {

////                    code = match[0];

////                    filterFn = (Dom._filterFn || (Dom._filterFn = {}))[code];

////                    // 如果不存在指定过滤器的特定函数，则先编译一个。
////                    if (!filterFn) {

////                        filterFn = 'for(var n=0,i=0,e,t;e=r[i];i++){t=';
////                        value = match[2].replace(rBackslash, "");

////                        switch (match[1]) {

////                            // ‘#id’
////                            case "#":
////                                filterFn += 'Dom.getAttr(e,"id")===v';
////                                break;

////                                // ‘.className’
////                            case ".":
////                                filterFn += 'Dom.hasClass(e,v)';
////                                break;

////                                // ‘:filter’
////                            case ":":

////                                filterFn += Dom._pseudos[value] || throwError(match[0]);

////                                // ‘selector:nth-child(2)’
////                                if (match = /^\(\s*("([^"]*)"|'([^']*)'|[^\(\)]*(\([^\(\)]*\))?)\s*\)/.exec(selector)) {
////                                    selector = RegExp.rightContext;
////                                    value = match[3] || match[2] || match[1];
////                                }

////                                break;

////                                // ‘[attr’
////                            default:
////                                value = [value.toLowerCase()];

////                                // ‘selector[attr]’ ‘selector[attr=value]’ ‘selector[attr='value']’  ‘selector[attr="value"]’    ‘selector[attr_=value]’
////                                if (match = /^\s*(?:(\S?=)\s*(?:(['"])(.*?)\2|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/.exec(selector)) {
////                                    selector = RegExp.rightContext;
////                                    if (match[1]) {
////                                        value[1] = match[1];
////                                        value[2] = match[3] || match[4];
////                                        value[2] = value[2] ? value[2].replace(/\\([0-9a-fA-F]{2,2})/g, function (x, y) {
////                                            return String.fromCharCode(parseInt(y, 16));
////                                        }).replace(rBackslash, "") : "";
////                                    }
////                                }

////                                filterFn += 'Dom.getAttr(e,v[0])' + (Selector.relative[value[1]] || throwError(code));

////                        }

////                        filterFn += ';if(t)r[n++]=e;}while(r.length>n)delete r[--r.length];';

////                        Dom._filterFn[code] = filterFn = new Function('r', 'v', filterFn);

////                        filterFn.value = value;

////                    }

////                    filterFn(result, filterFn.value);

////                }

////            }

////            return selector;

////        };

////        var result = [],
////            match,
////            value,
////            prevResult,
////            lastSelector,
////            elem,
////            i,
////            rBackslash = /\\/g;

////        selector = selector.trim();
////        context = context || document;

////        // 解析的第一步: 解析简单选择器

////        // ‘*’ ‘tagName’ ‘.className’ ‘#id’
////        if (match = /^(^|[#.])((?:[-\w]|[^\x00-\xa0]|\\.)+)$/.exec(selector)) {

////            value = match[2].replace(rBackslash, "");

////            switch (match[1]) {

////                // ‘#id’
////                case '#':

////                    // 仅对 document 使用 getElementById 。
////                    if (context.nodeType === 9) {
////                        prevResult = context.getElementById(value);
////                        if (prevResult && prevResult.getAttributeNode("id").nodeValue === value) {
////                            result[result.length++] = prevResult;
////                        }
////                        return result;
////                    }

////                    break;

////                    // ‘.className’
////                case '.':

////                    // 仅优化存在 getElementsByClassName 的情况。
////                    if (context.getElementsByClassName) {
////                        pushResult(context.getElementsByClassName(value), result);
////                        return result;
////                    }

////                    break;

////                    // ‘*’ ‘tagName’
////                default:
////                    addElementsByTagName(context, value, result);
////                    return result;

////            }

////        }

////        // 解析的第二步: 获取所有子节点。并不断进行筛选。

////        prevResult = [context];

////        // 解析分很多步进行，每次解析  selector 的一部分，直到解析完整个 selector 。
////        for (; ;) {

////            // 保存本次处理前的选择器。
////            // 用于在本次处理后检验 selector 是否有变化。
////            // 如果没变化，说明 selector 不能被正确处理，即 selector 包含非法字符。
////            lastSelector = selector;

////            // 解析的第三步: 获取所有子节点。第四步再一一筛选。
////            // 针对子选择器和标签选择器优化(不需要获取全部子节点)。

////            // ‘ selector’ ‘>selector’ ‘~selector’ ‘+selector’
////            if (match = /^\s*([>+~\s])\s*(\*|(?:[-\w*]|[^\x00-\xa0]|\\.)*)/.exec(selector)) {

////                selector = RegExp.rightContext;
////                value = match[2].replace(rBackslash, "").toUpperCase() || "*";

////                for (i = 0; elem = prevResult[i]; i++) {
////                    switch (match[1]) {
////                        case ' ':
////                            addElementsByTagName(elem, value, result);
////                            break;

////                        case '>':
////                            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
////                                if (elem.nodeType === 1 && (value === "*" || value === elem.tagName)) {
////                                    result[result.length++] = elem;
////                                }
////                            }
////                            break;

////                        case '+':
////                            while (elem = elem.nextSibling) {
////                                if (elem.nodeType === 1) {
////                                    if ((value === "*" || value === elem.tagName)) {
////                                        result[result.length++] = elem;
////                                    }
////                                    break;
////                                }
////                            }

////                            break;

////                        case '~':
////                            while (elem = elem.nextSibling) {
////                                if (elem.nodeType === 1 && (value === "*" || value === elem.tagName)) {
////                                    result[result.length++] = elem;
////                                }
////                            }
////                            break;

////                        default:
////                            throwError(match[0]);
////                    }
////                }


////            } else {

////                // ‘tagName’ ‘*’ 
////                if (match = /^((?:[-\w\*]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
////                    value = match[1].replace(rBackslash, "").toUpperCase();
////                    selector = RegExp.rightContext;
////                } else {
////                    value = "*";
////                }

////                for (i = 0; elem = prevResult[i]; i++) {
////                    addElementsByTagName(elem, value, result);
////                }

////            }

////            if (prevResult.length > 1) {
////                result.unique();
////            }

////            // 解析的第四步: 筛选第三步返回的结果。

////            // 如果没有剩余的选择器，说明节点已经处理结束。
////            if (selector) {

////                // 进行过滤筛选。
////                selector = filter(result, selector);

////            }

////            // 如果筛选后没有其它选择器。返回结果。
////            if (!selector) {
////                break;
////            }

////            // 解析的第五步: 解析, 如果存在，则继续。

////            // ‘,selectpr’ 
////            if (match = /^\s*,\s*/.exec(selector)) {
////                result.push.apply(result, Dom.query(RegExp.rightContext, context));
////                result.unique();
////                break;
////            }

////            // 存储当前的结果值，用于下次继续筛选。
////            prevResult = result;

////            // 清空之前的属性值。
////            result = [];

////            // 如果没有一个正则匹配选择器，则这是一个无法处理的选择器，向用户报告错误。
////            if (lastSelector.length === selector.length) {
////                throwError(selector);
////            }
////        }

////        return result;
////    };

////    Dom.find = function (selector, context) {
////        return Dom.query(selector, context)[0];
////    };

////    /**
////     * 用于查找所有支持的伪类的函数集合。
////     * @private
////     * @static
////     */
////    Dom._pseudos = {
////        target: 'window.location&&window.location.hash;t=t&&t.slice(1)===e.id',
////        contains: 'Dom.getText(e).indexOf(v)>=0',
////        hidden: 'Dom.isHidden(e)',
////        visible: '!Dom.isHidden(e)',

////        not: '!Dom.matches(e, v)',
////        has: '!Dom.find(v, e)',

////        selected: 'Dom.getAttr(e, "selected")',
////        checked: 'e.checked',
////        enabled: 'e.disabled===false',
////        disabled: 'e.disabled===true',

////        input: '^(input|select|textarea|button)$/i.test(e.nodeName)',

////        "nth-child": 'Dom.children(elem).indexOf(elem)+1;t=v==="odd"?t%2:v==="even"?t%2===0:t===v',
////        "first-child": '!Dom.prev(elem)',
////        "last-child": '!Dom.next(elem)',
////        "only-child": '!Dom.prev(elem)&&!Dom.next(elem)'

////    };

////    Dom._relative = {
////        'undefined': '!=null',
////        '=': '===v[2]',
////        '~=': ';t=(" "+t+" ").indexOf(" "+v[2]+" ")>=0',
////        '!=': '!==v[2]',
////        '|=': ';t=("-"+t+"-").indexOf("-"+v[2]+"-")>=0',
////        '^=': ';t=t&&t.indexOf(v[2])===0',
////        '$=': ';t=t&&t.indexOf(v[2].length-t.length)===v[2]',
////        '*=': ';t=t&&t.indexOf(v[2])>=0'
////    };

////}

//////#endregion

////// #region 其它

////// IE6: 清空缓存。
////if (document.execCommand) {
////    try {
////        document.execCommand("BackgroundImageCache", false, true);
////    } catch (e) { }
////}

////// #endregion

////// #endif
////// #endregion



//// #if CompactMode

//if (!document.contains) {
//    Dom.contains = function(node, child) {
//        while (child) {
//            if (node === child)
//                return true;
//            child = child.parentNode;
//        }
//        return false;
//    };
//}

//// #endif

/////**
//// * 设置指定元素特效执行完之后的回调。
//// * @param {Element} elem 要设置的节点。
//// * @param {Function} callback 要设置的回调。
//// * @param {Number} duration=0.3 指定特效的执行时间。
//// */
////transitionEnd: function (elem, callback, duration) {

////    var timer;

////    function proxy(e) {

////        // 删除二次回调。
////        if (timer) {
////            clearTimeout(timer);

////            elem.removeEventListener('webkitTransitionEnd', proxy, false);
////            elem.removeEventListener('transitionend', proxy, false);
////            elem.removeEventListener('oTransitionEnd', proxy, false);
////            elem.removeEventListener('otransitionend', proxy, false);

////            return callback.call(elem, e);
////        }

////    }

////    elem.addEventListener('webkitTransitionEnd', proxy, false);
////    elem.addEventListener('transitionend', proxy, false);
////    elem.addEventListener('oTransitionEnd', proxy, false);
////    elem.addEventListener('otransitionend', proxy, false);

////    timer = setTimeout(callback, duration || 0.3);

////}

//Object.extend(String, {

//    quote: function (str) {
//        var metaObject = {
//            '\b': '\\b',
//            '\t': '\\t',
//            '\n': '\\n',
//            '\f': '\\f',
//            '\r': '\\r',
//            '\\': '\\\\'
//        },
//		str = this.replace(/[\x00-\x1f\\]/g, function (chr) {
//		    var special = metaObject[chr];
//		    return special ? special : '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4)
//		});
//        return '"' + str.replace(/"/g, '\\"') + '"';
//    },

//    encodeJs: function (str) {

//        // TODO  效率不高

//        return this.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\'/, "\\'");
//    },

//    /**
//     * Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
//     * @param {String} value The string to encode
//     * @returns {String} The encoded text
//     * @method
//     */
//    encodeHtml: (function () {
//        var entities = {
//            '&': '&amp;',
//            '>': '&gt;',
//            '<': '&lt;',
//            '"': '&quot;'
//        }, keys = [], p, regex;

//        for (p in entities) {
//            keys.push(p);
//        }

//        regex = new RegExp('(' + keys.join('|') + ')', 'g');

//        return function (value) {
//            return (!value) ? value : String(value).replace(regex, function (match, capture) {
//                return entities[capture];
//            });
//        };
//    })(),

//    /**
//     * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
//     * @param {String} value The string to decode
//     * @returns {String} The decoded text
//     * @method
//     */
//    decodeHtml: (function () {
//        var entities = {
//            '&amp;': '&',
//            '&gt;': '>',
//            '&lt;': '<',
//            '&quot;': '"'
//        }, keys = [], p, regex;

//        for (p in entities) {
//            keys.push(p);
//        }

//        regex = new RegExp('(' + keys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');

//        return function (value) {
//            return (!value) ? value : String(value).replace(regex, function (match, capture) {
//                if (capture in entities) {
//                    return entities[capture];
//                } else {
//                    return String.fromCharCode(parseInt(capture.substr(2), 10));
//                }
//            });
//        };
//    })(),

//    /**
//     * Appends content to the query string of a URL, handling logic for whether to place
//     * a question mark or ampersand.
//     * @param {String} url The URL to append to.
//     * @param {String} string The content to append to the URL.
//     * @returns (String) The resulting URL
//     */
//    urlAppend: function (url, string) {
//        if (!Ext.isEmpty(string)) {
//            return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
//        }

//        return url;
//    },

//    removeHtml: function (str) {
//        ///<summary>去除字符串中的 HTML 标签并返回。语法：removeHtml()</summary>
//        ///<returns type="string">返回去除了 HTML 标签的字符串。</returns>
//        return str.replace(/<(.|\n)+?>/g, "");
//    },

//    removeRepeats: function (value) {
//        return value.replace(/(\w)(?=.*\1)/g, "");
//    },

//    /**
//	 * 使  HTML 代码更标准，比如添加注释。
//	 */
//    toXHTML: function (value) {
//        return value.replace(/( [^\=]*\=)(\s?[^\"\s\>]*)/ig, function (a, b, c, d, e) { return (c) ? (new RegExp("<[^>]*" + c.replace(/(\^|\(|\)|\[|\]|\{|\}|\?|\-|\\|\/|\||\$)/g, '\\$1') + "[^>]*>", "i").test(e)) ? b + '"' + c + '"' : b + c : b });
//    },

//    compare: function (a, b) {
//        if (a.length == b.length) return a.split("").sort().join("") == b.split("").sort().join("");
//        a = a.split("").sort().join("").replace(/(.)\1+/g, "$1");
//        b = b.split("").sort().join("").replace(/(.)\1+/g, "$1");
//        var arr = a.split("");
//        var re = new RegExp(arr.join("|"), "g");
//        return (b.length - b.replace(re, "").length == a.length || b.replace(re, "").length == 0)
//    },

//    stripScripts: function (exec) {
//        var scripts = '';
//        var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function (all, code) {
//            scripts += code + '\n';
//            return '';
//        });
//        if (exec === true) Browser.exec(scripts);
//        else if (typeOf(exec) == 'function') exec(scripts, text);
//        return text;
//    }


//});

