/**
 * @fileOverview 为低版本浏览器提供 HTML5 的部分常用函数。
 * @author xuld
 * @remark 
 * 本文件主要针对 IE8 以及老版本 FireFox, Safari 和 Chrome。
 */

// #region ECMA 5

/// @category 语言扩展

if (!Function.prototype.bind) {

    /**
     * 返回一个新函数，这个函数执行时 @this 始终为指定的 @scope。
     * @param {Object} scope 要绑定的 @this 的值。
     * @returns {Function} 返回一个新函数。
     * @example (function(){ return this;  }).bind(0)() // 0
     * @since ES5
     */
    Function.prototype.bind = function (scope) {
        var me = this;
        return function () {
            return me.apply(scope, arguments);
        }
    };

}

if (!Array.isArray) {

    /**
     * 判断一个对象是否是数组。
     * @param {Object} obj 要判断的对象。
     * @returns {Boolean} 如果 @obj 是数组则返回 @true，否则返回 @false。
     * @example
     * Array.isArray([]); // true
     * 
     * Array.isArray(document.getElementsByTagName("div")); // false
     * 
     * Array.isArray(new Array); // true
     * @since ES5
     */
    Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

}

if (!Array.prototype.forEach) {

    /**
     * 遍历当前数组，并对每一项执行函数 @fn。
     * @param {Function} fn 对每个一项执行的函数。函数的参数依次为:
     *
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @example
     * [2, 5].forEach(function (value, index) {
     *      console.log(value);
     * }); // 输出 2  5
     * @since ES5
     */
    Array.prototype.forEach = function (fn, scope) {
        for (var i = 0, length = this.length; i < length; i++) {
            fn.call(scope, this[i], i, this);
        }
    };

    /**
     * 将当前数组中符合要求的项组成一个新数组。
     * @param {Function} fn 用于判断每一项是否符合要求的函数。函数的参数依次为:
     * 
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
     * 
     * @param {Object} [scope] 指定 @fn 执行时 @this 的值。
     * @returns {Array} 返回一个新数组。
     * @example [1, 2].filter(function(v){return v > 1;}) // [2]
     * @since ES5
     */
    Array.prototype.filter = function (fn, scope) {
        var results = [];
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                var value = this[i];
                if (fn.call(scope, value, i, this)) {
                    results.push(value);
                }
            }
        }
        return results;
    };

}

if (!String.prototype.trim) {

    /**
     * 去除字符串的首尾空格。
     * @returns {String} 返回新字符串。
     * @example "   g h   ".trim(); // "g h"
     * @since ES5
     */
    String.prototype.trim = function () {
        return this.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "");
    };

}

// #endregion

// #region lte IE 8

/*@cc_on if(!+"\v1") {

/// 获取指定项在数组内的索引。
/// @param {Object} value 一个类数组对象。
/// @param {Number} [startIndex=0] 转换开始的位置。
/// @returns {Number} 返回索引。如果找不到则返回 -1。
/// @example ["b", "c", "a", "a"].indexOf("a"); // 2
/// @since ES4
Array.prototype.indexOf = Array.prototype.indexOf || function (value, startIndex) {
    startIndex = startIndex || 0;
    for (var len = this.length; startIndex < len; startIndex++) {
        if (this[startIndex] === value) {
            return startIndex;
        }
    }
    return -1;
};

/// 用于创建一个异步请求。
/// @example new XMLHttpRequest()
/// @since ES4
XMLHttpRequest = function(){
    return new ActiveXObject("Microsoft.XMLHTTP");
};

// 让 IE6-8 支持 HTML5 新标签。
'article section header footer nav aside details summary menu'.replace(/\w+/g, function (tagName) {
    document.createElement(tagName);
});
    
// IE8: 只支持 Document，不支持 HTMLDocument。
var Document = Document || HTMLDocument;

} @*/

// #endregion

// #region DOM 2

/// @category DOM 扩展

