// #todo

/**
 * @fileOverview 提供 DOM 操作的辅助函数。
 * @author xuld@vip.qq.com
 */

typeof include === "function" && include("../lang/html5");

// #region 核心

/** @category 列表操作 */

/**
 * 查询 CSS 选择器匹配的所有节点；解析一个 HTML 字符串生成对应的节点；绑定一个 DOM Ready 回调。
 * @param {mixed} selector 要执行的 CSS 选择器或 HTML 字符串或 DOM Ready 回调。
 * @param {Document} context 执行的上下文文档。
 * @returns {mixed} 返回匹配的节点列表或创建的节点列表或空。
 * @example
 * $(".doc-box")
 * 
 * $("&lt;a>你好&lt;/a>")
 * 
 * $(function(){ alert("DOM ready") })
 * @class
 */
function Dom(selector, context) {
    selector = selector || 0;
    return typeof selector === "string" ?
        /^</.test(selector) ? Dom.parse(selector, context) : Dom.find(selector, context) :
        selector instanceof Dom ? selector :
        typeof selector === "function" ? Dom.ready(selector, context) : new Dom.List(selector);
}

/**
 * 表示一个节点列表。
 * @param {String} items 设置节点列表中的项列表。
 * @returns {Dom} 返回匹配的节点列表。
 * @inner
 */
Dom.List = function (items) {
    var me = this;
    // 特殊处理 Node 或 window。
    if (items.nodeType || items.document) {
        me[me.length++] = items;
    } else {
        for (var i = 0, node; (node = items[i]) ; i++) {
            me[me.length++] = node;
        }
    }
};

/**
 * 查询 CSS 选择器匹配的所有节点。
 * @param {String} selector 要执行的 CSS 选择器。
 * @param {Document} context 执行的上下文文档。
 * @returns {Dom} 返回匹配的节点列表。
 * @inner
 */
Dom.find = function (selector, context) {
    typeof console === "object" && console.assert(typeof selector === "string", "Dom.find(selector: 必须是字符串, [context])");
    typeof console === "object" && console.assert(!context || context.querySelectorAll, "Dom.find(selector, [context: 必须是节点])");
    return new Dom.List((context || document).querySelectorAll(selector));
};

/**
 * 解析一个 HTML 片段并生成节点。
 * @param {String} selector 要解析的 HTML 字符串。
 * @param {Node} context 解析所在的文档。
 * @returns {Dom} 返回生成的节点列表。
 * @inner
 */
Dom.parse = function (html, context) {
    if (typeof html === "string") {

        context = context ? context.ownerDocument || context : document;
        typeof console === "object" && console.assert(context.createElement, "Dom.parse(selector, [context: 必须是文档])");

        // 首次解析。
        var parseFix = Dom._parseFix;
        if (!parseFix) {
            Dom._parseFix = parseFix = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                area: [1, "<map>", "</map>"],
                param: [1, "<object>", "</object>"],
                thead: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"]
            };
            parseFix.optgroup = parseFix.option;
            parseFix.tbody = parseFix.tfoot = parseFix.colgroup = parseFix.caption = parseFix.thead;
            parseFix.th = parseFix.td;

            Dom._parseContainer = context.createElement('div');
        }

        // 测试是否包含需要特殊处理的片段。
        var tag = /^<([!\w:]+)/.exec(html);
        tag = tag && parseFix[tag[1].toLowerCase()];

        // 确定容器。
        var container = context === document ? Dom._parseContainer : context.createElement('div');

        // IE6-8: 必须为 HTML 追加文本才能正常解析。
        /*@cc_on if(!+"\v1") { 
            tag = tag || [1, "$<div>", "</div>"]; 
            if(context.createFragment){
                var fragment = context.createFragment();
                fragment.appendChild(container);
            }
         } @*/

        if (tag) {
            container.innerHTML = tag[1] + html + tag[2];
            // 转到正确的深度。
            for (var i = tag[0]; i--;) {
                container = container.lastChild;
            }
        } else {
            container.innerHTML = html;
        }

        html = container.childNodes;
    }
    return new Dom.List(html);
};

