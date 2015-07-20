/**
 * @fileOverview 提供 DOM 操作的辅助函数。
 * @author xuld
 */

// #region 核心

/**
 * 查询 CSS 选择器匹配的所有节点；解析一个 HTML 字符串生成对应的节点；绑定一个 DOM Ready 回调。
 * @param {String} selector 要执行的 CSS 选择器或 HTML 字符串或 DOM Ready 回调。
 * @param {Document} context 执行的上下文文档。
 * @return {Dom} 返回匹配的节点列表。
 */
function Dom(selector, context) {
    return new Dom.init(selector || 0, context || document);
}

/**
 * 查询 CSS 选择器匹配的所有节点；解析一个 HTML 字符串生成对应的节点；绑定一个 DOM Ready 回调。
 * @param {String} selector 要执行的 CSS 选择器或 HTML 字符串或 DOM Ready 回调。
 * @param {Document} context 执行的上下文文档。
 * @return {Dom} 返回匹配的节点列表。
 */
Dom.init = function (selector, context) {

    // 解析 HTML 或执行 CSS 选择器
    if (selector.constructor === String) {
        if (/^</.test(selector)) {
            context = context === document ? Dom.init.container || (Dom.init.container = context.createElement('div')) : context.createElement('div');
            context.innerHTML = selector;
            selector = context.childNodes;
        } else
            selector = context.querySelectorAll(selector);
        // 支持 DOM Ready
    } else if (selector.constructor === Function) {
        if (/complete|loaded|interactive/.test(context.readyState) && context.body)
            selector.call(context);
        else {
            /*@cc_on if(!+"\v1") {
            return setTimeout(function() {Dom.init (selector, context);}, 14);
            } @*/
            context.addEventListener('DOMContentLoaded', selector, false);
        }
        return;
    }

    this.add(selector);
};

// #endregion

// #region 公用底层

/**
 * 获取指定节点的数据容器。
 * @param {Element} elem 节点。
 * @returns {Object} 返回存储数据的字段。
 */
Dom.data = function (elem) {
    var datas = Dom._datas || (Dom._datas = {}),
        id = elem.__dataId__ || (elem.__dataId__ = Dom._dataId = Dom._dataId + 1 || 1);
    return datas[id] || (datas[id] = {});
};

/**
 * 获取指定节点及父节点对象中第一个满足指定 CSS 选择器或函数的节点。
 * @param {Node} node 节点。
 * @param {String} selector 用于判断的元素的 CSS 选择器。
 * @param {Node} [context=document] 只在指定的节点内搜索此元素。
 * @return {Node} 如果要获取的节点满足要求，则返回要获取的节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
 */
Dom.closest = function (node, selector, context) {
    while (node && node != context && !node.matches(selector))
        node = node.parentNode;
    return node;
};

/**
 * 为 CSS 属性添加浏览器后缀。
 * @param {Element} elem 要获取的元素。
 * @param {String} cssPropertyName 要处理的 CSS 属性名。
 * @returns {String} 返回已加后缀的 CSS 属性名。
 */
Dom.vendor = function (elem, cssPropertyName) {
    if (!(cssPropertyName in elem.style)) {
        var capName = cssPropertyName.charAt(0).toUpperCase() + cssPropertyName.slice(1),
            prefix;

        for (prefix in { Webkit: 1, Moz: 1, ms: 1, O: 1 }) {
            if ((prefix + capName) in elem.style) {
                return prefix + capName;
            }
        }
    }
    return cssPropertyName;
};

/**
 * 不需要单位的数字 css 属性。
 */
Dom.styleNumbers = {
    columnCount: 1,
    fillOpacity: 1,
    flexGrow: 1,
    flexShrink: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1
};

/**
 * 获取或设置节点的当前 CSS 属性值。
 * @param {Element} elem 要获取或设置的元素。
 * @param {String} name cssPropertyName 属性名或 CSS 字符串。
 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则会自动添加像素单位。
 * @return {String} 返回值。
 */
Dom.css = function (elem, cssPropertyName, value) {

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
    if (value && value.constructor === Number && !(cssPropertyName in Dom.styleNumbers)) {
        value += 'px';
    }

    elem.style[cssPropertyName] = value;

};

/**
 * 计算一个元素的样式表达式。
 * @param {Element} elem 要获取的元素。
 * @param {String} expression 要计算的表达式。其中使用变量代表 CSS 属性值，如 "width+paddingLeft"。
 * @return {Number} 返回计算的值。
 */
Dom.calc = function (elem, expression) {
    /*@cc_on if(!+"\v1") {return eval(expression.replace(/\w+/g, '(parseFloat(Dom.css(elem, "$1")) || 0)'));} @*/
    var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
    return eval(expression.replace(/(\w+)/g, '(parseFloat(computedStyle["$1"])||0)'));
};