(function (ep, dp) {

    // 定义一个属性。
    function defineProperty(obj, propName, getter, setter) {
        if (Object.defineProperty)
            return Object.defineProperty(obj, propName, { get: getter, set: setter });
        getter && obj.__defineGetter__(propName, getter);
        setter && obj.__defineSetter__(propName, setter);
    }

    if (!ep.matches) {

        /**
         * 判断当前节点是否匹配指定的选择器。
         * @param {String} selector 要判断的选择器。
         * @returns {Boolean} 如果匹配则返回 @true，否则返回 @false。
         * @example document.body.matches("body")
         * @memberOf Element.prototype
         * @since ES5
         */
        ep.matches = ep.matchesSelector || ep.webkitMatchesSelector || ep.msMatchesSelector || ep.mozMatchesSelector || ep.oMatchesSelector || function (selector) {
            var parent = this.parentNode,
                tempParent = !parent && this.ownerDocument.body;
            tempParent && tempParent.appendChild(this);
            try {
                return Array.prototype.indexOf.call(parent.querySelectorAll(selector), this) >= 0;
            } finally {
                tempParent && tempParent.removeChild(this);
            }
        };
        dp.matches = function () { return false; };

    }

    if (!ep.contains) {

        /**
         * 判断当前节点是否包含指定的子节点。
         * @param {Node} node 要判断的子节点。
         * @returns {Boolean} 如果指定节点是当前节点或其子节点则返回 @true，否则返回 @false。
         * @example document.body.contains(document.body)
         * @memberOf Node.prototype
         * @since ES5
         */
        dp.contains = ep.contains = function (node) {
            for (; node; node = node.parentNode)
                if (node == this)
                    return true;
            return false
        };

    }

    if (!('firstElementChild' in ep)) {

        /**
         * 获取当前元素的第一个子元素。
         * @returns {Element} 返回当前元素的所有直接子节点。如果找不到则返回 @null。
         * @example document.body.firstElementChild
         * @memberOf Element.prototype
         * @name firstElementChild
         * @property
         * @since ES5
         */

        /**
         * 获取当前元素的最后一个子元素。
         * @returns {Element} 返回当前元素的所有直接子节点。如果找不到则返回 @null。
         * @example document.body.lastElementChild
         * @memberOf Element.prototype
         * @name lastElementChild
         * @property
         * @since ES5
         */

        /**
         * 获取当前元素的下一个兄弟元素。
         * @returns {Element} 返回当前元素的所有直接子节点。如果找不到则返回 @null。
         * @example document.body.nextElementSibling
         * @memberOf Element.prototype
         * @name nextElementSibling
         * @property
         * @since ES5
         */

        /**
         * 获取当前元素的上一个兄弟元素。
         * @returns {Element} 返回当前元素的所有直接子节点。如果找不到则返回 @null。
         * @example document.body.previousElementSibling
         * @memberOf Element.prototype
         * @name previousElementSibling
         * @property
         * @since ES5
         */

        function defineWalker(first, next) {
            next = next ? 'nextSibling' : 'previousSibling';
            first = first || next;
            defineProperty(ep, first.replace(/([SC])/, 'Element$1'), function () {
                var node = this[first];
                // 找到第一个nodeType == 1 的节点。
                while (node && node.nodeType !== 1)
                    node = node[next];
                return node;
            });
        }

        defineWalker('firstChild', 1);
        defineWalker('lastChild');
        defineWalker();
        defineWalker(0, 1);
    }

    if (!('children' in ep)) {

        /**
         * 获取当前元素的所有直接子节点。
         * @returns {NodeList} 返回当前元素的所有直接子节点。
         * @example document.body.children
         * @memberOf Element.prototype
         * @name children
         * @property
         * @since ES5
         */
        function children() {
            return Array.prototype.slice.call(this.childNodes, 0).filter(function (elem) {
                return elem.nodeType === 1;
            });
        }

        defineProperty(ep, 'children', children);
        defineProperty(dp, 'children', children);
    }

    if (!('classList' in ep)) {

        /**
         * 获取当前元素的 CSS 类列表。
         * @returns {DomTokenList} 返回当前元素的 CSS 类列表。可对其调用 `add`, `remove`, `contains` 操作 CSS 类。
         * @example document.body.classList
         * @memberOf Element.prototype
         * @since ES5
         */
        defineProperty(ep, 'classList', function () {
            var elem = this;
            return {
                contains: function (className) {
                    return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
                },
                add: function (className) {
                    if ((" " + elem.className + " ").indexOf(className) < 0)
                        elem.className += ' ' + className;
                },
                remove: function (className) {
                    elem.className = (" " + elem.className + " ").replace(" " + className + " ", " ").trim();
                }
            };
        });
    }

    // #region lte IE 8

    /*@cc_on if(!+"\v1") {
    
    // 文档。

    /// 获取当前文档的所属窗口。
    /// @example document.defaultView // window
    /// @since ES4
    defineProperty(dp, 'defaultView', function () { return this.parentWindow;});
    
    // 元素。
    
    /// 获取当前节点的所属文档。
    /// @example document.body.ownerDocument // document
    /// @since ES4
    defineProperty(ep, 'ownerDocument',  function () { return this.document; });

    /// 获取或设置当前元素的内部文本。
    /// @example 
    /// document.body.textContent
    /// document.body.textContent = 'text'
    /// @since ES4
    defineProperty(ep, 'textContent', function () { 
        return this.innerText;
    }, function(value) {
        this.innerText = value;
    });
    
    /// 为当前元素添加指定监听器。
    /// @since ES4
    /// @memberOf Element.prototype
    /// @example document.body.addEventListener('click', function(){}, false)
    window.addEventListener = dp.addEventListener = ep.addEventListener = function (eventName, eventHandler) {
        this.attachEvent('on' + eventName, eventHandler);
    };
    
    /// 为当前元素移除指定监听器。
    /// @since ES4
    /// @memberOf Element.prototype
    /// @example document.body.removeEventListener('click', function(){}, false)
    window.removeEventListener = dp.removeEventListener = ep.removeEventListener = function (eventName, eventHandler) {
        this.detachEvent('on' + eventName, eventHandler);
    };

    // 事件。
    var evtp = Event.prototype;

    /// 阻止当前事件冒泡。
    /// @memberOf Event.prototype
    /// @example 
    /// document.onclick = function(e){ 
    ///     e.stopPropagation();
    /// }
    /// @since ES4
    evtp.stopPropagation = function () {this.cancelBubble = true;};
    
    /// 阻止事件默认行为。
    /// @memberOf Event.prototype
    /// @example 
    /// document.onclick = function(e){ 
    ///     e.preventDefault();
    /// }
    /// @since ES4
    evtp.preventDefault = function () { this.returnValue = false;};
    
    /// 获取事件发生的目标元素。
    /// @memberOf Event.prototype
    /// @name target
    /// @example 
    /// document.onclick = function(e){ 
    ///     console.log(e.target);
    /// }
    /// @since ES4
    defineProperty(evtp, 'target', function () { return this.srcElement; });
            
    /// 获取事件发生的相关元素。
    /// @memberOf Event.prototype
    /// @name relatedTarget
    /// @example 
    /// document.onclick = function(e){ 
    ///     console.log(e.relatedTarget);
    /// }
    /// @since ES4
    defineProperty(evtp, 'relatedTarget', function () { return this.toElement || this.fromElement;});
            
    /// 获取事件发生的鼠标按键。
    /// @memberOf Event.prototype
    /// @name which
    /// @example 
    /// document.onclick = function(e){ 
    ///     console.log(e.which);
    /// }
    /// @since ES4
    defineProperty(evtp, 'which', function () {
        return this.button & 1 ? 1 : (this.button & 2 ? 3 : (this.button & 4 ? 2 : 0));
    });
          
    /// 获取事件发生的鼠标屏幕水平坐标。
    /// @memberOf Event.prototype
    /// @name pageX
    /// @example 
    /// document.onclick = function(e){ 
    ///     console.log(e.pageX);
    /// }
    /// @since ES4
    defineProperty(evtp, 'pageX', function () { return this.x; });
               
    /// 获取事件发生的鼠标屏幕垂直坐标。
    /// @memberOf Event.prototype
    /// @name pageY
    /// @example 
    /// document.onclick = function(e){ 
    ///     console.log(e.pageY);
    /// }
    /// @since ES4
    defineProperty(evtp, 'pageY', function () { return this.y; });
    
    // 区域（Element.prototype.getBoundingClientRect() 返回的对象）。
              
    /// 获取当前区域的宽。
    /// @memberOf TextRectangle.prototype
    /// @name width
    /// @example document.body.getBoundingClientRect().width
    /// @since ES4
    defineProperty(TextRectangle.prototype, 'width', function () {
        return this.right - this.left;
    });
    
    /// 获取当前区域的高。
    /// @memberOf TextRectangle.prototype
    /// @name height
    /// @example document.body.getBoundingClientRect().height
    /// @since ES4
    defineProperty(TextRectangle.prototype, 'height', function () {
            return this.bottom - this.top;
    });
   
    } @*/

    // #endregion

})(Element.prototype, Document.prototype);

// #endregion