/**
 * 绑定一个 DOM Ready 回调。
 * @param {Function} callback 要执行的 DOM Ready 回调。
 * @param {Document} context 执行的上下文文档。
 * @inner
 */
Dom.ready = function (callback, context) {
    typeof console === "object" && console.assert(callback instanceof Function, "Dom.ready(callback: 必须是函数, [context])");
    typeof console === "object" && console.assert(!context || context.createElement, "Dom.ready(callback, [context: 必须是文档])");
    context = context || document;
    if (/complete|loaded|interactive/.test(context.readyState) && context.body) {
        callback.call(context);
    } else {
        /*@cc_on if(!+"\v1") {
        return setTimeout(function() { Dom.ready(callback, context); }, 14);
        } @*/
        context.addEventListener('DOMContentLoaded', callback, false);
    }
};

/**
 * 获取指定节点的数据容器。
 * @param {Element} elem 节点。
 * @param {String} fieldName 要获取的字段名。
 * @returns {Object} 返回存储数据的字段。
 * @example Dom.data(document.getElementById('elem'), "custom")
 * @inner
 */
Dom.data = function (elem, fieldName) {
    typeof console === "object" && console.assert(elem, "Dom.data(elem: 不能为空, fieldName)");
    var datas = Dom._datas || (Dom._datas = {});
    var id = elem.__dataId__ || (elem.__dataId__ = Dom._dataId = Dom._dataId + 1 || 1);
    datas = datas[id] || (datas[id] = {});
    return datas[fieldName] || (datas[fieldName] = {});
};

/**
 * 判断指定节点是否匹配指定的选择器。
 * @param {Node} node 要判断的节点。
 * @param {String} selector 要判断的选择器。
 * @returns {Boolean} 如果匹配则返回 @true，否则返回 @false。
 * @example Dom.matches(document.body, "body")
 * @inner
 */
Dom.matches = function (node, selector) {

    typeof console === "object" && console.assert(node, "Dom.matches(node: 不能为空, selector)");
    typeof console === "object" && console.assert(typeof selector === "string", "Dom.matches(node, selector: 必须是字符串)");

    // 只对元素判断。
    if (node.nodeType !== 1) {
        return false;
    }

    // 优先调用原始 API。
    var nativeMatcher = node.webkitMatchesSelector || node.msMatchesSelector || node.mozMatchesSelector || node.oMatchesSelector || node.matchesSelector;
    if (nativeMatcher) {
        return nativeMatcher.call(node, selector);
    }

    // 判断是否可以通过选择器获取节点。
    var parent = node.parentNode,
        tempParent = !parent && node.ownerDocument.body;
    tempParent && tempParent.appendChild(node);
    try {
        return ~Array.prototype.indexOf.call(Dom.find(selector, parent), node);
    } finally {
        tempParent && tempParent.removeChild(node);
    }
};

/**
 * 判断指定节点是否包含另一个节点。
 * @param {Node} node 要判断的节点。
 * @param {Node} child 要判断的子节点。
 * @returns {Boolean} 如果 @child 是 @node 或其子节点则返回 @true，否则返回 @false。
 * @example Dom.contains(document.body, document.body)
 * @inner
 */
Dom.contains = function (node, child) {
    typeof console === "object" && console.assert(node, "Dom.contains(node: 必须是节点, child)");
    typeof console === "object" && console.assert(!child || child.parentNode, "Dom.contains(node, child: 必须是节点)");
    if (node.contains) {
        return node.contains(child);
    }
    for (; child; child = child.parentNode) {
        if (child === node) {
            return true;
        }
    }
    return false;
};

/**
 * 获取指定节点及其父节点中第一个匹配指定 CSS 选择器的节点。
 * @param {Node} node 要判断的节点。
 * @param {String} selector 要匹配的 CSS 选择器。
 * @param {Node} [context=document] 指定搜索的限定范围，只在指定的节点内搜索。
 * @returns {Node} 如果 @node 匹配 @selector，则返回 @node，否则返回 @node 第一个匹配的父节点对象。如果全部不匹配则返回 @null。
 * @example Dom.closest(document.getElementById('elem'), 'body')
 * @inner
 */