// #endregion

// #region @事件

/**
 * 特殊事件集合。
 * @remark
 * 对于特殊处理的事件。每个事件都包含以下信息：
 * 
 * - bindType: 在绑定事件时映射为另一个事件。
 * - delegateType: 在绑定委托事件时映射为另一个事件。
 * - filter: 映射事件触发后判定当前事件是否有效。
 * - add: 自定义事件添加逻辑。
 * - remove: 自定义事件删除逻辑。
 */
Dom.eventFix = (function () {

    var html = document.documentElement,
        eventFix = {
            // mouseenter/mouseleave 事件不支持冒泡，委托时使用 mouseover/mouseout 实现。
            mouseenter: { delegateType: 'mouseover' },
            mouseleave: { delegateType: 'mouseout' },

            // focus/blur 事件不支持冒泡，委托时使用 foucin/foucsout 实现。
            focus: { delegateType: 'focusin' },
            blur: { delegateType: 'focusout' },

            // 支持直接绑定原生事件。
            'native:click': { bindType: 'click' },
            'native:mousedown': { bindType: 'mousedown' },
            'native:mouseup': { bindType: 'mouseup' },
            'native:mousemove': { bindType: 'mousemove' }
        };

    // 部分标准浏览器不支持 mouseenter/mouseleave 事件。
    // 如果浏览器原生支持 mouseenter/mouseleave 则不作过滤。
    if (!('onmouseenter' in html)) {
        eventFix.mouseenter.filter = eventFix.mouseleave.filter = function (elem, e) {
            return !elem.contains(e.relatedTarget);
        };
    }

    // Firefox: 不支持 focusin/focusout 事件。
    if (!('onfocusin' in html)) {
        eventFix.focusin = { bindType: 'focus' };
        eventFix.focusout = { bindType: 'blur' };
        eventFix.focusin.add = eventFix.focusout.add = function (elem, eventName, eventListener) {
            elem.addEventListener(bindType, this.bindType, true);
        };
        eventFix.focusin.remove = eventFix.focusout.remove = function (elem, eventName, eventListener) {
            elem.removeEventListener(bindType, this.bindType, true);
        };
    }

    // Firefox: 不支持 mousewheel 事件。
    if (!('onmousewheel' in html)) {
        eventFix.mousewheel = {
            bindType: 'DOMMouseScroll',
            filter: function (elem, e) {
                // 修正滚轮单位。
                e.wheelDelta = -(e.detail || 0) / 3;
            }
        };
    }

    // 触屏上 mouse 相关事件太慢，改用 touch 事件模拟。
    if (window.TouchEvent) {

        // 让浏览器快速响应鼠标点击事件，而非等待 300ms 。
        eventFix.mousedown = { bindType: 'touchstart' };
        eventFix.mousemove = { bindType: 'touchmove' };
        eventFix.mouseup = { bindType: 'touchend' };
        eventFix.click = {
            bindType: 'touchstart',
            add: function (elem, eventName, eventListener) {
                var firedInTouch = false;

                elem.addEventListener(this.bindType, eventListener.proxyHandler = function (e) {
                    if (e.changedTouches.length === 1) {
                        var touchX = e.changedTouches[0].pageX,
                            touchY = e.changedTouches[0].pageY;
                        elem.addEventListener('touchend', function (e) {
                            elem.removeEventListener('touchend', arguments.callee, true);
                            touchX -= e.changedTouches[0].pageX;
                            touchY -= e.changedTouches[0].pageY;
                            if (touchX * touchX + touchY * touchY <= 25) {
                                firedInTouch = true;
                                return eventListener.call(elem, e);
                            }
                        }, true);
                    }
                }, false);

                elem.addEventListener(eventName, eventListener.orignalHandler = function (e) {
                    if (firedInTouch) {
                        firedInTouch = false;
                    } else {
                        return eventListener.call(this, e);
                    }
                }, false);

            }
        };

        eventFix.mousedown.filter = eventFix.mousemove.filter = eventFix.mouseup.filter = eventFix.click.filter = function (elem, e) {
            // PC Chrome 下触摸事件的 pageX 和 pageY 始终是 0。
            if (!e.pageX && !e.pageY && e.changedTouches && e.changedTouches.length) {
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
        };

        eventFix.mousedown.add = eventFix.mousemove.add = eventFix.mouseup.add = function (elem, eventName, eventListener) {

            var firedInTouch = false;

            // 绑定委托事件。
            elem.addEventListener(this.bindType, eventListener.proxyHandler = function (e) {
                firedInTouch = true;
                return eventListener.call(this, e);
            }, false);

            // 绑定原事件。
            elem.addEventListener(eventName, eventListener.orignalHandler = function (e) {
                if (firedInTouch) {
                    firedInTouch = false;
                } else {
                    return eventListener.call(this, e);
                }
            }, false);
        };

        eventFix.mousedown.remove = eventFix.mousemove.remove = eventFix.mouseup.remove = eventFix.click.remove = function (elem, eventName, eventListener) {
            elem.removeEventListener(this.bindType, eventListener.proxyHandler, false);
            elem.removeEventListener(eventName, eventListener.orignalHandler, false);
        };

    }

    return eventFix;

})();

// #endregion

// #region @特效

Dom.toggleFx = {
    opacity: {
        opacity: 0
    },
    height: {
        overflow: 'hidden',
        marginTop: 0,
        borderTopWidth: 0,
        paddingTop: 0,
        height: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
        marginBottom: 0
    },
    scale: {
        transform: 'scale(0, 0)'
    }
};

// #endregion

Dom.init.prototype = Dom.prototype = {

    // #region 集合操作

    /**
     * 获取当前集合的长度。
     */
    length: 0,

    /**
     * 向当前集合添加一个或多个节点。
     * @param {Node} item 要添加的节点或节点列表。
     */
    add: function (item) {
        if (item)
            if (item.nodeType || item.document)
                this[this.length++] = item;
            else
                for (var i = 0, node; node = item[i]; i++)
                    this[this.length++] = node;
        return this;
    },

    /**
     * 遍历当前集合，并对每个元素执行函数 *callback*。
     * @param {Function} callback 对每个元素运行的函数。函数的参数依次为:
     *
     * - {Node} elem 当前遍历的节点。
     * - {Number} index 当前遍历的索引。
     * - {Array} array 当前集合本身。
     *
     * 可以让函数返回 **false** 来强制中止循环。
     * @param {Object} [scope] 定义 *callback* 执行时 **this** 的值。
     * @return this。
     */
    each: function (callback, scope) {
        for (var i = 0, node; (node = this[i]) && callback.call(scope, node, i, this) !== false; i++);
        return this;
    },

    /**
     * 遍历当前集合，并对每个元素执行函数 *callback*，并将函数返回值放入新集合。
     * @param {Function} callback 对每个元素运行的函数。函数的参数依次为:
     *
     * - {Node} elem 当前遍历的节点。
     * - {Number} index 当前遍历的索引。
     * - {Array} array 当前集合本身。
     *
     * 函数应返回匹配的节点。
     * @param {Object} [scope] 定义 *callback* 执行时 **this** 的值。
     * @return {Dom} 返回新集合。
     */
    map: function (callback, scope) {
        var newDom = Dom(), i = 0, node;
        for (; node = this[i]; i++)
            newDom.add(callback.call(scope, node, i, this));
        return newDom;
    },

    /**
     * 过滤当前节点列表，返回符合要求的元素的新集合。
     * @param {String/Function} selector 过滤的选择器或函数。
     * @param {Object} [scope] 定义 *callback* 执行时 **this** 的值。
     * @return {Dom} 返回新集合。
     */
    filter: function (selector, scope, not) {
        not = not || false;
        return selector ? this.map(function (node) {
            return (selector.constructor === Function ? selector.call(scope, node, i, this) !== false : node.matches(selector)) !== not && node;
        }, this) : this;
    },

    /**
     * 过滤当前节点列表，返回不符合要求的元素的新集合。
     * @param {String/Function} selector 过滤的选择器或函数。
     * @param {Object} [scope] 定义 *callback* 执行时 **this** 的值。
     * @return {Dom} 返回新集合。
     */
    not: function (selector, scope) {
        return this.filter(selector, scope, true);
    },

    // #endregion

    // #region 选择器

    /**
     * 在当前集合中查找指定的元素。
     * @param {String} selector 过滤的选择器。
     */
    find: function (selector) {
        return Dom(this[0] && selector, this[0]);
    },

    /**
     * 检查当前 Dom 对象是否符合指定的表达式。
     * @param {String} selector 判断的选择器。
     * @return {Boolean} 如果匹配表达式就返回 true，否则返回  false 。
     */
    is: function (selector) {
        return this[0] && this[0].matches(selector);
    },

    // #endregion

    // #region @事件

    /**
     * 添加一个事件监听器。
     * @param {String} eventName 要添加的事件名。
     * @param {String} [delegateSelector] 代理目标节点选择器。
     * @param {Function} eventListener 要添加的事件监听器。
     * @param {Object} [scope] 设置回调函数中 this 的指向。
     */
    on: function (eventName, delegateSelector, eventListener, scope) {

        // 允许不传递 delegateSelector 参数。
        if (delegateSelector.constructor !== String) {
            scope = eventListener;
            eventListener = delegateSelector;
            delegateSelector = '';
        }

        return this.each(function (elem) {

            // 获取特殊处理的事件。
            var eventFix = Dom.eventFix[eventName] || 0,

                // 获取存储事件列表的对象。
                datas = Dom.data(elem),
                events = datas.events || (datas.events = {}),
                event = events[eventName] || (events[eventName] = []),

                // 最后绑定的实际函数。
                actualListener = eventListener;

            // 如果满足以下任一要求，则生成代码事件句柄。
            // 1. 定义委托事件。
            // 2. 事件本身需要特殊过滤。
            // 3. 事件重复绑定。（通过代理令事件支持重复绑定）
            // 4. IE8: 默认事件绑定的 this 不正确。
            if (/*@cc_on !+"\v1" || @*/delegateSelector || scope || eventFix.filter || event.indexOf(eventListener) >= 0) {
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
                    if (eventFix.filter && eventFix.filter(actucalTarget, e) === false) {
                        return;
                    }

                    return eventListener.call(scope || actucalTarget, e);

                };

                actualListener.orignal = eventListener;
            }

            // 如果当前事件的委托事件，则先添加选择器过滤器。
            if (delegateSelector && eventFix.delegateType) {
                eventFix = eventFix[eventName = eventFix.delegateType] || 0;
            }

            // 添加函数句柄。
            eventFix.add ? eventFix.add(elem, eventName, actualListener) : elem.addEventListener(eventFix.bindType || eventName, actualListener, false);

            // 添加当前处理函数到集合。以便之后删除事件或触发事件。
            event.push(actualListener);

        });

    },

    /**
     * 删除一个或多个事件监听器。
     * @param {String} eventName 要删除的事件名。
     * @param {Function} [eventListener] 要删除的事件处理函数。
     */
    off: function (eventName, eventListener) {
        return this.each(function (elem) {

            var events = (Dom.data(elem).events || 0)[eventName],
                eventFix;

            // 存在事件则依次执行。
            if (events) {

                // 未指定句柄则删除所有函数。
                if (!eventListener) {
                    for (var i = 0; i < events.length; i++) {
                        this.off(eventName, events[i]);
                    }
                    return;
                }

                // 找到已绑定的事件委托。
                var index = events.indexOf(eventListener);

                // 如果事件被代理了，则找到代理的事件。
                if (index < 0) {
                    for (index = events.length; --index >= 0 && events[index].orignal !== eventListener;);
                }

                if (index >= 0) {

                    // 获取实际绑定的处理函数。
                    eventListener = events[index];

                    // 删除数组。
                    events.splice(index, 1);

                    // 清空整个事件函数。
                    if (!events.length) {
                        delete Dom.data(elem).events[eventName];
                    }

                }

                // 解析特殊事件。
                eventFix = Dom.eventFix[eventName] || 0;

                // 删除函数句柄。
                eventFix.remove ? eventFix.remove(elem, eventName, eventListener) : elem.removeEventListener(eventFix.bindType || eventName, eventListener, false);

            }

        }, this);

    },

    /**
     * 触发当前元素的指定事件，执行已添加的监听器。
     * @param {String} eventName 要触发的事件名。
     * @param {Object} eventArgs 传递给监听器的事件对象。
     */
    trigger: function (eventName, eventArgs) {
        return this.each(function (elem) {
            var events = (Dom.data(elem).events || 0)[eventName],
                handlers;

            if (events) {

                eventArgs = eventArgs || {};
                eventArgs.type = eventName;
                eventArgs.target = elem;

                handlers = events.slice(0);
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].call(elem, eventArgs);
                }

            }
        });
    },

    // #endregion

    // #region @遍历

    /**
     * 获取第一个子节点对象。
     * @param {String/Function} [filter] 用于查找子元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
     * @return {Dom} 返回节点列表。
     */
    first: function (selector) {
        return Dom(this[0] && this[0].firstElementChild).filter(selector);
    },

    /**
     * 获取最后一个子节点对象。
     * @param {String/Function} [filter] 用于查找子元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
     * @return {Dom} 返回节点列表。
     */
    last: function (selector) {
        return Dom(this[0] && this[0].lastElementChild).filter(selector);
    },

    /**
     * 获取下一个相邻节点对象。
     * @param {String/Function} [filter] 用于查找子元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
     * @return {Dom} 返回节点列表。
     */
    next: function (selector) {
        return Dom(this[0] && this[0].nextElementSibling).filter(selector);
    },

    /**
     * 获取上一个相邻的节点对象。
     * @param {String/Function} [filter] 用于查找子元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
     * @return {Dom} 返回节点列表。
     */
    prev: function (selector) {
        return Dom(this[0] && this[0].previousElementSibling).filter(selector);
    },

    /**
     * 获取直接父节点对象。
     * @param {String/Function} [filter] 用于查找子元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
     * @return {Dom} 返回节点列表。
     */
    parent: function (selector) {
        return Dom(this[0] && this[0].parentNode).filter(selector);
    },

    /**
     * 获取全部直接子节点。
     * @param {String/Function} [filter] 用于查找子元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
     * @return {Dom} 返回节点列表。
     */
    children: function (selector) {
        return Dom(this[0] && this[0].children).filter(selector);
    },

    /**
     * 获取指定节点及父节点对象中第一个满足指定 CSS 选择器或函数的节点。
     * @param {Node} node 节点。
     * @param {String} selector 用于判断的元素的 CSS 选择器。
     * @param {Node} [context=document] 只在指定的节点内搜索此元素。
     * @return {Node} 如果要获取的节点满足要求，则返回要获取的节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
     */
    closest: function (selector, context) {
        return Dom(this[0] && Dom.closest(this[0], selector, Dom(context)[0]));
    },

    /**
     * 获取当前节点在父节点的索引。
     * @return {Number} 返回索引。
     */
    index: function () {
        var node = this[0], i = 0;
        if (node) {
            while (node = node.previousElementSibling) i++;
            return i;
        }
    },

    // #endregion

    // #region @增删

    /**
     * 插入一段 HTML 到末尾。
     * @param {String} html 要插入的内容。
     * @return {Dom} 返回插入的新节点对象。
     */
    append: function (html) {
        var parent = this[0];
        return Dom(html, parent && parent.ownerDocument).each(function (node) {
            parent.appendChild(node);
        });
    },

    /**
     * 插入一段 HTML 到顶部。
     * @param {String} html 要插入的内容。
     * @return {Dom} 返回插入的新节点对象。
     */
    prepend: function (html) {
        var parent = this[0], c = parent.firstChild;
        return Dom(html, parent && parent.ownerDocument).each(function (node) {
            parent.insertBefore(node, c);
        });
    },

    /**
     * 插入一段 HTML 到前面。
     * @param {String} html 要插入的内容。
     * @return {Dom} 返回插入的新节点对象。
     */
    before: function (html) {
        var parent = this[0];
        return Dom(html, parent && parent.ownerDocument).each(function (node) {
            parent.parentNode.insertBefore(node, parent);
        });
    },

    /**
     * 插入一段 HTML 到后面。
     * @param {String} html 要插入的内容。
     * @return {Dom} 返回插入的新节点对象。
     */
    after: function (html) {
        return this[0] && this[0].nextSibling ? this.before(html) : this.parent().append(html);
    },

    /**
     * 移除当前节点。
     * @remark
     * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
     */
    remove: function () {
        return this.each(function (node) {
            node.parentNode && node.parentNode.removeChild(node);
        });
    },

    /**
     * 克隆当前节点。
     */
    clone: function (cloneChild) {
        return Dom(this[0] && this[0].cloneNode(cloneChild !== false));
    },

    // #endregion

    // #region @CSS类

    /**
     * 判断是否含指定类名。
     * @param {String} className 一个 CSS 类名。
     * @return {Boolean}
     */
    hasClass: function (className) {
        return this[0] && this[0].classList.contains(className);
    },

    /**
     * 添加指定的 CSS 类名。
     * @param {String} className 一个 CSS 类名。
     * @return this
     */
    addClass: function (className) {
        return this.each(function (elem) {
            elem.classList.add(className);
        })
    },

    /**
     * 从指定节点中删除指定的类。
     * @param {String} className 一个 CSS 类名。
     * @return this
     */
    removeClass: function (className) {
        return this.each(function (elem) {
            elem.classList.remove(className);
        })
    },

    /**
     * 如果存在（不存在）就删除（添加）一个类。
     * @param {String} className 一个 CSS 类名。
     * @return this
     */
    toggleClass: function (className, value) {
        return this.each(function (elem) {
            elem.classList[(value === undefined ? !Dom(elem).hasClass() : value) ? 'add' : 'remove'](className);
        });
    },

    // #endregion

    // #region @样式

    /**
     * 获取或设置 CSS 样式。
     * @param {String} cssPropertyName CSS 属性名。
     * @param {String} value 设置的 CSS 属性值。
     * @return {String} 字符串。
     */
    css: function (cssPropertyName, value) {
        return value === undefined ? this[0] && Dom.css(this[0], cssPropertyName) : this.each(function (elem) {
            Dom.css(elem, cssPropertyName, value);
        });
    },

    // #endregion

    // #region @属性

    /**
	 * 获取或设置属性值。
	 * @param {String} attrName 要获取的属性名称。
	 * @param {String} value 要设置的属性值。当设置为 null 时，删除此属性。
	 * @return {String} 返回属性值。如果元素没有相应属性，则返回 null 。
	 * @static
	 */
    attr: function (attrName, value) {
        var elem = this[0];
        return value === undefined ? elem && (attrName in elem ? elem[attrName] : elem.getAttribute(attrName)) : this.each(function (elem) {
            attrName in elem ? elem[attrName] = value : value === null ? elem.removeAttribute(attrName) : elem.setAttribute(attrName, value);
        });
    },

    /**
	 * 获取或设置文本。
	 * @param {String} value 要设置的文本。
	 * @return {String} 值。对普通节点返回 textContent 属性，对文本框返回 value 属性。
	 */
    text: function (value) {
        return this.attr(this[0] && /^(INPUT|SELECT|TEXTAREA)$/.test(this[0].tagName) ? 'value' : 'textContent', value);
    },

    /**
	 * 获取或设置 HTML。
	 * @param {String} value 要设置的 HTML。
	 * @return {String} 返回内部 HTML 代码。
	 */
    html: function (value) {
        return this.attr('innerHTML', value);
    },

    // #endregion

    // #region @位置

    /**
     * 获取指定节点的区域。
     * @return {DOMRect} 返回所在区域。其包含 left, top, width, height 属性。
     * @remark
     * 此方法对可见和隐藏元素均有效。
     * 获取元素实际占用大小（包括内边距和边框）。
     * @example
     * 获取第一段落实际大小。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.getRect(Dom.find("p:first"));</pre>
     * #####结果:
     * <pre lang="htm" format="none">{left=200,top=100}</pre>
     */
    rect: function (value) {
        if (value === undefined) {
            var elem = this[0];
            if (!elem) return;

            var doc = elem.ownerDocument || elem,
                html = doc.documentElement,
                result = Dom(doc).scroll(),
                rect;

            // 对于 document，返回 scroll 。
            if (elem.nodeType === 9) {
                result.width = html.clientWidth;
                result.height = html.clientHeight;
            } else {
                rect = elem.getBoundingClientRect();
                result.left += rect.left - html.clientLeft;
                result.top += rect.top - html.clientTop;
                result.width = rect.width;
                result.height = rect.height;
            }

            return result;
        }

        return this.each(function (elem) {

            var style = elem.style,
                dom,
                currentPosition,
                offset;

            if (value.top != null || value.left != null) {
                // 确保对象可移动。
                if (!/^(?:abs|fix)/.test(Dom.css(elem, "position")))
                    style.position = "relative";
                dom = Dom(elem);
                currentPosition = dom.rect();
                offset = dom.offset();
                if (value.top != null) style.top = offset.top + value.top - currentPosition.top + 'px';
                if (value.left != null) style.left = offset.left + value.left - currentPosition.left + 'px';
            }

            if (value.width != null || value.height != null) {
                offset = Dom.css(elem, 'boxSizing') === 'border-box';
                if (value.width != null) style.width = value.width - (offset ? 0 : Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight')) + 'px';
                if (value.height != null) style.height = value.height - (offset ? 0 : Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingTop+paddingBottom')) + 'px';
            }

        });
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
     * trace( "left: " + offset.left + ", top: " + offset.top );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
     */
    offset: function () {

        var elem = this[0], left, top;

        if (elem) {

            // 如果设置过 left top，可以很方便地读取。
            left = Dom.css(elem, "left");
            top = Dom.css(elem, "top");

            // 如果未设置过。
            if ((!left || left === "auto" || !top || top === "auto") && Dom.css(elem, "position") === "absolute") {

                // 绝对定位需要返回绝对位置。
                top = this.offsetParent();
                left = this.rect();
                if (top[0].nodeName !== 'HTML') {
                    var t = top.rect();
                    left.left -= t.left;
                    left.top -= t.top;
                }
                left.left -= Dom.calc(elem, 'marginLeft') + Dom.calc(top[0], 'borderLeftWidth');
                left.top -= Dom.calc(elem, 'marginTop') + Dom.calc(top[0], 'borderTopWidth');

                return left;
            }

            // 碰到 auto ， 空 变为 0 。
            return {
                left: parseFloat(left) || 0,
                top: parseFloat(top) || 0
            };

        }

    },

    /**
     * 获取用于让指定节点定位的父对象。
     * @return {Dom} 返回一个节点对象。
     */
    offsetParent: function () {
        var p = this[0];
        if (p) {
            while ((p = p.offsetParent) && p.nodeName !== 'HTML' && Dom.css(p, "position") === "static");
            p = p || this[0].ownerDocument.documentElement;
        }
        return Dom(p);
    },

    /**
     * 获取或设置节点的滚动位置。
     * @param {Point} value 要设置的位置 包含两个整型属性：left 和 top。
     * @return {Point} 返回的对象包含两个整型属性：left 和 top。
     */
    scroll: function (value) {
        if (value === undefined) {
            var elem = this[0], win;
            if (!elem) return;
            if (elem.nodeType == 9) {
                win = elem.defaultView;
                if ('pageXOffset' in win) {
                    return {
                        left: win.pageXOffset,
                        top: win.pageYOffset
                    };
                }
                elem = elem.documentElement;
            }

            return {
                left: elem.scrollLeft,
                top: elem.scrollTop
            };
        }

        return this.each(function (elem) {
            if (elem.nodeType == 9) {
                elem.defaultView.scrollTo(
                    (value.left == null ? Dom(elem).scroll() : value).left,
                    (value.top == null ? Dom(elem).scroll() : value).top
                );
            } else {
                if (value.left != null) elem.scrollLeft = value.left;
                if (value.top != null) elem.scrollTop = value.top;
            }
        });

    },

    // #endregion

    // #region @特效

    /**
     * 基于 CSS 3 实现动画效果。
     * @param {Object} [from] 特效的起始样式。
     * @param {Object} to 特效的结束样式。
     * @param {Function} [callback] 特效执行完成的回调。
     * @param {String} [duration=300] 特效的持续时间。
     * @param {String} [ease="ease-in"] 特效的渐变类型。
     * @param {Boolean} [reset] 是否在特效执行结束后重置样式。
     */
    animate: function (to, callback, duration, ease, reset, reset2) {

        var fxOptions = Dom._fxOptions,
            from;

        // 获取或初始化配置对象。
        if (!fxOptions) {
            Dom._fxOptions = fxOptions = {};
            fxOptions.transition = Dom.vendor(document.documentElement, 'transition');
            fxOptions.supportAnimation = fxOptions.transition in document.documentElement.style;
            fxOptions.transitionEnd = (fxOptions.transition + 'End').replace(fxOptions.transition.length > 10 ? /^[A-Z]/ : /[A-Z]/, function (w) {
                return w.toLowerCase();
            });
        }

        // 提取 from 参数。
        if (callback && callback.constructor !== Function) {
            from = to;
            to = callback;
            callback = duration;
            duration = ease;
            ease = reset;
            reset = reset2;
        }

        // 修补默认参数。
        if (duration == null) duration = 300;
        ease = ease || 'ease-in';

        return this.each(function (elem) {

            // 获取或初始化配置对象。
            var transitionContext = elem.style._transitionContext || (elem.style._transitionContext = {}),
                proxyTimer,
                key,
                proxyCallback = function (e) {

                    // 确保事件不是冒泡的，确保当前函数只执行一次。
                    if ((!e || e.target === e.currentTarget) && proxyTimer) {
                        clearTimeout(proxyTimer);
                        proxyTimer = 0;

                        // 解绑事件。
                        elem.removeEventListener(fxOptions.transitionEnd, proxyCallback, false);

                        // 从上下文中删除回调信息。
                        var transitionContextIsUpdated = false;
                        for (key in transitionContext) {
                            if (transitionContext[key] === proxyCallback) {
                                delete transitionContext[key];
                                transitionContextIsUpdated = true;
                            }
                        }

                        // 如果当前特效执行结束涉及当前的回答，则调用回调函数。
                        if (transitionContextIsUpdated) {

                            // 删除渐变式。
                            updateTransition();

                            // 恢复样式。
                            if (reset) {
                                for (key in to) {
                                    Dom.css(elem, key, '');
                                }
                            }

                            // 执行回调。
                            callback && callback.call(elem, elem);
                        }

                    }

                };

            // 不支持特效，直接调用回调。
            if (!fxOptions.supportAnimation) {
                callback && callback.call(elem, elem);
                return;
            }

            // 设置当前状态为起始状态。
            if (from) {

                // 处理 'auto' -> {} 。
                if (from === 'auto') {
                    from = {};
                    for (key in to) {
                        from[key] = Dom.css(elem, key);
                    }
                }

                // 处理 {} -> 'auto' 。 
                if (to === 'auto') {
                    to = {};
                    for (key in from) {
                        reset2 = transitionContext[key];
                        to[key] = reset2 && reset2.from && key in reset2.from ? reset2.from[key] : Dom.css(elem, key);
                    }
                }

                proxyCallback.from = from;
                for (key in from) {
                    Dom.css(elem, key, from[key]);
                }
            }

            // 触发页面重计算以保证效果可以触发。
            elem.offsetWidth && elem.clientLeft;

            // 更新渐变上下文。
            for (key in to) {
                transitionContext[key] = proxyCallback;
            }

            // 设置渐变样式。
            updateTransition();

            // 绑定渐变完成事件。
            elem.addEventListener(fxOptions.transitionEnd, proxyCallback, false);
            proxyTimer = setTimeout(proxyCallback, duration);

            // 设置 CSS 属性以激活渐变。
            for (key in to) {
                Dom.css(elem, key, to[key]);
            }

            function updateTransition() {
                var transitions = '';
                for (key in transitionContext) {
                    if (transitions) transitions += ',';
                    transitions += key.replace(/([A-Z]|^ms)/g, function (word) {
                        return '-' + word.toLowerCase();
                    }) + ' ' + duration + 'ms ' + ease;
                }
                elem.style[fxOptions.transition] = transitions;
                //elem.style[fxOptions.transition] = 'all ' + ' ' + duration + 'ms ' + ease + ' ' + dalay + 's ';
            }

        });

    },

    /**
     * 判断是否是隐藏。
     * @return {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
     */
    isHidden: function () {
        var elem = this[0];
        return elem && (elem.style._animatingHide || (elem.style.display || Dom.css(elem, 'display')) === 'none');
    },

    /**
     * 通过设置 display 属性来显示元素。
     * @param {Element} [fxName] 使用的特效。
     * @param {Function} [callback] 特效执行完成的回调。
     * @param {String} [duration=300] 特效的持续时间。
     * @param {String} [ease="ease-in"] 特效的渐变类型。
     * @static
     */
    show: function (fxName, callback, duration, ease) {
        fxName = Dom.toggleFx[fxName];
        return this.each(function (elem) {

            // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
            elem.style.display = '';

            // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
            if (Dom.css(elem, 'display') === 'none') {
                var defaultDisplay = elem.style.defaultDisplay;
                if (!defaultDisplay) {
                    var defaultDisplay = Dom._defaultDisplay || (Dom._defaultDisplay = {});
                    defaultDisplay = defaultDisplay[elem.nodeName];
                    if (!defaultDisplay) {
                        var tmp = document.createElement(elem.nodeName);
                        document.body.appendChild(tmp);
                        defaultDisplay = Dom.css(tmp, 'display');
                        if (defaultDisplay === 'none') {
                            defaultDisplay = 'block';
                        }
                        defaultDisplay[elem.nodeName] = defaultDisplay;
                        document.body.removeChild(tmp);
                    }
                }
                elem.style.display = defaultDisplay;
            }

            // 执行特效。
            if (fxName) {
                delete elem.style._animatingHide;
                Dom(elem).animate(fxName, 'auto', callback, duration, ease, true);
            } else {
                callback && callback.call(elem, elem);
            }
        });
    },

    /**
     * 通过设置 display 属性来隐藏元素。
     * @param {Element} [fxName] 使用的特效。
     * @param {Function} [callback] 特效执行完成的回调。
     * @param {String} [duration=300] 特效的持续时间。
     * @param {String} [ease="ease-in"] 特效的渐变类型。
     */
    hide: function (fxName, callback, duration, ease) {
        fxName = Dom.toggleFx[fxName];

        function hideCore(elem) {
            var currentDisplay = Dom.css(elem, 'display');
            if (currentDisplay !== 'none') {
                elem.style.defaultDisplay = currentDisplay;
                elem.style.display = 'none';
            }
            callback && callback.call(elem, elem);
        }

        return this.each(function (elem) {
            if (fxName) {
                elem.style._animatingHide = true;
                Dom(elem).animate('auto', fxName, function (elem) {
                    delete elem.style._animatingHide;
                    hideCore(elem);
                }, duration, ease, true);
            } else {
                hideCore(elem);
            }

        });
    },

    /**
     * 通过设置 display 属性切换显示或隐藏元素。
     * @param {Boolean?} value 要设置的元素。
     * @param {Element} [fxName] 使用的特效。
     * @param {Function} [callback] 特效执行完成的回调。
     * @param {String} [duration=300] 特效的持续时间。
     * @param {String} [ease="ease-in"] 特效的渐变类型。
     * @static
     */
    toggle: function (value) {
        this[(value !== true && value !== false ? this.isHidden() : value) ? 'show' : 'hide'].apply(this, arguments);
    },

    // #endregion

    // #region 数组

    /**
     * 设置构造函数。
     */
    constructor: Dom,

    push: [].push,
    indexOf: [].indexOf,
    slice: [].slice,
    splice: [].splice

    // #endregion

};

// #region @$

if (!this.$) {

    /**
     * 提供简短调用形式。
     * @param {Function/String/Node} selector 要执行的 CSS 选择器或 HTML 片段或 DOM Ready 函数。
     * @return {$} 返回 DOM 对象。
     */
    this.$ = Dom;
}

// #endregion