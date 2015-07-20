
// #region Dom

/**
 * 表示一组节点列表。
 * @class Dom
 * @param {String} selector 要执行的选择器。
 * @param {Dom} context 执行选择器所在的上下文。
 */
var Dom = (function () {

    // #region 节点增删改查

    /**
     * 获取元素的文档。
     * @param {Element} elem 元素。
     * @returns {Document} 文档。
     * @static
     */
    Dom.getDocument = function getDocument(node) {
        //assert.isNode(node, 'Dom.getDocument(node): {node} ~', node);
        return node.ownerDocument || node.document || node;
    };


    /**
     * 获取当前 Dom 对象以后的全部相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @returns {Dom} 返回一个 Dom 对象。
     */
    Dom.nextAll = function (elem) {
        var r = [], c = elem;
        while (c = Dom.next(c)) {
            r.push(c);
        }
        return r;
    };

    /**
     * 获取当前 Dom 对象以前的全部相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @returns {Dom} 返回一个 Dom 对象。
     */
    Dom.prevAll = function (elem) {
        var r = [], c = elem;
        while (c = Dom.prev(c)) {
            r.push(c);
        }
        return r;
    };

    /**
     * 获取当前 Dom 对象的指定位置的直接子节点。
     * @param {Integer} index 用于查找子元素的 CSS 选择器 或者 元素在 Dom 对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。如果 args 是小于 0 的数字，则从末尾开始计算。
     * @returns {Dom} 返回一个节点对象。如果不存在，则返回 null 。
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

    // #endregion

    // #region jQuery 风格 API

    // Dom 相当于 jQuery 的精简版。
    // 基于 Dom 完成的功能在 jQuery 下均能正常工作。
    // 但基于 jQuery 完成的功能不一定可以使用 Dom 完成。

    function Dom(selector, context) {

        switch ((selector || (selector = [])).constructor) {

            // 选择器或生成 DOM 节点。
            case String:
                return selector[0] === '<' ? Dom.parse(selector, context) : Dom.query(selector, context);

            case Function:
                Dom.ready(selector);
                break;

            case Dom:
                return selector;

            case Array:
                return toDom(selector);

            default:
                return Dom([selector], context);

        }

    }

    function toDom(array) {
        array.__proto__ = Dom.fn;
        return array;
    }

    /**
     * 遍历 Dom 对象，并对每个元素执行 getter 或 setter。
     */
    function access(dom, args, getter, setter) {
        if (args.length > getter.length) {
            for (var i = 0, len = dom.length; i < len; i++) {
                setter(dom[i], args[0], args[1]);
            }
            return this;
        }
        return (dom = dom[0]) && getter(dom, args[0]);
    }

    // 定义所有原型方法。
    Dom.fn = Dom.prototype = {

        // 继承 Array 的原型。
        __proto__: Array.prototype,

        each: function (callback, scope) {
            this.every(callback, scope);
            return this;
        },

        map: function (callback, scope) {
            return toDom(Array.prototype.map.call(this, callback, scope));
        },

        filter: function (selector) {
            if (selector && selector.constructor === Function) return this.not(this.not(selector))
            return $(Array.prototype.filter.call(this, function (element) {
                return zepto.matches(element, selector)
            }));
        },

        /**
         * 删除当前节点。
         */
        remove: function () {
            this.forEach(Dom.remove);
            return this;
        },

        add: function (selector, context) {
            return toDom(this.concat($(selector, context)).unique());
        },

        is: function (selector) {
            return this.length > 0 && zepto.matches(this[0], selector)
        },

        not: function (selector) {
            var nodes = []
            if (isFunction(selector) && selector.call !== undefined)
                this.each(function (idx) {
                    if (!selector.call(this, idx)) nodes.push(this)
                })
            else {
                var excludes = typeof selector == 'string' ? this.filter(selector) :
                (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
                this.forEach(function (el) {
                    if (excludes.indexOf(el) < 0) nodes.push(el)
                })
            }
            return $(nodes)
        },
        has: function (selector) {
            return this.filter(function () {
                return isObject(selector) ?
                    $.contains(this, selector) :
                    $(this).find(selector).size()
            })
        },
        eq: function (idx) {
            return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
        },
        first: function () {
            var el = this[0]
            return el && !isObject(el) ? el : $(el)
        },
        last: function () {
            var el = this[this.length - 1]
            return el && !isObject(el) ? el : $(el)
        },
        find: function (selector) {
            var result, $this = this
            if (!selector) result = []
            else if (typeof selector == 'object')
                result = $(selector).filter(function () {
                    var node = this
                    return emptyArray.some.call($this, function (parent) {
                        return $.contains(parent, node)
                    })
                })
            else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
            else
                result = this.map(function () {
                    return zepto.qsa(this, selector)
                })
            return result
        },
        closest: function (selector, context) {
            var node = this[0], collection = false
            if (typeof selector == 'object') collection = $(selector)
            while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
                node = node !== context && !isDocument(node) && node.parentNode
            return $(node)
        },
        parents: function (selector) {
            var ancestors = [], nodes = this
            while (nodes.length > 0)
                nodes = $.map(nodes, function (node) {
                    if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                        ancestors.push(node)
                        return node
                    }
                })
            return filtered(ancestors, selector)
        },
        parent: function (selector) {
            return filtered(uniq(this.pluck('parentNode')), selector)
        },
        children: function (selector) {
            return filtered(this.map(function () {
                return children(this)
            }), selector)
        },
        contents: function () {
            return this.map(function () {
                return slice.call(this.childNodes)
            })
        },
        siblings: function (selector) {
            return filtered(this.map(function (i, el) {
                return filter.call(children(el.parentNode), function (child) {
                    return child !== el
                })
            }), selector)
        },

        prev: function (selector) {
            return $(this.pluck('previousElementSibling')).filter(selector || '*')
        },
        next: function (selector) {
            return $(this.pluck('nextElementSibling')).filter(selector || '*')
        },

        clone: function () {
            return this.map(Dom.clone);
        },

        html: function () {
            return access(this, arguments, Dom.getHtml, Dom.setHtml);
        },

        text: function (text) {
            return access(this, arguments, Dom.getText, Dom.setText);
        },

        show: function () {
            return this.each(Dom.show);
        },

        hide: function () {
            return this.each(Dom.hide);
        },

        toggle: function (value) {
            return this.each(function (elem) {
                (value === undefined ? Dom.isHidden(elem) : value) ? Dom.show(elem) : Dom.hide(elem);
            });
        },

        attr: function () {
            return access(this, arguments, Dom.getAttr, Dom.setAttr);
        },

        val: function (value) {
            return this.text(value);
        },

        offset: function (coordinates) {
            return access(this, arguments, Dom.getRect, Dom.setRect);
        },

        /**
         * 获取当前节点在 DOM 中的序号。
         */
        index: function () {
            return this[0] && Dom.getIndex(this[0]);
        },

        hasClass: function (name) {
            return this[0] && Dom.hasClass(this[0]);
        },

        addClass: function (className) {
            return this.each(function (elem) {
                Dom.addClass(elem, className);
            });
        },
        removeClass: function (className) {
            return this.each(function (elem) {
                Dom.removeClass(elem, className);
            });
        },
        toggleClass: function (className, value) {
            return this.each(function (elem) {
                (value === undefined ? !Dom.hasClass(elem) : value) ? Dom.addClass(elem, className) : Dom.removeClass(elem, className);
            });
        },
        scrollTop: function (value) {
            return access(this, arguments, Dom.getScrollTop, Dom.setScrollTop);
        },
        scrollLeft: function (value) {
            return access(this, arguments, Dom.getScrollLeft, Dom.setScrollLeft);
        }

    };

    ['focus', 'blur', 'click'].forEach(function (eventName) {
        Dom.fn[eventName] = function (callback) {
            return callback ? this.on(eventName, callback) : this.each(function () {
                try {
                    this[eventName]();
                } catch (e) {
                }
            });
        }
    });


    return Dom;

    // #endregion

})();