Dom.closest = function (node, selector, context) {
    while (node && node !== context && !Dom.matches(node, selector)) {
        node = node.parentNode;
    }
    return node === context ? null : node;
};

/**
 * 为指定的 CSS 属性添加当前浏览器特定的后缀（如 webkit-)。
 * @param {Element} elem 要处理的元素。
 * @param {String} cssPropertyName 要处理的 CSS 属性名。
 * @returns {String} 返回已加后缀的 CSS 属性名。
 * @example Dom.vendor(document.getElementById('elem'), 'transform')
 * @inner
 */
Dom.vendor = function (elem, cssPropertyName) {
    typeof console === "object" && console.assert(elem && elem.style, "Dom.vendor(elem: 必须是元素, cssPropertyName)");
    typeof console === "object" && console.assert(typeof cssPropertyName === "string", "Dom.vendor(elem, cssPropertyName: 必须是字符串)");
    if (!(cssPropertyName in elem.style)) {
        var capName = cssPropertyName.charAt(0).toUpperCase() + cssPropertyName.slice(1);
        for (var prefix in { webkit: 1, Moz: 1, ms: 1, O: 1 }) {
            if ((prefix + capName) in elem.style) {
                return prefix + capName;
            }
        }
    }
    return cssPropertyName;
};

/**
 * 获取或设置节点的当前 CSS 属性值。
 * @param {Element} elem 要获取或设置的元素。
 * @param {String} cssPropertyName 要获取或设置的 CSS 属性名。属性名必须使用骆驼规则。
 * @param {mixed} [value] 要设置的 CSS 属性值，数字会自动追加像素单位。留空则不设置值。
 * @returns {String} 如果 @value 为 @undefined 则返回 CSS 属性值。否则不返回。
 * @example Dom.css(document.getElementById('elem'), 'fontSize')
 * @inner
 */
Dom.css = function (elem, cssPropertyName, value) {

    typeof console === "object" && console.assert(elem && elem.style, "Dom.css(elem: 必须是元素, cssPropertyName, [value])");
    typeof console === "object" && console.assert(!/-/.test(cssPropertyName), "Dom.css(elem, cssPropertyName: CSS 属性名必须使用骆驼规则(如将 font-size 改成 fontSize), [value])");

    /*@cc_on if(!+"\v1") {

    if(!Dom._styleFix){
        Dom._styleFix = {
            height: {
                get: function (elem) {
                    return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
                }
            },
            width: {
                get: function (elem) {
                    return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
                }
            },
            cssFloat: {
                get: function (elem) {
                    return Dom(elem).css('styleFloat');
                },
                set: function (elem, value) {
                    return Dom(elem).css('styleFloat', value);
                }
            },
            opacity: {
                rOpacity: /opacity=([^)]*)/,
                get: function (elem) {
                    return this.rOpacity.test(elem.currentStyle.filter) ? parseInt(RegExp.$1) / 100 + '' : '1';
                },
                set: function(elem, value) {

                    value = value || value === 0 ? 'opacity=' + value * 100 : '';
            
                    // 当元素未布局，IE会设置失败，强制使生效。
                    elem.style.zoom = 1;

                    // 获取真实的滤镜。
                    var filter  = elem.currentStyle.filter;

                    // 设置值。
                    elem.style.filter = this.rOpacity.test(filter) ? filter.replace(this.rOpacity, value) : (filter + ' alpha(' + value + ')');
                }
            }
        };
    }

    var styleFix = Dom._styleFix[cssPropertyName] || 0, r;

    if(value === undefined){
    
        if(styleFix.get){
            return styleFix.get(elem);
        }
    
        // currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
        // currentStyle是运行时期样式与style属性覆盖之后的样式
        r = elem.currentStyle[cssPropertyName];
    
        // 来自 jQuery
        // 如果返回值不是一个带px的 数字。 转换为像素单位
        if (/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {
    
            // 保存初始值
            var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;
    
            // 放入值来计算
            elem.runtimeStyle.left = elem.currentStyle.left;
            style.left = cssPropertyName === "fontSize" ? "1em" : (r || 0);
            r = style.pixelLeft + "px";
    
            // 回到初始值
            style.left = left;
            elem.runtimeStyle.left = rsLeft;
    
        }
    
        return r;
    }

    if(styleFix.set){
        styleFix.set(elem, value);
    }

    } @*/

    cssPropertyName = Dom.vendor(elem, cssPropertyName);

    if (value === undefined) {
        return elem.ownerDocument.defaultView.getComputedStyle(elem, null)[cssPropertyName];
    }

    // 自动追加像素单位。
    if (value && typeof value === "number" && !/^(columnCount|fillOpacity|flexGrow|flexShrink|fontWeight|lineHeight|opacity|order|orphans|widows|zIndex|zoom)$/.test(cssPropertyName)) {
        value += 'px';
    }

    elem.style[cssPropertyName] = value;

};

