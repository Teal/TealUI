/**
 * @author xuld
 * @fileOverview 为低版本浏览器提供 HTML5 的部分常用函数。
 * @remark 
 * 本文件主要针对 IE6-8 以及老版本 FireFox, Safari 和 Chrome。
 */

// #region ECMA 5

// http://kangax.github.io/compat-table/es5/

if (!Object.defineProperty) {
    Object.defineProperty = function (obj, propName, property) {
        property.get && obj.__defineGetter__(propName, property.get);
        property.set && obj.__defineSetter__(propName, property.set);
    };
}

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

// #region DOM 2

// IE8: 只支持 Document，不支持 HTMLDocument。
/*@cc_on var Document = Document || HTMLDocument; @*/

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
    Document.prototype.matches = function () { return false; };
}

if (!Element.prototype.contains) {
    Document.prototype.contains = Element.prototype.contains = function (node) {
        for (; node; node = node.parentNode) {
            if (node == this) {
                return true;
            }
        }
        return false
    };
}

if (!('firstElementChild' in Element.prototype)) {
    (function (prop, first, next) {
        next = next ? 'nextSibling' : 'previousSibling';
        Object.defineProperty(Element.prototype, prop, {
            get: function () {
                var node = this[first];

                // 找到第一个nodeType == 1 的节点。
                while (node && node.nodeType !== 1) {
                    node = node[next];
                }

                return node;
            }
        });
        return arguments.callee;
    })('firstElementChild', 'firstChild', true)
    ('lastElementChild', 'lastChild');
    ('previousElementSibling', 'previousSibling');
    ('nextElementSibling', 'nextSibling', true);
}

if (!('children' in Element.prototype)) {
    Object.defineProperty(Element.prototype, 'children', {
        get: function () {
            return Array.prototype.slice.call(this.childNodes, 0).filter(function(elem) {
                return elem.nodeType === 1;
            });
        }
    });
}

if (!('classList' in Element.prototype)) {
    Object.defineProperty(Element.prototype, 'classList', {
        get: function () {
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
        }
    });
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

// 让 IE6-8 支持 HTML5 新标签。
'article section header footer nav aside details summary menu'.replace(/\w+/g, function (tagName) {
    document.createElement(tagName);
});

//// IE 6-7 不支持 __defineGetter__ 和 __defineSetter__
//if(!document.__defineGetter__) {
//    Object.defineProperty = function(obj, propName, property){ 
//        obj[propName] = property;
//    };
//}

// 仅为 IE8 提供支持。
if (this.Element) {
    (function(){

        var ep = Element.prototype,
            dp = Document.prototype,
            evtp = Event.prototype,
            trp = TextRectangle.prototype;

        function extendGetter(obj, propName, getter){
            Object.defineProperty(obj.prototype, propName, {
                get: getter
            });
        }
    
        Object.defineProperty(ep, 'textContent', {
            get: function () {
                return this.innerText;
            },
            set: function(value) {
                this.innerText = value;
            }
        });

        extendGetter(Element, 'ownerDocument',  function () {
            return this.document;
        });
        
        dp.addEventListener = ep.addEventListener = function (eventName, eventHandler) {
            this.attachEvent('on' + eventName, eventHandler);
        };

        dp.removeEventListener = ep.removeEventListener = function (eventName, eventHandler) {
            this.detachEvent('on' + eventName, eventHandler);
        };

        evtp.stopPropagation = function () {
            this.cancelBubble = true;
        };

        evtp.preventDefault = function () {
            this.returnValue = false;
        };

        extendGetter(Event, 'target', function () {
            return this.srcElement;
        });
        
        extendGetter(Event, 'relatedTarget', function () {
            return this.toElement || this.fromElement;
        });
        
        extendGetter(Event, 'which', function () {
            return this.button & 1 ? 1 : (this.button & 2 ? 3 : (this.button & 4 ? 2 : 0));
        });
                
        extendGetter(Event, 'pageX', function () {
            return this.x;
        });
             
        extendGetter(Event, 'pageY', function () {
            return this.y;
        });
        
        // 令 Element.prototype.getBoundingClientRect() 返回的对象包含 x, y, width, height 属性。
        Object.defineProperty(trp, "x", { 
            get: function(){ 
                return this.left;
            },
            set: function(value){ 
                var width = this.width;
                this.left = value;
                this.right = value + width;
            }
        });
        
        Object.defineProperty(trp, "y", { 
            get: function(){ 
                return this.top;
            },
            set: function(value){ 
                var height = this.height;
                this.top = value;
                this.bottom = value + height;
            }
        });
                
        Object.defineProperty(trp, "width", { 
            get: function(){ 
                return this.right - this.left;
            },
            set: function(value){ 
                this.right = this.left + value;
            }
        });
             
        Object.defineProperty(trp, "height", { 
            get: function(){ 
                return this.bottom - this.top;
            },
            set: function(value){ 
                this.bottom = this.top + value;
            }
        });

    })();
    
}

} @*/

// #endregion
