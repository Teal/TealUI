/**
 * @fileOverview 提供 DOM 操作的辅助函数。
 * @author xuld
 */

(function (ep, dp) {

    // #region 全局

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
    NodeList.each = function (nodeList, callback, bind) {
        for (var i = 0, node; node = nodeList[i]; i++) {
            if (callback.call(bind, node, i, nodeList) === false) {
                return false;
            }
        }
        return true;
    };

    var datas = {},
        dataId = 1,
        parseContainer;

    /**
     * 获取指定节点绑定的数据容器。
     * @returns {Object} 返回存储数据的字段。
     */
    Element.getData = function (elem) {
        var id = elem.__dataId__ || (elem.__dataId__ = dataId++);
        return datas[id] || (datas[id] = {});
    };

    /**
     * 设置在当前文档解析完成后的回调函数。
     * @param {Function} callback 当 DOM 解析完成后的回调函数。
     */
    dp.ready = function (callback) {
        var document = this;
        if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
            callback.call(document);
        } else {
            document.addEventListener('DOMContentLoaded', callback, false);
        }
    };

    /**
     * 解析一个 HTML 字符串，返回相应的元素。
     * @param {String} html 要解析的 HTML 字符串。
     * @return {Element} 返回解析得到的子节点。
     */
    dp.parse = function (html) {
        if (typeof html !== 'object') {
            var context = this;
            context = context === document ? parseContainer || (parseContainer = context.createElement('div')) : context.createElement('div');
            context.innerHTML = html;
            html = context.firstChild;
        }
        return html;
    };

    // #endregion

    // #region 选择器

    /**
	 * 执行一个 CSS 选择器，返回匹配的第一个节点。
	 * @param {String} selector 要执行的 CSS 选择器。
	 * @param {Document} context 执行的上下文文档。
	 * @return {Element} 返回匹配的节点。
	 */
    dp.query = ep.query = function (selector) {
        return selector ? selector.constructor === String ? this.querySelector(selector) : selector : null;
    };

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
	 * document.query("p");
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
	 * document.query("div &gt; p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * [ &lt;p&gt;two&lt;/p&gt; ]
	 * </pre>
	 * 
	 * <br>
	 * 查找所有的单选按钮(即: type 值为 radio 的 input 元素)。
	 * <pre>document.query("input[type=radio]");</pre>
	 */
    ep.queryAll = dp.queryAll = function (selector) {
        return selector ? selector.constructor === String ?
            this.querySelectorAll(selector) :
            selector.length !== undefined ? selector : [selector] : [];
    };

    // #endregion

    // #region 事件

    /**
     * 特殊事件集合。
     * @lends Dom
     * @remark
     * 对于特殊处理的事件。每个事件都包含以下信息：
     * 
     * - proxy: 创建封装用户处理程序的代理句柄。在内部判断是否启用该事件。
     * - bindType: 在绑定事件时映射为另一个事件。
     * - delegateType: 在绑定委托事件时映射为另一个事件。
     * - add: 自定义事件添加逻辑。
     * - remove: 自定义事件删除逻辑。
     */
    var eventFix = Element.eventFix = {},
        html = document.documentElement;

    // mouseenter/mouseleave 事件不支持委托。
    // 部分标准浏览器不支持 mouseenter/mouseleave 事件。
    eventFix.mouseenter = { delegateType: 'mouseover' };
    eventFix.mouseleave = { delegateType: 'mouseout' };
    if (html.onmouseenter === undefined) {
        eventFix.mouseenter.filter = eventFix.mouseleave.filter = function (elem, e) {
            // 如果浏览器原生支持 mouseenter/mouseleave 则不作过滤。
            return !elem.contains(e.relatedTarget);
        };
    }

    // focus/blur 事件不支持冒泡，委托时使用 foucin/foucsout 实现。
    eventFix.focus = { delegateType: 'focusin' };
    eventFix.blur = { delegateType: 'focusout' };

    // Firefox: 不支持 focusin/focusout 事件。
    if (html.onfocusin === undefined) {
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
    if (html.onmousewheel === undefined) {
        eventFix.mousewheel = {
            bindType: 'DOMMouseScroll',
            filter: function (elem, e) {
                // 修正滚轮单位。
                e.wheelDelta = -(e.detail || 0) / 3;
            }
        };
    }

    // 支持直接绑定原生事件。
    eventFix['native:click'] = { bindType: 'click' };
    eventFix['native:mousedown'] = { bindType: 'mousedown' };
    eventFix['native:mouseup'] = { bindType: 'mouseup' };
    eventFix['native:mousemove'] = { bindType: 'mousemove' };

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
            if (!e.pageX && !e.pageY && e.changedTouches.length) {
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

    /**
     * 为当前元素添加一个事件监听器。
     * @param {String} eventName 要添加的事件名。
     * @param {String} [targetSelector] 代理目标节点选择器。
     * @param {Function} eventListener 要添加的事件监听器。
     * @param {Object} [scope] 设置回调函数中 this 的指向。
     */
    dp.on = ep.on = function (eventName, targetSelector, eventListener, scope) {
        
        // 允许不传递 proxySelector 参数。
        if (targetSelector.constructor !== String) {
            scope = eventListener;
            eventListener = targetSelector;
            targetSelector = '';
        }

        var elem = this,
            datas = Element.getData(elem),
            events = datas.events || (datas.events = {}),
            eventInfo = events[eventName] || (events[eventName] = []),

            // 获取特殊处理的事件。
            fixer = eventFix[eventName] || 0,

            // 最后绑定的实际函数。
            actualListener = eventListener;

        // 如果满足以下任一要求，则生成代码事件句柄。
        // 1. 定义委托事件。
        // 2. 事件本身需要特殊过滤。
        // 3. 事件重复绑定。（通过代理令事件支持重复绑定）
        // 4. IE8: 默认事件绑定的 this 不正确。
        if (/*@cc_on !+"\v1" || @*/targetSelector || scope || fixer.filter || eventInfo.indexOf(eventListener) >= 0) {
            actualListener = function (e) {

                // 实际触发事件的节点。
                var actucalTarget = elem;

                // 应用委托节点筛选。
                if (targetSelector) {
                    actucalTarget = e.target.closest(targetSelector, this);
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
        if (targetSelector && fixer.delegateType) {
            fixer = eventFix[eventName = fixer.delegateType] || 0;
        }

        // 添加函数句柄。
        fixer.add ? fixer.add(elem, eventName, actualListener) : elem.addEventListener(fixer.bindType || eventName, actualListener, false);

        // 添加当前处理函数到集合。以便之后删除事件或触发事件。
        eventInfo.push(actualListener);

    };

    /**
     * 删除当前元素的一个或多个事件监听器。
     * @param {String} eventName 要删除的事件名。
     * @param {Function} [eventListener] 要删除的事件处理函数。
     */
    dp.off = ep.off = function (eventName, eventListener) {

        var elem = this,
            events = (Element.getData(elem).events || 0)[eventName],
            fixer;

        // 存在事件则依次执行。
        if (events) {

            // 未指定句柄则删除所有函数。
            if (!eventListener) {
                for (var i = 0; i < events.length; i++) {
                    elem.off(eventName, events[i]);
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
                    delete Element.getData(elem).events[eventName];
                }

            }

            // 解析特殊事件。
            fixer = eventFix[eventName] || 0;

            // 删除函数句柄。
            fixer.remove ? fixer.remove(elem, eventName, eventListener) : elem.removeEventListener(fixer.bindType || eventName, eventListener, false);

        }

    };

    /**
     * 触发当前元素的指定事件，执行已添加的监听器。
     * @param {String} eventName 要触发的事件名。
     * @param {Object} eventArgs 传递给监听器的事件对象。
     */
    dp.trigger = ep.trigger = function (eventName, eventArgs) {

        var elem = this,
            events = (Element.getData(elem).events || 0)[eventName],
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
    };

    // #endregion

    // #region 文档遍历

    /**
     * 获取指定节点及父节点对象中第一个满足指定 CSS 选择器或函数的节点。
     * @param {Node} node 节点。
     * @param {String} selector 用于判断的元素的 CSS 选择器。
     * @param {Node} [context=document] 只在指定的节点内搜索此元素。
     * @return {Node} 如果要获取的节点满足要求，则返回要获取的节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
     */
    ep.closest = function (selector, context) {
        var node = this;
        while (node && node != context) {
            if (node.matches(selector)) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    };

    /**
     * 获取当前节点在父节点的索引。
     */
    ep.getIndex = function () {
        var node = this, i = 0;
        while (node = node.previousElementSibling) {
            i++;
        }
        return i;
    };

    // #endregion

    // #region 增删操作

    /**
     * 插入一段 HTML 到末尾。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    ep.append = function (html) {
        for (var node = this, c = html = node.ownerDocument.parse(html), next; c; c = next) {
            next = c.nextSibling;
            node.appendChild(c);
        }
        return html;
    };

    /**
     * 插入一段 HTML 到顶部。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    ep.prepend = function (html) {
        for (var node = this, c = html = node.ownerDocument.parse(html), p = node.firstChild, next; c; c = next) {
            next = c.nextSibling;
            node.insertBefore(c, p);
        }
        return html;
    };

    /**
     * 插入一段 HTML 到前面。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    ep.before = function (html) {
        for (var node = this, c = html = node.ownerDocument.parse(html), p = node.parentNode, next; c; c = next) {
            next = c.nextSibling;
            p.insertBefore(c, node);
        }
        return html;
    };

    /**
     * 插入一段 HTML 到后面。
     * @param {String} html 要插入的内容。
     * @return {Node} 返回插入的新节点对象。
     */
    ep.after = function (html) {
        var node = this;
        return node.nextSibling ? ep.before.call(node.nextSibling, html) : node.parentNode.append(html);
    };

    /**
     * 移除当前节点。
     * @remark
     * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
     * @example
     * 从DOM中把所有段落删除。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>document.query("p").remove();</pre>
     * #####结果:
     * <pre lang="htm" format="none">how are</pre>
     *
     * 从DOM中把带有hello类的段落删除
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>document.query("p").remove();</pre>
     * #####结果:
     * <pre lang="htm" format="none">how are &lt;p&gt;you?&lt;/p&gt;</pre>
     */
    ep.removeSelf = function () {
        var node = this;
        node.parentNode && node.parentNode.removeChild(node);
    };

    // #endregion

    // #region 属性和样式

    /**
     * 为 CSS 属性添加浏览器后缀。
     * @param {String} cssPropertyName 要处理的 CSS 属性名。
     * @returns {String} 返回已加后缀的 CSS 属性名。
     */
    ep.vendorCssPropertyName = function (cssPropertyName) {
        if (!(cssPropertyName in this.style)) {
            var prop = cssPropertyName.replace(/^[a-z]/, function (w) { return w.toUpperCase(); }), prefix;
            for (prefix in { 'Webkit': 1, 'Moz': 1, 'ms': 1, 'O': 1 }) {
                if ((prefix + prop) in this.style) {
                    cssPropertyName = prefix + prop;
                    break;
                }
            }
        }
        return cssPropertyName;
    };

    /**
     * 读取指定节点的当前样式，返回数值。
     * @param {String} camelizedCssPropertyName 已转为骆驼格式的 CSS 属性名。
     * @return {Number} 数值。
     */
    ep.calcStyle = function (cssPropertyName) {
        var elem = this,
            value = elem.style[cssPropertyName];
        return value && (value = parseFloat(value)) != null ? value : (parseFloat(elem.ownerDocument.defaultView.getComputedStyle(elem, '')[cssPropertyName]) || 0);
    };

    /**
	 * 根据不同的内容进行计算。
	 * @param {String} expression 要计算的表达式。其中使用变量代表 CSS 属性值，如 "width+paddingLeft"。
	 * @return {Number} 返回计算的值。
	 * @static
	 */
    ep.calcStyleExpression = function (expression) {
        var elem = this,
            computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
        return eval(expression.replace(/(\w+)/g, '(parseFloat(computedStyle["$1"])||0)'));
    };

    /**
     * 获取指定节点的样式。
     * @param {Element} elem 要获取的元素。
     * @param {String} cssPropertyName CSS 属性名。
     * @return {String} 字符串。
     */
    ep.getStyle = function (cssPropertyName) {
        return this.ownerDocument.defaultView.getComputedStyle(this, '')[this.vendorCssPropertyName(cssPropertyName)];
    };

    /**
     * 获取指定节点的样式。
     * @param {Element} elem 要获取的元素。
     * @param {String} cssPropertyName CSS 属性名。
     * @param {String} value 设置的 CSS 属性值。
     * @return {String} 字符串。
     */
    ep.setStyle = function (cssPropertyName, value) {
        this.style[this.vendorCssPropertyName(cssPropertyName)] = value;
    };

    /**
     * 判断当前元素是否是隐藏的。
     * @param {Element} elem 要判断的元素。
     * @return {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
     */
    ep.isHidden = function () {
        return (this.style.display || this.getStyle('display')) === 'none';
    };

    /**
     * 通过设置 display 属性来显示元素。
     * @param {Element} elem 要处理的元素。
     * @static
     */
    ep.show = function () {

        var elem = this;

        // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
        elem.style.display = '';

        // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
        if (elem.isHidden()) {
            var defaultDisplay = elem.style.defaultDisplay;
            if (!defaultDisplay) {
                var defaultDisplayCache = Element.defaultDisplayCache || (Element.defaultDisplayCache = {});
                defaultDisplay = defaultDisplayCache[elem.nodeName];
                if (!defaultDisplay) {
                    var tmp = document.createElement(elem.nodeName);
                    document.body.appendChild(tmp);
                    defaultDisplay = tmp.getStyle('display');
                    if (defaultDisplay === 'none') {
                        defaultDisplay = 'block';
                    }
                    defaultDisplayCache[elem.nodeName] = defaultDisplay;
                    document.body.removeChild(tmp);
                }
            }
            elem.style.display = defaultDisplay;
        }

    };

    /**
     * 通过设置 display 属性来隐藏元素。
     * @static
     */
    ep.hide = function () {
        var elem = this,
            currentDisplay = elem.getStyle('display');
        if (currentDisplay !== 'none') {
            elem.style.defaultDisplay = currentDisplay;
            elem.style.display = 'none';
        }
    };

    /**
     * 通过设置 display 属性切换显示或隐藏元素。
     * @param {Element} elem 要处理的元素。
     * @param {Boolean?} value 要设置的元素。
     * @static
     */
    ep.toggle = function (value) {
        this[(value !== true && value !== false ? this.isHidden() : value) ? 'show' : 'hide'].apply(this, arguments);
    };

    // #endregion

    // #region lte IE 8

    /*@cc_on if(!+"\v1") {
    
    dp.ready = function(callback){
        var document = this;
        /in/.exec(document.readyState)? setTimeout(function(){
            document.ready(callback);
        }, 14) : callback();
    };
    
    Element.styleFix = {
        height: {
            get: function (elem) {
                return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - elem.calcStyleExpression('borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
            }
        },
        width: {
            get: function (elem) {
                return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - elem.calcStyleExpression('borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
            }
        },
        cssFloat: {
            get: function (elem) {
                return elem.getStyle('styleFloat');
            },
            set: function (elem, value) {
                return elem.setStyle('styleFloat', value);
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
    
    ep.getStyle = function(cssPropertyName){
        
        if(cssPropertyName in Element.styleFix){
            return Element.styleFix[cssPropertyName].get(this);
        }
    
        // currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
        // currentStyle是运行时期样式与style属性覆盖之后的样式
        var elem = this,
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
    };
    
    ep.setStyle = function(cssPropertyName, value){
        var elem = this,
            styleFix = Element.styleFix[cssPropertyName];
        styleFix && styleFix.set ? styleFix.set(elem, value) : (elem.style[cssPropertyName] = value);
    };
    
    ep.calcStyle = function(cssPropertyName){
        var elem = this,
            value = elem.style[cssPropertyName];
        return value && (value = parseFloat(value)) != null ? value : (parseFloat(elem.getStyle(cssPropertyName)) || 0);
    };
    
    ep.calcStyleExpression = function (expression) {
        var elem = this;
        return eval(expression.replace(/\w+/g, 'elem.calcStyle("$1")'));
    };
    
    } @*/

    // #endregion

})(Element.prototype, Document.prototype);

/**
 * 快速调用 document.queryAll 或 document.parse 或 document.ready。
 * @param {Function/String/Node} selector 要执行的 CSS 选择器或 HTML 片段或 DOM Ready 函数。
 * @return {$} 返回匹配的节点列表。
 */
if (!this.$) {
    $ = function (selector, context) {

        // 空参数生成空对象。
        if (!selector) {
            return new $(1);
        }

        if (this instanceof $) {
            for (var i = 0, node; node = selector[i]; i++) {
                this[this.length++] = node;
            }
        } else {
            context = context || document;
            if (selector.constructor === String) {
                return new $(/^</.test(selector) ? context.parse(selector).parentNode.childNodes : context.querySelectorAll(selector));
            }
            if (selector instanceof Function) {
                context.ready(selector);
            }
        }

    };
    $.prototype = [];
}