/**
 * 计算一个元素的样式表达式。
 * @param {Element} elem 要获取的元素。
 * @param {String} expression 要计算的表达式。其中使用变量代表 CSS 属性值，如 "width+paddingLeft"。
 * @returns {Number} 返回计算的值。
 * @example Dom.calc(document.getElementById('elem'), 'fontSize+lineHeight')
 * @inner
 */
Dom.calc = function (elem, expression) {
    typeof console === "object" && console.assert(elem && elem.style, "Dom.calc(elem: 必须是元素, expression)");
    typeof console === "object" && console.assert(typeof expression === "string", "Dom.calc(elem, expression: 必须是字符串)");
    /*@cc_on if(!+"\v1") {return eval(expression.replace(/\w+/g, '(parseFloat(Dom.css(elem, "$1")) || 0)'));} @*/
    // ReSharper disable once UnusedLocals
    var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
    return eval(expression.replace(/(\w+)/g, "(parseFloat(computedStyle['$1'])||0)"));
};

// #endregion

Dom.List.prototype = Dom.prototype = {

    // #region 列表操作

    /**
     * 获取当前节点列表的长度。
     * @type Number
     * @example $("#elem").length
     */
    length: 0,

    /**
     * 向当前节点列表添加一个或多个节点。
     * @param {mixed} items 要添加的节点或节点列表。
     * @returns this
     * @example $("#elem").add(document.body)
     */
    add: function (items) {
        items && Dom.List.call(this, items);
        return this;
    },

    /**
     * 遍历当前节点列表，并对每一项执行函数 @fn。
     * @param {Function} fn 对每一项执行的函数。函数的参数依次为:
     * 
     * * @param {Node} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Dom} dom 当前正在遍历的节点列表。
     * * @returns {Boolean} 如果返回 @false，则终止循环。
     *
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @returns this
     * @example $("#elem").each(function(elem){ console.log(elem); })
     */
    each: function (callback, scope) {
        typeof console === "object" && console.assert(callback instanceof Function, "dom.each(callback: 必须是函数, [scope])");
        for (var i = 0, node; (node = this[i]) && callback.call(scope, node, i, this) !== false; i++);
        return this;
    },

    /**
     * 对当前节点列表每一项进行处理，并将结果组成一个新数组。
     * @param {Function} callback 对每一项运行的函数。函数的参数依次为:
     *
     * * @param {Node} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Dom} dom 当前正在遍历的节点列表。
     * * @returns {mixed} 返回一个或多个节点，这些节点将被添加到返回的列表。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @returns {Dom} 返回一个新节点列表。
     * @example $("#elem").map(function(node){return node.firstChild})
     */
    map: function (callback, scope) {
        typeof console === "object" && console.assert(callback instanceof Function, "dom.map(callback: 必须是函数, [scope])");
        var result = Dom();
        for (var i = 0, node; (node = this[i]) ; i++) {
            result.add(callback.call(scope, node, i, this));
        }
        return result;
    },

    /**
     * 将当前节点列表中符合要求的项组成一个新节点列表。
     * @param {mixed} selector 过滤使用的 CSS 选择器或用于判断每一项是否符合要求的函数。函数的参数依次为:
     * 
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @returns {Dom} 返回一个新节点列表。如果过滤条件为空则返回 @this。
     * @example $("#elem").filter('div')
     */
    filter: function (selector, scope, not) {
        not = not || false;
        var me = this;
        return selector ? me.map(function (node, index) {
            return (selector.constructor === Function ? !!selector.call(scope, node, index, me) : Dom.matches(node, selector)) !== not && node;
        }) : me;
    },

    /**
     * 将当前节点列表中不符合要求的项组成一个新列表。
     * @param {mixed} selector 过滤使用的 CSS 选择器或用于判断每一项是否符合要求的函数。函数的参数依次为:
     * 
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @returns {Dom} 返回一个新列表，或者如果过滤条件为空则返回 @this。
     * @example $("#elem").not('div')
     */
    not: function (selector, scope) {
        return this.filter(selector, scope, true);
    },

    ///**
    // * 获取当前节点列表指定项。
    // * @param {Number} index 要获取的索引。如果小于 0 则获取倒数项。
    // * @returns {Dom} 返回一个新列表。
    // * @example $("#elem").item(-1)
    // */
    //item: function (index) {
    //    return Dom(this[index < 0 ? this.length + index : index]);
    //},

    /**
     * 如果当前节点列表为空则返回 @null，否则返回当前节点列表。
     * @returns {Dom} 返回一个节点列表。 
     * @example $().valueOf()
     */
    valueOf: function () {
        return this.length ? this : null;
    },

    // #endregion

    // #region @事件

    /** @category 事件 */

    /**
     * 为当前节点列表每一项添加一个事件监听器。
     * @param {String} eventName 要添加的事件名。
     * @param {String} [delegateSelector] 代理目标节点选择器。
     * @param {Function} eventListener 要添加的事件监听器。
     * @param {Object} [scope] 设置回调函数中 this 的指向。
     * @example
     * ##### 普通绑定
     * $("#elem").on('click', function(){ alert("点击事件") });
     * 
     * ##### 委托事件
     * $("#elem").on('mouseenter', 'a', function(e){ this.firstChild.innerHTML = e.pageX; });
     * 
     * @remark
     * > #### 触屏事件
     * > click`/`mouse` 事件会自动绑定为相应的`touch` 事件，以增加触屏设备上相应事件的响应速度。
     * 
     * > #### IE 特有事件
     * > 本方法支持 `mousewheel`/`mouseenter`/`mouseleave`/`focusin`/`foucsout` 等 IE 特定事件支持。
     */
    on: function (eventName, delegateSelector, eventListener, scope) {

        var me = this;

        var eventFix = Dom._eventFix || (Dom._eventFix = (function (html) {

            // Firefox: 不支持 mouseenter/mouseleave 事件。
            function mouseFilter(elem, e) {
                // 基于 mouseover 和 mouseout 触发，筛选来自目标的事件。
                // 如果浏览器原生支持 mouseenter/mouseleave，则不执行过滤。
                return e.type.length > 9 || !Dom.contains(elem, e.relatedTarget);
            }

            var eventFix = {
                // mouseenter/mouseleave 事件不支持冒泡，委托时使用 mouseover/mouseout 实现。
                mouseenter: { delegate: "mouseover", filter: mouseFilter },
                mouseleave: { delegate: "mouseout", filter: mouseFilter },

                // focus/blur 事件不支持冒泡，委托时使用 foucin/foucsout 实现。
                focus: { delegate: "focusin" },
                blur: { delegate: "focusout" },

                // 支持直接绑定原生事件。
                'native_click': { bind: "click" },
                'native_mousedown': { bind: 'mousedown' },
                'native_mouseup': { bind: 'mouseup' },
                'native_mousemove': { bind: 'mousemove' }
            };

            // Firefox: 不支持 focusin/focusout 事件。
            if (!("onfocusin" in html)) {
                // 基于事件捕获绑定事件模拟冒泡。
                function focusAdd(elem) {
                    elem.addEventListener(bind, this.bind, true);
                }

                function focusRemove(elem) {
                    elem.addEventListener(bind, this.bind, true);
                }

                eventFix.focusin = { bind: "focus", add: focusAdd, remove: focusRemove };
                eventFix.focusout = { bind: "blur", add: focusAdd, remove: focusRemove };
            }

            // Firefox: 不支持 mousewheel 事件。
            if (!('onmousewheel' in html)) {
                eventFix.mousewheel = {
                    bind: 'DOMMouseScroll',
                    filter: function (elem, e) {
                        // 修正滚轮单位。
                        e.wheelDelta = -(e.detail || 0) / 3;
                    }
                };
            }

            // 触屏上 mouse 相关事件太慢，改用 touch 事件模拟。
            if (window.TouchEvent) {

                function touchFilter(elem, e) {
                    // PC Chrome: 触摸事件的 pageX 和 pageY 始终是 0。
                    if (!e.pageX && !e.pageY && (e.changedTouches || 0).length) {
                        e.__defineGetter__("pageX", function () {
                            return this.changedTouches[0].pageX;
                        });
                        e.__defineGetter__("pageY", function () {
                            return this.changedTouches[0].pageY;
                        });
                        e.__defineGetter__("clientX", function () {
                            return this.changedTouches[0].clientX;
                        });
                        e.__defineGetter__("clientY", function () {
                            return this.changedTouches[0].clientY;
                        });
                        e.__defineGetter__("which", function () {
                            return 1;
                        });
                    }
                }

                function touchAdd(elem, eventName, eventListener) {

                    var eventState = 0;

                    // 绑定委托事件。
                    elem.addEventListener(this.bind, eventListener.proxy1 = function (e) {
                        eventState = 1;
                        return eventListener.call(this, e);
                    }, false);

                    // 绑定原事件。
                    elem.addEventListener(eventName, eventListener.proxy2 = function (e) {
                        if (eventState) {
                            eventState = 0;
                        } else {
                            return eventListener.call(this, e);
                        }
                    }, false);
                }

                function touchRemove(elem, eventName, eventListener) {
                    elem.removeEventListener(this.bind, eventListener.proxy1, false);
                    elem.removeEventListener(eventName, eventListener.proxy2, false);
                }

                // 让浏览器快速响应鼠标点击事件，而非等待 300ms 。
                eventFix.mousedown = {
                    bind: "touchstart",
                    filter: touchFilter,
                    add: touchAdd,
                    remove: touchRemove
                };
                eventFix.mousemove = {
                    bind: "touchmove",
                    filter: touchFilter,
                    add: touchAdd,
                    remove: touchRemove
                };
                eventFix.mouseup = {
                    bind: "touchend",
                    filter: touchFilter,
                    add: touchAdd,
                    remove: touchRemove
                };
                eventFix.click = {
                    filter: touchFilter,
                    add: function (elem, eventName, eventListener) {
                        var eventState = 0;

                        elem.addEventListener("touchstart", eventListener.proxy1 = function (e) {
                            if (e.changedTouches.length === 1) {
                                eventState = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
                            }
                        }, false);

                        elem.addEventListener("touchend", eventListener.proxy2 = function (e) {
                            if (e.changedTouches.length === 1 && eventState && Math.pow(e.changedTouches[0].pageX - eventState[0], 2) + Math.pow(e.changedTouches[0].pageY - eventState[1], 2) < 25) {
                                eventState = 2;
                                return eventListener.call(elem, e);
                            }
                        }, false);

                        elem.addEventListener(eventName, eventListener.proxy3 = function (e) {
                            if (eventState === 2) {
                                eventState = 0;
                            } else {
                                eventState = 0;
                                return eventListener.call(this, e);
                            }
                        }, false);
                    },

                    remove: function (elem, eventName, eventListener) {
                        elem.removeEventListener("touchstart", eventListener.proxy1, false);
                        elem.removeEventListener("touchend", eventListener.proxy2, false);
                        elem.removeEventListener(eventName, eventListener.proxy3, false);
                    }

                };
            }

            return eventFix;
        })(Document.prototype));

        // 支持 .on({...}) 语法简写。
        if (eventName && eventName.constructor === Object) {
            for (eventListener in eventName) {
                var match = /^\w+/.exec(eventListener) || [eventListener];
                me.on(match[0], key.slice(match[0].length), eventName[eventListener], delegateSelector);
            }
            return me;
        }

        typeof console === "object" && console.assert(typeof delegateSelector === "string" || delegateSelector instanceof Function, "dom.on(eventName, [delegateSelector: 必须是字符串或函数], eventListener, [scope])");

        // 允许不传递 delegateSelector 参数。
        if (delegateSelector.constructor !== String) {
            scope = eventListener;
            eventListener = delegateSelector;
            delegateSelector = '';
        }

        typeof console === "object" && console.assert(eventListener instanceof Function, "dom.on(eventName, [delegateSelector], eventListener: 必须是函数, [scope])");

        return me.each(function (elem) {

            // 获取事件列表。
            var events = Dom.data(elem, "events");
            var eventListeners = events[eventName] || (events[eventName] = []);

            // 最后绑定的实际函数。
            var actualListener = eventListener;

            // 获取特殊处理的事件。
            var eventFixer = eventFix[eventName] || 0;

            // 如果满足以下任一要求，则生成代码事件句柄。
            // 1. 定义委托事件。
            // 2. 事件本身需要特殊过滤。
            // 3. 事件重复绑定。（通过代理令事件支持重复绑定）
            // 4. IE8: 默认事件绑定的 this 不正确。
            if ( /*@cc_on !+"\v1" || @*/delegateSelector || scope || eventFixer.filter || eventListeners.indexOf(eventListener) >= 0) {
                actualListener = function (e) {
                    // 实际触发事件的节点。
                    var actucalTarget = elem;

                    // 应用委托节点筛选。
                    if (delegateSelector) {
                        actucalTarget = Dom.closest(e.target, delegateSelector, this);
                        if (!actucalTarget) {
                            return;
                        }
                    }

                    // 处理特殊事件绑定。
                    if (!eventFixer.filter || eventFixer.filter(actucalTarget, e) !== false) {
                        return eventListener.call(scope || actucalTarget, e);
                    }
                };
                actualListener.orignal = eventListener;
            }

            // 更新事件为委托事件。
            if (delegateSelector && eventFixer.delegate) {
                eventFixer = eventFixer[eventName = eventFixer.delegate] || 0;
            }

            // 添加函数句柄。
            eventFixer.add ? eventFixer.add(elem, eventName, actualListener) : elem.addEventListener(eventFixer.bind || eventName, actualListener, false);

            // 添加当前处理函数到列表。以便之后删除事件或触发事件。
            eventListeners.push(actualListener);

        });

    },

    /**
     * 删除当前节点列表每一项一个或多个事件监听器。
     * @param {String} eventName 要删除的事件名。
     * @param {Function} [eventListener] 要删除的事件处理函数。如果未指定则删除全部事件。
     * @example
     * #### 删除指定点击事件
     * $("#elem").off('click', function(){ alert("点击事件") });
     * 
     * #### 删除全部点击事件
     * $("#elem").off('click');
     */
    off: function (eventName, delegateSelector, eventListener) {
        var me = this;

        typeof console === "object" && console.assert(!delegateSelector || typeof delegateSelector === "string" || delegateSelector instanceof Function, "dom.off(eventName, [delegateSelector: 必须是字符串或函数], eventListener)");

        // 允许不传递 delegateSelector 参数。
        if (delegateSelector != null && delegateSelector.constructor !== String) {
            eventListener = delegateSelector;
            delegateSelector = '';
        }

        return me.each(function (elem) {

            // 获取事件列表。
            var eventListeners = Dom.data(elem, "events")[eventName];
            if (eventListeners) {

                // 未指定句柄则删除所有函数。
                if (!eventListener) {
                    for (var i = 0; i < eventListeners.length; i++) {
                        me.off(eventName, eventListeners[i]);
                    }
                    return;
                }

                // 找到已绑定的事件委托。
                var index = eventListeners.indexOf(eventListener);

                // 如果事件被代理了，则找到代理的事件。
                if (index < 0) {
                    for (index = eventListeners.length; index-- && eventListeners[index].orignal !== eventListener;);
                }

                // 更新为实际事件句柄。
                if (~index) {

                    // 获取实际绑定的处理函数。
                    eventListener = eventListeners[index];

                    // 从数组删除。
                    eventListeners.splice(index, 1);

                    // 清空整个事件函数。
                    if (!eventListeners.length) {
                        delete Dom.data(elem, "events")[eventName];
                    }

                }

                // 解析特殊事件。
                if (!Dom._eventFix) {
                    me.on({});
                }
                var eventFixer = Dom._eventFix[eventName] || 0;

                // 删除函数句柄。
                eventFixer.remove ? eventFixer.remove(elem, eventName, eventListener) : elem.removeEventListener((delegateSelector ? eventFixer.delegate : eventFixer.bind) || eventName, eventListener, false);

            }

        });

    },

    /**
     * 触发当前节点列表每一项的指定事件，执行已添加的监听器。
     * @param {String} eventName 要触发的事件名。
     * @param {Object} eventArgs 传递给监听器的事件对象。
     * @example $("#elem").trigger('click')
     */
    trigger: function (eventName, eventArgs) {
        return this.each(function (elem) {

            // 获取事件列表。
            var eventListeners = Dom.data(elem, "events")[eventName];
            if (eventListeners) {

                // 初始化事件参数。
                eventArgs = eventArgs || {};
                eventArgs.type = eventName;
                eventArgs.target = elem;

                // 调用每个函数。
                eventListeners = eventListeners.slice(0);
                for (var i = 0; i < eventListeners.length; i++) {
                    eventListeners[i].call(elem, eventArgs);
                }

            }
        });
    },

    /**
     * 绑定或触发当前节点列表每一项的点击事件。
     * @param {Function} 绑定的事件监听器。 
     * @returns this 
     * @example $("#elem").click()
     */

    /**
     * 绑定或触发当前节点列表每一项的获取焦点事件。
     * @param {Function} 绑定的事件监听器。 
     * @returns this 
     * @example $("#elem").focus()
     */

    /**
     * 绑定或触发当前节点列表每一项的取消焦点事件。
     * @param {Function} 绑定的事件监听器。 
     * @returns this 
     * @example $("#elem").blur()
     */

    // #endregion

    // #region 数组

    /**
     * 设置构造函数。
     * @inner
     */
    constructor: Dom,

    push: [].push,
    indexOf: [].indexOf,
    slice: [].slice,
    splice: [].splice

    // #endregion

};

// #region @事件

Dom.prototype.each.call(['click', 'focus', 'blur'], function (fnName) {
    Dom.prototype[fnName] = function (callback) {
        return callback !== undefined ? this.on(fnName, callback) : this.each(function (elem) {
            elem[fnName] ? elem[fnName]() : Dom(elem).trigger(fnName);
        });
    };
});

// #endregion

// #region @$

/**
 * 提供简短调用形式。
 * @param {Function/String/Node} selector 要执行的 CSS 选择器或 HTML 片段或 DOM Ready 函数。
 * @returns {$} 返回 DOM 对象。
 * @inner
 */
var $ = $ || Dom;

// 支持 Zepto
if ($.fn) {
    $.prototype = $.fn;
}

// #endregion
