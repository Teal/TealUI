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

if (!Element.prototype.contains) {
    Element.prototype.contains = function (node) {
        for (;node;node = node.parentNode) {
            if (node == this) {
                return true;
            }
        }
        return false
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

    eventFix: {},

    /**
     * 为指定元素添加一个事件监听器。
     * @param {Element} elem 要处理的元素。
     * @param {String} eventName 要添加的事件名。
     * @param {String} [proxySelector] 代理的选择器。
     * @param {Function} eventListener 要添加的事件监听器。
     */
    on: function (elem, eventName, proxySelector, eventListener) {

        // 允许不传递 proxySelector 参数。
        if (!eventListener) {
            eventListener = proxySelector;
            proxySelector = '';
        }

        var events = elem.__events__ || (elem.__events__ = {}),
            eventInfo = events[eventName] || (events[eventName] = []),

            // 获取特殊处理的事件。
            eventFix = Dom.eventFix[eventName],
            
            // 代理触发事件。
            actualListener = proxySelector ? function (e) {
                var actucalTarget = Dom.closest(e.target, proxySelector, elem);
                console.log("判断是否是委托", e, actucalTarget, e.target, proxySelector, elem);
                return actucalTarget && eventListener.call(actucalTarget, e);
            } : eventListener;

        // 区分是特殊事件还是普通事件。
        if (eventFix) {
            actualListener = eventFix.proxy(elem, eventName, actualListener);
        }

        // 相同的事件绑定两次只执行一次，需要生成新的引用。
        // 对于特殊事件或委托事件，每次都会重新生成新的代理函数，不会进入 if。
        if (eventInfo.indexOf(actualListener) >= 0) {
            actualListener = function (e) {
                return eventListener.call(this, e);
            };
        }

        // 实际添加句柄。
        if (eventFix) {
            actualListener && elem.addEventListener((proxySelector ? eventFix.delegate : eventFix.bind) || eventName, actualListener, false);
        } else{
            elem.addEventListener(eventName, actualListener, false);
        }
        
        // 添加当前处理函数到集合。以便之后删除事件或触发事件。
        if (actualListener !== eventListener) {
            eventName += 'Proxy';
            (events[eventName] || (events[eventName] = []))[eventInfo.length] = actualListener;
        }
        eventInfo.push(eventListener);

    },

    /**
     * 删除指定元素的一个或多个事件监听器。
     * @param {Element} elem 要处理的元素。
     * @param {String} eventName 要删除的事件名。
     * @param {Function} eventListener 要删除的事件处理函数。
     */
    off: function (elem, eventName, eventListener) {

        if (Dom.eventFix[eventName]) {
            return Dom.eventFix[eventName].remove(elem, eventName, eventListener);
        }

        elem.removeEventListener(eventName, eventListener.proxy || eventListener, false);

        var eventInfo = elem.__events__ && elem.__events__[eventName];

        // if (eventInfo)

        if (eventProxy) {
            eventName += 'Proxy';
            (events[eventName] || (events[eventName] = []))[eventInfo.length] = eventProxy;
        }
        eventInfo.push(eventListener);

    },

    /**
     * 触发一个事件，执行已添加的监听器。
     * @param {Element} elem 要处理的元素。
     * @param {String} eventName 要触发的事件名。
     * @param {Object} eventArgs 传递给监听器的事件对象。
     */
    trigger: function (elem, eventName, eventArgs) {

        if (Dom.eventFix[eventName]) {
            return Dom.eventFix[eventName].trigger(elem, eventName, eventArgs);
        }

        var triggerFix = Dom.triggerFix;
        if (!triggerFix) {
            Dom.triggerFix = triggerFix = {};
            triggerFix.click = triggerFix.mousedown = triggerFix.mouseup = triggerFix.mousemove = 'MouseEvents';
        }

        var event = document.createEvent(triggerFix[eventName] || 'Events'),
            bubbles = true;
        for (var name in eventArgs) {
            name === 'bubbles' ? (bubbles = !!e[name]) : (event[name] = eventArgs[name]);
        }
        event.initEvent(eventName, bubbles, true);
        elem.dispatchEvent(event);
    },

    defineEvent: function (eventName, options) {
        Dom.eventFix[eventName] = options;
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

// #region 事件补丁

(function() {

    var eventFix = Dom.eventFix;
    var html = document.documentElement;

    // 火狐浏览器不支持 mousewheel 事件。
    if(html.onmousewheel === undefined){
        eventFix.mousewheel = {
            bind: 'DOMMouseScroll',
            proxy: function (elem, eventName, eventListener) {
                return function(e) {
                    e.wheelDelta = -(event.detail || 0) / 3;
                    return eventListener.call(this, e);
                };
            }
        };
    }
	
    // mouseenter/mouseleave 事件不支持委托。
    // 部分标准浏览器不支持 mouseenter/mouseleave 事件。
    function defineMouseMoveEvent(eventName, delegateEvent){
        eventFix[eventName] = {
            delegate: delegateEvent,
            bind: html.onmouseenter === undefined && delegateEvent,
            proxy: function (elem, eventName, eventListener) {
                return function (e) {
                    console.log("判断是否是 mouseenter", e, e.type === eventName, !this.contains(e.relatedTarget));
                    // 如果浏览器原生支持 mouseenter/mouseleave 则不作过滤。
                    if (e.type === eventName || !this.contains(e.relatedTarget)) {
                        return eventListener.call(this, e);
                    }
                };
            }
        };
    }
    defineMouseMoveEvent('mouseenter', 'mouseover');
    defineMouseMoveEvent('mouseleave', 'mouseout');
	
    // 部分标准浏览器不支持 focusin/focusout 事件
    if (html.onfocusin === undefined){
        eventFix.focusin = eventFix.focusout = {
            proxy: function(elem, eventName, eventListener) {
                var propName = '__' + eventName + '__',
                    doc = Dom.getDocument(elem);
                if (!doc[propName]) {
                    doc.addEventListener(eventName === 'focusin' ? 'focus' : 'blur', doc[propName] = function(e) {
                        if (e.eventPhase <= 1) {
                            var p = elem;
                            while (p && p.parentNode) {
                                if (!Dom.trigger(p, eventName, e)) {
                                    return;
                                }

                                p = p.parentNode;
                            }
                        }
                    }, true);
                }
            }
        };
    }
	
    // focus/blur 事件不支持委托。
    eventFix.focus = {
        delegate: 'focusin'
    };
    eventFix.blur = {
        delegate: 'focusout'
    };

    eventFix.focus.proxy = eventFix.blur.proxy = function(elem, eventName, eventListener) {
        return eventListener;
    };

    // 触屏上 mouse 相关事件太慢，改用 touch 事件模拟。
    if (window.TouchEvent) {
        eventFix.mousedown = {
            bind: 'touchstart'
        };
        eventFix.mousemove = {
            bind: 'touchmove'
        };
        eventFix.mouseup = {
            bind: 'touchend'
        };
        eventFix.mousedown.proxy = eventFix.mousemove.proxy = eventFix.mouseup.proxy =function(elem, eventName, eventListener) {
            return function (e) {
                if (e.touches.length) {
                    e.__defineGetter__("pageX", function () {
                        return this.touches[0].pageX;
                    });
                    e.__defineGetter__("pageY", function () {
                        return this.touches[0].pageY;
                    });
                    e.__defineGetter__("which", function () {
                        return 1;
                    });
                }
                return eventListener.call(this, e);
            };
        };

        // 让浏览器快速响应 click 事件，而非等待 300ms 。
        eventFix.click = {
            bind: 'touchstart',
            proxy: function (elem, eventName, eventListener) {
                return function (e) {
                    var doc = Dom.getDocument(elem);
                    doc.addEventListener('touchend', function (e) {
                        doc.removeEventListener('touchend', arguments.callee, true);
                        return eventListener.call(elem, e);
                    }, true);
                };
            }
        };
    }

})();

// #endregion

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
