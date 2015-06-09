/**
 * @author xuld
 * @fileOverview 为低版本浏览器提供 HTML5 的部分常用函数。
 * @remark 
 * 本文件主要针对 IE8 以及老版本 FireFox, Safari 和 Chrome。
 */

// #region ECMA 5

// http://kangax.github.io/compat-table/es5/

if (!Function.prototype.bind) {

    /**
     * 绑定函数作用域(**this**)。并返回一个新函数，这个函数内的 **this** 为指定的 *scope* 。
     * @param {Object} scope 要绑定的作用域的值。
     * @example
     * <pre>
     * var fn = function(){ trace(this);  };
     * var fnProxy = fn.bind(0);
     * fnProxy()  ; //  输出 0
     * </pre>
     */
    Function.prototype.bind = function (scope) {
        var me = this;
        return function () {
            return me.apply(scope, arguments);
        }
    };

}

if (!Date.now) {

    /**
     * 获取当前时间的数字表示。
     * @return {Number} 当前的时间点。
     * @static
     * @example
     * <pre>
     * Date.now(); //   相当于 new Date().getTime()
     * </pre>
     */
    Date.now = function () {
        return +new Date;
    };

}

if (!Array.isArray) {

    /**
     * 判断一个变量是否是数组。
     * @param {Object} obj 要判断的变量。
     * @return {Boolean} 如果是数组，返回 true， 否则返回 false。
     * @example
     * <pre>
     * Array.isArray([]); // true
     * Array.isArray(document.getElementsByTagName("div")); // false
     * Array.isArray(new Array); // true
     * </pre>
     */
    Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

}

if (!Array.prototype.forEach) {

    /**
     * 遍历当前数组，并对数组的每个元素执行函数 *fn*。
     * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
     *
     * - {Object} value 当前元素的值。
     * - {Number} index 当前元素的索引。
     * - {Array} array 当前正在遍历的数组。
     *
     * 可以让函数返回 **false** 来强制中止循环。
     * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
     * @see #filter
     * @example 以下示例演示了如何遍历数组，并输出每个元素的值。
     * <pre>
     * [2, 5].forEach(function (value, key) {
     * 		trace(value);
     * });
     * // 输出 '2' '5'
     * </pre>
     */
    Array.prototype.forEach = function (fn, scope) {
        return Object.each(this, fn, scope);
    };

    Array.prototype.filter = function (fn, scope) {
        var results = [];
        for (var value, i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                value = this[i];
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
     * @return {String} 处理后的字符串。
     * @remark 目前除了 IE8-，主流浏览器都已内置此函数。
     * @example
     * <pre>
     * "   g h   ".trim(); //  返回     "g h"
     * </pre>
     */
    String.prototype.trim = function () {
        return this.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "");
    };

}

// #endregion

// #region lte IE 8

/*@cc_on if(!+"\v1") {

Array.prototype.indexOf = function (value, startIndex) {
    startIndex = startIndex || 0;
    for (var len = this.length; startIndex < len; startIndex++)
        if (this[startIndex] === value)
            return startIndex;
    return -1;
};

// IE8: 只支持 Document，不支持 HTMLDocument。
var Document = Document || HTMLDocument;

// 让 IE6-8 支持 HTML5 新标签。
'article section header footer nav aside details summary menu'.replace(/\w+/g, function (tagName) {
    document.createElement(tagName);
});
    
XMLHttpRequest = function(){
    return new ActiveXObject("Microsoft.XMLHTTP");
};
    
} @*/

// #endregion

// #region DOM 2

(function (ep, dp) {

    function defineProperty(obj, propName, getter, setter) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, propName, {
                get: getter,
                set: setter
            });
        } else {
            getter && obj.__defineGetter__(propName, getter);
            setter && obj.__defineSetter__(propName, setter);
        }
    }

    // #region lte IE 8

    /*@cc_on if(!+"\v1") {
    
    // 文档。

    defineProperty(dp, 'defaultView',  function () {
        return this.parentWindow;
    });
    
    // 元素。

    defineProperty(ep, 'textContent', function () {
        return this.innerText;
    }, function(value) {
        this.innerText = value;
    });
    
    defineProperty(ep, 'ownerDocument',  function () {
        return this.document;
    });
            
    dp.addEventListener = ep.addEventListener = function (eventName, eventHandler) {
        this.attachEvent('on' + eventName, eventHandler);
    };
    
    dp.removeEventListener = ep.removeEventListener = function (eventName, eventHandler) {
        this.detachEvent('on' + eventName, eventHandler);
    };
    
    // 事件。
    var evtp = Event.prototype;

    evtp.stopPropagation = function () {
        this.cancelBubble = true;
    };
    
    evtp.preventDefault = function () {
        this.returnValue = false;
    };
    
    defineProperty(evtp, 'target', function () {
        return this.srcElement;
    });
            
    defineProperty(evtp, 'relatedTarget', function () {
        return this.toElement || this.fromElement;
    });
            
    defineProperty(evtp, 'which', function () {
        return this.button & 1 ? 1 : (this.button & 2 ? 3 : (this.button & 4 ? 2 : 0));
    });
                    
    defineProperty(evtp, 'pageX', function () {
        return this.x;
    });
                 
    defineProperty(evtp, 'pageY', function () {
        return this.y;
    });
    
    // 区域（Element.prototype.getBoundingClientRect() 返回的对象）。
          
    defineProperty(TextRectangle.prototype, 'width', function () {
        return this.right - this.left;
    });

    defineProperty(TextRectangle.prototype, 'height', function () {
            return this.bottom - this.top;
    });
   
    } @*/

    // #endregion

    if (!ep.matches) {
        ep.matches = ep.matchesSelector || ep.webkitMatchesSelector || ep.msMatchesSelector || ep.mozMatchesSelector || ep.oMatchesSelector || function (selector) {
            var parent = this.parentNode, tempParent = !parent && this.ownerDocument.body;
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
        dp.contains = ep.contains = function (node) {
            for (; node; node = node.parentNode) {
                if (node == this) {
                    return true;
                }
            }
            return false
        };
    }

    if (!('firstElementChild' in ep)) {
        function defineWalker(first, next) {
            next = next ? 'nextSibling' : 'previousSibling';
            defineProperty(ep, first.replace(/([SC])/, 'Element$1'), function () {
                var node = this[first];

                // 找到第一个nodeType == 1 的节点。
                while (node && node.nodeType !== 1) {
                    node = node[next];
                }

                return node;
            });
        }

        defineWalker('firstChild', true);
        defineWalker('lastChild');
        defineWalker('previousSibling');
        defineWalker('nextSibling', true);
    }

    if (!('children' in ep)) {
        defineProperty(ep, 'children', function () {
            return Array.prototype.slice.call(this.childNodes, 0).filter(function (elem) {
                return elem.nodeType === 1;
            });
        });
    }

    if (!('classList' in ep)) {
        defineProperty(ep, 'classList', function () {
            var elem = this;
            return {
                contains: function (className) {
                    return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
                },
                add: function (className) {
                    if ((" " + elem.className + " ").indexOf(className) < 0) {
                        elem.className += ' ' + className;
                    }
                },
                remove: function (className) {
                    elem.className = (" " + elem.className + " ").replace(" " + className + " ", " ").trim();
                },
                toggle: function (className) {
                    this.contains(className) ? this.remove(className) : this.add(className);
                }
            };
        });
    }

})(Element.prototype, Document.prototype);

// #endregion
