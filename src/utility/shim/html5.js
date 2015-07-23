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
     * 并返回一个新函数，这个函数执行时的 @this 始终为指定的 @scope。
     * @param {Object} scope 要绑定的作用域的值。
     * @example
     * var fnProxy = function(){ trace(this);  }.bind(0);
     * fnProxy()  ; //  输出 0
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
     * @returns {Boolean} 如果是数组，返回 @true，否则返回 @false。
     * @example
     * Array.isArray([]); // true
     * 
     * 
     * Array.isArray(document.getElementsByTagName("div")); // false
     * 
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
     * 遍历当前数组，并对每个元素执行函数 @fn。
     * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
     *
     * 参数名 | 类型       | 说明
     * value | `Object`  | 当前元素的值。
     * index | `Number`  | 当前元素的索引。
     * array | `Array`   | 当前正在遍历的数组。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @example
     * [2, 5].forEach(function (value, key) {
     * 		console.log(value);
     * }); // 输出 '2' '5'
     * @since ES5
     */
    Array.prototype.forEach = function (fn, scope) {
        for (var i = 0, length = this.length; i < length; i++)
            fn.call(scope, iterable[i], i, iterable);
    };

    /**
     * 过滤指定对象或数组中不满足要求的项，并将结果组成一个新数组。
     * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
     * 
     * 参数名 | 类型       | 说明
     * value | `Object`  | 当前元素的值。
     * index | `Number`  | 当前元素的索引。
     * array | `Array`   | 当前正在遍历的数组。
     * 返回值 | `Boolean` | 用于确定是否满足条件。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @returns {Array} 返回一个新数组。
     * @example [1, 2].filter(function(v){return v > 1;}) // [2]
     * @since ES5
     */
    Array.prototype.filter = function (fn, scope) {
        var results = [];
        for (var value, i = 0, l = this.length; i < l; i++)
            if (i in this) {
                value = this[i];
                if (fn.call(scope, value, i, this))
                    results.push(value);
            }
        return results;
    };

}

if (!String.prototype.trim) {

    /**
     * 去除字符串的首尾空格。
     * @returns {String} 返回新字符串。
     * @example "   g h   ".trim(); //  返回     "g h"
     * @since ES5
     */
    String.prototype.trim = function () {
        return this.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "");
    };

}

// #endregion

// #region lte IE 8

/**
 * 获取指定项在数组内的索引。
 * @param {Object} value 一个类数组对象。
 * @param {Number} [startIndex=0] 转换开始的位置。
 * @returns {Number} 返回索引。如果找不到则返回 -1。
 * @example ["b", "c", "a", "a"].indexOf("a"); // 2
 * @since ES4
 * @member Array.prototype.indexOf
 */

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
            
    window.addEventListener = dp.addEventListener = ep.addEventListener = function (eventName, eventHandler) {
        this.attachEvent('on' + eventName, eventHandler);
    };
    
    window.removeEventListener = dp.removeEventListener = ep.removeEventListener = function (eventName, eventHandler) {
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
                }
            };
        });
    }

})(Element.prototype, Document.prototype);

// #endregion