var $ = $ || Dom;

(function () {
    var undefined,
        key,
        $,
        classList,
        emptyArray = [],
        slice = emptyArray.slice,
        filter = emptyArray.filter,
        document = window.document,
        elementDisplay = {},
        classCache = {},
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1, 'opacity': 1, 'z-index': 1, 'zoom': 1 },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,
        capitalRE = /([A-Z])/g,

        // special attributes that should be get/set via method calls
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

        adjacencyOperators = ['after', 'prepend', 'before', 'append'],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': document.createElement('tbody'),
            'tbody': table,
            'thead': table,
            'tfoot': table,
            'td': tableRow,
            'th': tableRow,
            '*': document.createElement('div')
        },
        readyRE = /complete|loaded|interactive/,
        simpleSelectorRE = /^[\w-]*$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize,
        tempParent = document.createElement('div'),
        propMap = {
            'tabindex': 'tabIndex',
            'readonly': 'readOnly',
            'for': 'htmlFor',
            'class': 'className',
            'maxlength': 'maxLength',
            'cellspacing': 'cellSpacing',
            'cellpadding': 'cellPadding',
            'rowspan': 'rowSpan',
            'colspan': 'colSpan',
            'usemap': 'useMap',
            'frameborder': 'frameBorder',
            'contenteditable': 'contentEditable'
        }

    zepto.matches = function (element, selector) {
        if (!selector || !element || element.nodeType !== 1) return false
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
            element.oMatchesSelector || element.matchesSelector
        if (matchesSelector) return matchesSelector.call(element, selector)
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~zepto.qsa(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
    }

    function type(obj) {
        return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
    }

    function isFunction(value) {
        return type(value) == "function"
    }

    function isWindow(obj) {
        return obj != null && obj == obj.window
    }

    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE
    }

    function isObject(obj) {
        return type(obj) == "object"
    }

    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }

    function likeArray(obj) {
        return typeof obj.length == 'number'
    }

    function compact(array) {
        return filter.call(array, function (item) {
            return item != null
        })
    }

    function flatten(array) {
        return array.length > 0 ? $.fn.concat.apply([], array) : array
    }

    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
    }

    function classRE(name) {
        return name in classCache ?
            classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    }

    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }

    function children(element) {
        return 'children' in element ?
            slice.call(element.children) :
            $.map(element.childNodes, function (node) {
                if (node.nodeType == 1) return node
            })
    }

    function Dom(selector, context) {

        var dom, constructor;
        if (selector) {
            constructor = selector.constructor;
            if (constructor === String) {
                if (selector[0] == '<') {
                    return Dom.parse(selector);
                } else if (context !== undefined) {
                    // If it's a CSS selector, use it to select nodes.
                    return $(context).find(selector)
                } else {
                    dom = zepto.qsa(document, selector)
                }
            } else if (constructor === Function) {
                dom = Dom.ready(selector);
            } else if (constructor === Array) {
                return toDom(selector);
            }

        } else {
            dom = [];
        }

        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z()
            // Optimize for string selectors
        else if (typeof selector == 'string') {
            selector = selector.trim()
            // If it's a html fragment, create nodes from it
            // Note: In both Chrome 21 and Firefox 15, DOM error 12
            // is thrown if the fragment doesn't begin with <
            if (selector[0] == '<' && fragmentRE.test(selector))
                dom = zepto.fragment(selector, RegExp.$1, context), selector = null
                // If there's a context, create a collection on that context first, and select
                // nodes from there
            else if (context !== undefined) return $(context).find(selector)
                // If it's a CSS selector, use it to select nodes.
            else dom = zepto.qsa(document, selector)
        }
            // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector)
            // If a Zepto collection is given, just return it
        else if (zepto.isZ(selector)) return selector
        else {
            // normalize array if an array of nodes is given
            if (isArray(selector)) dom = compact(selector)
                // Wrap DOM nodes.
            else if (isObject(selector))
                dom = [selector], selector = null
                // If it's a html fragment, create nodes from it
            else if (fragmentRE.test(selector))
                dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
                // If there's a context, create a collection on that context first, and select
                // nodes from there
            else if (context !== undefined) return $(context).find(selector)
                // And last but no least, if it's a CSS selector, use it to select nodes.
            else dom = zepto.qsa(document, selector)
        }
        // create a new Zepto collection from the nodes found
        return zepto.Z(dom, selector)
    }

    var slice = Array.prototype.slice;
    var parseContainer;

    // `$.zepto.Z` swaps out the prototype of the given `dom` array
    // of nodes with `$.fn` and thus supplying all the Zepto functions
    // to the array. Note that `__proto__` is not supported on Internet
    // Explorer. This method can be overriden in plugins.
    zepto.Z = function (dom, selector) {
        dom = dom || []
        dom.__proto__ = $.fn
        dom.selector = selector || ''
        return dom
    }

    // `$.zepto.isZ` should return `true` if the given object is a Zepto
    // collection. This method can be overriden in plugins.
    zepto.isZ = function (object) {
        return object instanceof zepto.Z
    }

    function extend(target, source, deep) {
        for (key in source)
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                    target[key] = {

                    }
                if (isArray(source[key]) && !isArray(target[key]))
                    target[key] = []
                extend(target[key], source[key], deep)
            } else if (source[key] !== undefined) target[key] = source[key]
    }

    var $ = Dom;

    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    $.extend = function (target) {
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        args.forEach(function (arg) {
            extend(target, arg, deep)
        })
        return target
    }

    function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector)
    }

    $.contains = function (parent, node) {
        return parent !== node && parent.contains(node)
    };

    // Generate the `width` and `height` functions
    ;
    ['width', 'height'].forEach(function (dimension) {
        var dimensionProperty =
            dimension.replace(/./, function (m) {
                return m[0].toUpperCase()
            })

        $.fn[dimension] = function (value) {
            var offset, el = this[0]
            if (value === undefined)
                return isWindow(el) ? el['inner' + dimensionProperty] :
                    isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
                    (offset = this.offset()) && offset[dimension]
            else
                return this.each(function (idx) {
                    el = $(this)
                    el.css(dimension, funcArg(this, value, idx, el[dimension]()))
                })
        }
    })

    function traverseNode(node, fun) {
        fun(node)
        for (var i = 0, len = node.childNodes.length; i < len; i++)
            traverseNode(node.childNodes[i], fun)
    }

    // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function (operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append

        $.fn[operator] = function () {
            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
            var argType,
                nodes = $.map(arguments, function (arg) {
                    argType = type(arg)
                    return argType == "object" || argType == "array" || arg == null ?
                        arg : zepto.fragment(arg)
                }),
                parent,
                copyByClone = this.length > 1
            if (nodes.length < 1) return this

            return this.each(function (_, target) {
                parent = inside ? target : target.parentNode

                // convert all methods to a "before" operation
                target = operatorIndex == 0 ? target.nextSibling :
                    operatorIndex == 1 ? target.firstChild :
                    operatorIndex == 2 ? target :
                    null

                var parentInDocument = $.contains(document.documentElement, parent)

                nodes.forEach(function (node) {
                    if (copyByClone) node = node.cloneNode(true)
                    else if (!parent) return $(node).remove()

                    parent.insertBefore(node, target)
                    if (parentInDocument)
                        traverseNode(node, function (el) {
                            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                            (!el.type || el.type === 'text/javascript') && !el.src)
                                window['eval'].call(window, el.innerHTML)
                        })
                })
            })
        }

        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
            $(html)[operator](this)
            return this
        }
    })

    zepto.Z.prototype = $.fn

    // Export internal API functions in the `$.zepto` namespace
    zepto.deserializeValue = deserializeValue
    $.zepto = zepto

    return $
});

// #endregion
