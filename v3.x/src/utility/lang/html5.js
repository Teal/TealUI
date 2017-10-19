/**
 * @fileOverview 为低版本浏览器提供 HTML5 的部分常用函数。
 * @author xuld
 * @remark 本组件主要针对 IE8 以及老版本 FireFox, Safari 和 Chrome。
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
     * @param {Function} fn 对每一项执行的函数。函数的参数依次为:
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
        typeof console === "object" && console.assert(fn instanceof Function, "array.forEach(fn: 必须是函数, [scope])");
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
        typeof console === "object" && console.assert(fn instanceof Function, "array.filter(fn: 必须是函数, [scope])");
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

/// @category IE8 补丁

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

var Document = Document || HTMLDocument;

(function (ep, dp, evtp, trp) {

    function createHTML5Tags(doc){
        "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video".replace(/\w+/g, function (tagName) {
            doc.createElement(tagName);
        });
    }

    // 定义一个属性。
    function defineProperty(obj, propName, getter, setter) {
        Object.defineProperty(obj, propName, { get: getter, set: setter });
    }
    
    // 让 IE6-8 支持 HTML5 新标签。
    createHTML5Tags(document);

    dp.createFragment = function(){
        var fragment = this.createDocumentFragment();
        createHTML5Tags(fragment);
        return fragment;
    };

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
    defineProperty(trp, 'width', function () {
        return this.right - this.left;
    });
    
    /// 获取当前区域的高。
    /// @memberOf TextRectangle.prototype
    /// @name height
    /// @example document.body.getBoundingClientRect().height
    /// @since ES4
    defineProperty(trp, 'height', function () {
        return this.bottom - this.top;
    });
   
})(Element.prototype, Document.prototype, Event.prototype, TextRectangle.prototype);

} @*/

// #endregion

// #region IEMobile

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    (function () {
        var msViewportStyle = document.createElement('style')
        msViewportStyle.appendChild(
          document.createTextNode(
            '@-ms-viewport{width:auto!important}'
          )
        )
        document.querySelector('head').appendChild(msViewportStyle)
    })();
}

// #endregion
