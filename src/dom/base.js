/**
 * @author xuld
 * @fileOverview 提供 DOM 操作的辅助函数。
 */

// #region 提供最新 API

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.oMatchesSelector || function (selector) {
        var parent = this.parentNode, tempParent = !parent && Dom.getDocument(this).body;
        tempParent && tempParent.appendChild(this);
        try {
            return Array.prototype.indexOf.call(parent.querySelectorAll(selector), this) >= 0;
        } finally {
            tempParent && tempParent.removeChild(this);
        }
    };
}

if (!('classList' in Element.prototype)) {
    Object.defineProperty(Element.prototype, 'classList', {
        get: function() {
            var elem = this;
            return {
                contains: function(className) {
                    return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;  
                },
                add: function(className) {
                    if ((" " + elem.className + " ").indexOf(className) < 0) {
                        elem.className += ' ' + className;
                    }
                },
                remove: function (className) {
                    elem.className = className ? (" " + elem.className + " ").replace(" " + classList[i] + " ", " ").trim() : '';
                },
                toggle: function (className) {
                    this.contains(className) ? this.remove(className) : this.add(className);
                }
            };
        }
    });
}

// #endregion

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

    /**
	 * 执行一个 CSS 选择器，返回匹配的第一个节点。
	 * @param {String} selector 要执行的 CSS 选择器。
	 * @param {Document} context 执行的上下文文档。
	 * @return {Element} 返回匹配的节点。
	 */
    find: function (selector, context) {
        return selector ? selector.constructor === String ? (context || document).querySelector(selector) : selector : null;
    },

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
        return selector ? selector.constructor === String ? 
            (context || document).querySelectorAll(selector) :
            selector.length !== undefined ? selector : [selector] : [];
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
     * 获取指定节点及父节点对象中第一个满足指定 CSS 选择器或函数的节点。
     * @param {Node} node 节点。
     * @param {String} selector 用于判断的元素的 CSS 选择器。
     * @param {Node} [context=document] 只在指定的节点内搜索此元素。
     * @return {Node} 如果要获取的节点满足要求，则返回要获取的节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
     */
    closest: function (node, selector, context) {
        while (node && node != context) {
            if (node.matches(selector)) {
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
     * 获取当前节点在父节点的索引。
     */
    getIndex: function (node) {
        var i = 0;
        while (node = node.previousElementSibling) {
            i++;
        }
        return i;
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

    // #endregion

    // #region 属性和样式

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
        return eval(expression.replace(/\w+/g, '(parseFloat(computedStyle.$1)||0)'));
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
    show: function (elem) {

        // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
        elem.style.display = '';

        // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
        if (Dom.isHidden(elem)) {
            var defaultDisplay = elem.style.defaultDisplay;
            if (!defaultDisplay) {
                var defaultDisplayCache = Dom.defaultDisplayCache || (Dom.defaultDisplayCache = {});
                defaultDisplay = defaultDisplayCache[elem.nodeName];
                if (!defaultDisplay) {
                    var tmp = document.createElement(elem.nodeName);
                    document.body.appendChild(tmp);
                    defaultDisplay = Dom.getStyle(tmp, 'display');
                    if (defaultDisplay === 'none') {
                        defaultDisplay = 'block';
                    }
                    defaultDisplayCache[elem.nodeName] = defaultDisplay;
                    document.body.removeChild(tmp);
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

};

/**
 * 快速调用 Dom.get 或 Dom.find 或 Dom.parse 或 Dom.ready。
 * @param {Function/String/Node} selector 要执行的 CSS 选择器或 HTML 片段或 DOM Ready 函数。
 * @return {Dom} 返回匹配的节点列表。
 */
var $ = $ || (function() {
    function $(selector, context) {
        if (selector) {
            if (selector.constructor === String) {
                return new addAll(/^</.test(selector) ? Dom.parse(selector, context).parentNode.childNodes : (context || document).querySelectorAll(selector));
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
