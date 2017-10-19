/**
 * 
 * 兼容浏览器：
 *      Chrome 30+
 *      Safari 5+
 *      Firefox 30+
 *      Internet Explorer 11+
 */

// #region 基础工具函数

/**
 * 复制对象的所有属性到其它对象。
 * @param {Object} dest 复制的目标对象。
 * @param {Object} src 复制的源对象。
 * @returns {Object} 返回  *dest *。
 * @example <pre>
 * var a = {v: 3}, b = {g: 2};
 * Object.extend(a, b);
 * trace(a); // {v: 3, g: 2}
 * </pre>
 */
Object.extend = function (dest, src) {
    for (var key in src)
        dest[key] = src[key];
    return dest;
};

/**
 * 遍历一个类数组，并对每个元素执行函数 *fn*。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * 可以让函数返回 **false** 来强制中止循环。
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @returns {Boolean} 如果循环是因为 *fn* 返回 **false** 而中止，则返回 **false**， 否则返回 **true**。
 * @see Array#forEach
 * @example
 * <pre>
 * Object.each({a: '1', c: '3'}, function (value, key) {
 * 		trace(key + ' : ' + value);
 * });
 * // 输出 'a : 1' 'c : 3'
 * </pre>
 */
Object.each = function (iterable, /*Function*/fn, scope/*=window*/) {

    var length;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable && (length = iterable.length) != null && length.constructor === Number) {
        for (var i = 0; i < length; i++)
            if (fn.call(scope, iterable[i], i, iterable) === false)
                return false;
    } else {
        for (var key in iterable)
            if (fn.call(scope, iterable[key], key, iterable) === false)
                return false;
    }

    // 正常结束返回 true。
    return true;
};

/**
 * 格式化指定的字符串。
 * @param {String} formatString 要格式化的字符串。格式化的方式见备注。
 * @param {Object} ... 格式化参数。
 * @returns {String} 格式化后的字符串。
 * @remark 
 * 
 * 格式化字符串中，使用 {0} {1} ... 等元字符来表示传递给 String.format 用于格式化的参数。
 * 如 String.format("{0} 年 {1} 月 {2} 日", 2012, 12, 32) 中， {0} 被替换成 2012，
 * {1} 被替换成 12 ，依次类推。
 * 
 * String.format 也支持使用一个 JSON来作为格式化参数。
 * 如 String.format("{year} 年 {month} 月 ", { year: 2012, month:12});
 * 若要使用这个功能，请确保 String.format 函数有且仅有 2个参数，且第二个参数是一个 Object。
 *
 * 格式化的字符串{}不允许包含空格。
 * 
 * 如果需要在格式化字符串中出现 { 和 }，请分别使用 {{ 和 }} 替代。
 * 不要出现{{{ 和 }}} 这样将获得不可预知的结果。
 * @memberOf String
 * @example <pre>
 * String.format("{0}转换", 1); //  "1转换"
 * String.format("{1}翻译",0,1); // "1翻译"
 * String.format("{a}翻译",{a:"也可以"}); // 也可以翻译
 * String.format("{{0}}不转换, {0}转换", 1); //  "{0}不转换1转换"
 * </pre>
 */
String.format = function (/*String?*/formatString/*, ...*/) {
    var args = arguments;
    return formatString ? formatString.replace(/\{\{|\{(\w+)\}|\}\}/g, function (matched, argName) {
        return argName ? (matched = +argName + 1) ? args[matched] : args[1][argName] : matched[0];
    }) : "";
};

/**
 * 删除当前数组中指定的元素。
 * @param {Object} value 要删除的值。
 * @param {Number} startIndex=0 开始搜索 *value* 的起始位置。
 * @returns {Number} 被删除的值在原数组中的位置。如果要擅长的值不存在，则返回 -1 。
 * @remark
 * 如果数组中有多个相同的值， remove 只删除第一个。
 * @example
 * <pre>
 * [1, 7, 8, 8].remove(8); // 返回 2,  数组变成 [1, 7, 8]
 * </pre>
 *
 * 以下示例演示了如何删除数组全部相同项。
 * <pre>
 * var arr = ["wow", "wow", "J+ UI", "is", "powerful", "wow", "wow"];
 *
 * // 反复调用 remove， 直到 remove 返回 -1， 即找不到值 wow
 * while(arr.remove("wow") >= 0);
 *
 * trace(arr); // 输出 ["J+ UI", "is", "powerful"]
 * </pre>
 */
Array.prototype.remove = function (value, /*Number?*/startIndex) {
    var index = this.indexOf(value, startIndex);
    if (index > 0)
        this.splice(index, 1);
    return index;
};

/**
 * 删除当前数组的重复元素。
 */
Array.prototype.unique = function () {
    return this.filter(function (item, index, arr) {
        return arr.indexOf(item, index + 1) < 0;
    });
};

/**
 * 改写 Date.toString 以实现支持 yyyy/MM/dd hh:mm:ss 格式化时间。
 * @param {String} format 格式。
 * @returns {String} 字符串。
 */
Date.prototype.toString = (function () {
    var nativeToString = Date.prototype.toString,
        formats = {
            d: 'getDate',
            h: 'getHours',
            m: 'getMinutes',
            s: 'getSeconds'
        };

    return function (format) {

        // #assert format is String?

        var me = this;
        return format ? format.replace(/(yy|M|d|h|m|s)\1?/g, function (matched, val) {
            if (val.length > 1) {
                val = me.getFullYear();
                return matched.length > 2 ? val : (val % 100);
            }
            val = val === 'M' ? me.getMonth() + 1 : me[formats[val]]();
            return val <= 9 && matched.length > 1 && ("0" + val) || val;
        }) : nativeToString.call(me);
    }
})();

/**
 * 在当前日期添加指定的天数。
 * @param {Number} value 要添加的天数。
 */
Date.prototype.addDay = function (/*Number*/value) {
    this.setDate(this.getDate() + value);
    return this;
};

/**
 * 表示一个空函数。
 */
Function.empty = function () { };

// #endregion

// #region 类

/**
 * 所有自定义类的基类。
 * @class
 */
function Base() { }

/**
 * 继承当前类创建派生类。
 * @param {Object?} members 子类实例成员列表。其中 contructor 表示类型构造函数。
 * @returns {Function} 返回继承出来的子类。
 * @remark
 * 此函数只实现单继承。不同于真正面向对象的语言，
 * 子类的构造函数默认不会调用父类构造函数，除非子类不存在新的构造函数。
 * 
 * Base.extend 实际上创建一个新的函数，其原型指向 Base 的原型。
 * 由于共享原型链，如果类的成员存在引用成员，则类所有实例将共享它们。
 * 因此创建类型时应避免直接声明引用成员，而是改在构造函数里创建。
 * 
 * 要想在子类的构造函数调用父类的构造函数，可以使用 {@link Base#base} 属性。
 *
 * @example 下面示例演示了如何创建一个子类。
 * <pre>
 *
 * var MyClass = Base.extend({  // 创建一个子类。
 * 	  type: 'a'
 * });
 *
 * var obj = new MyClass(); // 创建子类的实例。
 * </pre>
 */
Base.extend = function (members) {

    // 未指定函数则使用默认构造函数(Object.prototype.constructor)。
    members = members || {};

    // 生成缺省构造函数：直接调用父类构造函数 。
    if (!members.hasOwnProperty("constructor")) {
        members.constructor = function () {
            return arguments.callee.base.apply(this, arguments);
        };
    }

    // 直接使用构造函数作为类型本身。
    var subClass = members.constructor;

    // 设置派生类的基元。
    subClass.__proto__ = this;

    // 绑定基类。
    subClass.base = this;

    // 设置派生类的原型。
    subClass.prototype = members;
    members.__proto__ = this.prototype;

    return subClass;

};

//#region Event

/**
 * 添加一个事件监听器。
 * @param {String} eventName 要添加的事件名。
 * @param {Function} eventListener 要添加的事件监听器。
 * @returns this
 * @example
 * <pre>
 *
 * // 创建一个变量。
 * var a = new Base();
 *
 * // 绑定一个 click 事件。
 * a.on('click', function (e) {
 * 		return true;
 * });
 * </pre>
 */
Base.prototype.on = function (eventName, /*Function*/eventListener) {

    var me = this,

        // 获取存储事件对象的空间。
        events = me.__events__ || (me.__events__ = {}),

        // 获取当前事件对应的函数监听器列表。
        eventListeners = events[eventName];

    // 如果未绑定过这个事件, 则创建列表，否则添加到列表末尾。
    if (eventListeners) {
        eventListeners.push(eventListener);
    } else {
        events[eventName] = [eventListener];
    }

    return me;
};

/**
 * 手动触发一个监听器。
 * @param {String} eventName 要触发的事件名。
 * @param {Object} eventArgs 传递给监听器的事件对象。
 * @returns 如果事件被阻止则返回 false，否则返回 true。
 * @example <pre>
 *
 * // 创建一个实例。
 * var a = new Base();
 *
 * // 绑定一个 click 事件。
 * a.on('click', function (e) {
 * 		return true;
 * });
 *
 * // 手动触发 click， 即执行  on('click') 过的函数。
 * a.trigger('click');
 * </pre>
 */
Base.prototype.trigger = function (eventName, eventArgs) {

    // 检索所有绑定的事件监听器。
    var eventListeners = this.__events__;
    if (eventListeners && (eventListeners = eventListeners[eventName])) {
        eventListeners = eventListeners.slice(0);
        for (var eventListener, i = 0; eventListener = eventListeners[i]; i++) {
            if (eventListener.call(this, eventArgs) === false) {
                return false;
            }
        }
    }

    return true;

};

/**
 * 删除一个或多个事件监听器。
 * @param {String?} eventName 要删除的事件名。如果不传递此参数，则删除全部事件的全部监听器。
 * @param {Function?} eventListener 要删除的事件处理函数。如果不传递此参数，在删除指定事件的全部监听器。
 * @returns this
 * @remark
 * 注意: `function () {} !== function () {}`, 这意味着下列代码的 off 将失败:
 * <pre>
 * elem.on('click', function () {});
 * elem.off('click', function () {});   // 无法删除 on 绑定的函数。
 * </pre>
 * 正确的做法是把函数保存起来。 <pre>
 * var fn =  function () {};
 * elem.on('click', fn);
 * elem.off('click', fn); // fn  被成功删除。
 *
 * 如果同一个 *eventListener* 被增加多次， off 只删除第一个。
 * </pre>
 * @example
 * <pre>
 *
 * // 创建一个实例。
 * var a = new Base();
 *
 * var fn = function (e) {
 * 		return true;
 * };
 *
 * // 绑定一个 click 事件。
 * a.on('click', fn);
 *
 * // 删除一个 click 事件。
 * a.off('click', fn);
 * 
 * </pre>
 */
Base.prototype.off = function (eventName, /*Function?*/eventListener) {

    // 获取本对象 本对象的数据内容 本事件值
    var me = this,
        events = me.__events__,
        eventListeners;

    if (events) {

        // 获取指定事件的监听器。
        if (eventListeners = events[eventName]) {

            // 如果删除特定的处理函数。
            // 搜索特定的处理函数。
            if (eventListener) {
                eventListeners.remove(eventListener);
                eventListener = eventListeners.length;
            }

            // 如果不存在任何事件，则直接删除整个事件处理器。
            if (!eventListener) {
                delete events[eventName];
            }

        } else if (!eventName) {
            events = null;
        }

    }

    for (eventName in events) {
        return me;
    }

    delete me.__events__;
    return me;
};

//#endregion

// #endregion

// #region 查询字符串解析

/**
 * 提供处理查询字符串的方法。
 * @class
 * @static
 */
var QueryString = {

    /**
     * 解析查询字符串为对象。
     * @param {String} value 要解析的字符串。
     * @returns {Object} 已解析的对象。
     */
    parse: function (/*String*/value) {
        var r = {
        };
        if (value) {
            value.replace(/\+/g, '%20').split('&').forEach(function (value, key) {
                value = value.split('=');
                key = value[0];
                value = value[1];

                try {
                    key = decodeURIComponent(key);
                    value = decodeURIComponent(value);
                } catch (e) {
                }

                if (r.hasOwnProperty(key)) {
                    if (r[key].constructor === String) {
                        r[key] = [r[key], value];
                    } else {
                        r[key].push(value);
                    }
                } else {
                    r[key] = value;
                }
            });
        }
        return r;
    },

    /**
     * 将指定对象格式化为字符串。
     * @param {Object} obj 要格式化的对象。
     * @returns {String} 已处理的字符串。
     */
    stringify: function (obj, /*String?*/name) {

        if (obj && typeof obj === 'object') {
            var s = [];
            Object.each(obj, function (value, key) {
                s.push(QueryString.stringify(value, name || key));
            });
            obj = s.join('&');
        } else if (name) {
            obj = encodeURIComponent(name) + "=" + encodeURIComponent(obj);
        }

        return obj;
    },

    /**
     * 获取 URL 上的查询字符串部分。
     * @param {String} url 要获取的地址。
     */
    getQuery: function (url) {
        var p = url.indexOf('?');
        return p >= 0 ? QueryString.parse(url.substr(p + 1)) : {
        };
    },

    /**
     * 在指定地址追加一段查询字符串参数。
     * @param {String} url 要追加参数的地址。
     * @param {String} query 要查询的字符串参数。
     * @returns {String} 已添加的字符串。
     */
    append: function (/*String*/url, /*String?*/query) {
        if (query) {
            url = (url + '&' + query).replace(/[&?]{1,2}/, '?');
        }
        return url;
    }

};

// #endregion

// #region 模板引擎

/**
 * 表示一个 JavaScript 模板解析器。
 * @class Tpl
 * @example Tpl.parse("{if $data === 1}OK{end}", 1); //=> OK
 * @remark 模板语法介绍:
 * 在模板中，可以直接书写最终生成的文本内容，并通过 { 和 } 在文本中插入逻辑代码。
 * 如：
 *      hello {if a > 0} world {end}
 * 其中 {if a > 0} 和 {end} 是模板内部使用的逻辑表达式，用于控制模板的输出内容。
 * 
 * 模板内可以使用的逻辑表达式有：
 * 1. if 语句
 *      {if 表达式} 
 *          这里是 if 成功输出的文本 
 *      {else if 表达式}
 *          这里是 else if 成功输出的文本 
 *      {else}
 *          这里是 else 成功输出的文本 
 *      {end}
 * 
 * 2. for 语句
 *      {for(var key in obj)}
 *          {循环输出的内容}
 *      {end}
 *      {for(var i = 0; i < arr.length; i++)}
 *          {循环输出的内容}
 *      {end}
 * 
 * 3. while 语句
 *      {while 表达式}
 *          {循环输出的内容}
 *      {end}
 * 
 * 4. function 语句
 *      {function fn(a, b)}
 *          {函数主体}
 *      {end}
 * 
 * 5. var 语句
 *      {var a = 1, b = 2}
 * 
 * 6. for each 语句
 *    为了简化循环操作，模板引擎提供了以相同方式遍历类数组和对象的流程语句。
 *    其写法和 for 语句类似，和 for 语句最大的区别是 for each 语句没有小括号。
 *      {for item in obj}
 *          {循环输出的内容}
 *      {end}
 *    for each 语句同时支持类数组和对象，item 都表示遍历的值， $key 表示数组索引或对象键。
 *    在 for each 语句中，可以使用 $target 获取当前遍历的对象，使用 $key 获取循环变量值。
 *    存在嵌套 for each 时，它们分别表示最近的值，如需跨语句，可使用变量保存。
 *    在 for each 语句中，可以使用 {break} 和 {continue} 控制流程。
 *      {for item in obj}
 *          {if $key == 0}
 *              {continue}
 *          {end}
 *          {for item2 in item}
 *              {item2}
 *          {end}
 *      {end}
 * 
 * 在模板内如果需要插入 { 和 } 本身，分别写成 {{ 和 }}。
 * 在模板内使用 $data 表示传递给 Tpl.parse 的第2个参数。
 * 
 */
var Tpl = {

    _cache: {
    },

    /**
     * 编译指定的模板。
     * @param {String} tplSource 要编译的模板文本。
     * @param {String?} cacheKey = tplSource 表示当前模板的键，主要用于缓存。
     */
    compile: function (/*String*/tplSource, /*String?*/cacheKey) {
        cacheKey = cacheKey || tplSource;
        return Tpl._cache[cacheKey] || (Tpl._cache[cacheKey] = Tpl._compile(tplSource));
    },

    /**
     * 使用指定的数据解析模板，并返回生成的内容。
     * @param {String} tplSource 要解析的模板文本。
     * @param {Object} data 数据。
     * @param {Object} scope 模板中 this 的指向。
     * @param {String?} cacheKey = tplSource 表示当前模板的键，主要用于缓存。
     * @returns {String} 返回解析后的模板内容。 
     */
    parse: function (/*String*/tplSource, data, scope/*=window*/, /*String?*/cacheKey) {
        return Tpl.compile(tplSource, cacheKey).call(scope, data);
    },

    _compile: function (/*String*/tplSource) {

        // #region 词法分析

        // parts = [字符串1, 代码块1, 字符串2, 代码块2, ...]
        var parts = ['var $output=[]'],

            // 下一个 { 的开始位置。
            blockStart = -1,

            // 上一个 } 的结束位置。
            blockEnd = -1,

            // 标记是否是普通文本。
            isPlainText,

            // 存储所有代码块。
                     commandStack = [];

        while ((blockStart = tplSource.indexOf('{', blockStart + 1)) >= 0) {

            // 忽略 {{。
            if (tplSource[blockStart + 1] === '{') {
                blockStart++;
                continue;
            }

            // 处理 { 之前的内容。
            parts.push(tplSource.substring(blockEnd + 1, blockStart));

            // 从  blockStart 处搜索 }
            blockEnd = blockStart;

            // 搜索 }。
            while (true) {
                blockEnd = tplSource.indexOf('}', blockEnd + 1);

                // 处理不存在 } 的情况。
                if (blockEnd == -1) {
                    Tpl._reportError("缺少 “}”", tplSource.substr(blockStart));
                    blockEnd = tplSource.length;
                    break;
                }

                // 忽略 }}。
                if (tplSource[blockEnd + 1] !== '}') {
                    break;
                }

                blockEnd++;
            }

            // 处理 {} 之间的内容。
            parts.push(tplSource.substring(blockStart + 1, blockEnd));

            // 更新下一次开始查找的位置。
            blockStart = blockEnd;

        }

        // 处理 } 之后的内容。
        parts.push(tplSource.substring(blockEnd + 1, tplSource.length));

        // #endregion

        // #region 生成代码片段

        for (var i = 1; i < parts.length; i++) {
            var part = parts[i],
                stdCommands,
                subCommands;
            if (isPlainText = !isPlainText) {
                part = '$output.push(\'' + part.replace(/[\"\\\n\r]/g, Tpl._replaceSpecialChars) + '\')';
            } else if (stdCommands = /^\s*(\w+)\b/.exec(part)) {
                switch (stdCommands[1]) {
                    case 'end':
                        if (!commandStack.length) {
                            throw new SyntaxError("发现多余的{end}\r\n在“" + parts[i - 1] + "”附近")
                        }
                        if (commandStack.pop() === 'foreach') {
                            part = '},this)';
                        } else {
                            part = '}';
                        }
                        break;
                    case 'for':
                        if (subCommands = /^\s*for\s*(var)?\s*([\w$]+)\s+in\s+(.*)$/.exec(part)) {
                            commandStack.push('foreach');
                            part = 'Object.each(' + subCommands[3] + ',function(' + subCommands[2] + ',$key,$target){';
                            break;
                        }
                        commandStack.push('for');
                        part += '{';
                        break;
                    case 'if':
                    case 'while':
                    case 'with':
                        // 追加判断表达式括号。
                        part = stdCommands[1] + '(' + part.substr(stdCommands[0].length) + '){';
                        commandStack.push(stdCommands[1]);
                        break;
                    case 'else':
                        subCommands = /if(.*)/.exec(part);
                        part = subCommands ? '}else if(' + subCommands[1] + ') {' : '}else{';
                        break
                    case 'var':
                        break;
                    case 'function':
                        part += '{';
                        commandStack.push(stdCommands[1]);
                        break;
                    case 'break':
                    case 'continue':
                        if (commandStack[commandStack.length - 1] === 'foreach') {
                            part = stdCommands[1].length === 5 ? 'return false' : 'return';
                        }
                        break;
                    default:
                        part = '$output.push(' + part + ')';
                }
            } else {
                part = '$output.push(' + part + ')';
            }
            parts[i] = part;
        }

        parts.push('return $output.join("")');

        // #endregion

        // #region 返回函数

        tplSource = parts.join('\n').replace(/([{}])\1/g, '$1');

        try {
            if (commandStack.length) {
                throw new SyntaxError("缺少 " + commandStack.length + " 个 {end}");
            }
            return new Function("$data", tplSource);
        } catch (e) {
            var message = e.message;
            message += parts[e.lineNumber - 1] ? '\r\n在“' + parts[e.lineNumber - 1] + '”附近' : '\r\n源码：' + tplSource;
            throw new SyntaxError(message);
        }

        // #endregion

    },

    _replaceSpecialChars: function (specialChar) {
        return Tpl._specialChars[specialChar];
    },

    _specialChars: {
        '"': '\\"',
        '\n': '\\n',
        '\r': '\\r',
        '\\': '\\\\'
    }

};

// #endregion

// #region App

/**
 * 提供管理整个应用的相关函数。
 * @class
 * @static
 */
var App = {

    /**
     * 让 App 支持事件相关函数。
     */
    __proto__: Base.prototype,

    /**
     * 当前应用的版本。通过版本号以区分不同版本的文件。
     * @type {String}
     */
    version: '1.0',

    /**
     * 存储所有已加载的页面。
     * @type {Object}
     */
    _pages: {},

    /**
     * 获取最后被激活的页面。
     * @type {App.Page}
     */
    activePage: null,

    /**
     * 获取或设置当前正显示的页面。
     * @type {App.Page}
     */
    currentPage: null,

    /**
     * 打开指定的 URL 。
     * @param {String} url 要打开的地址。
     * @param {String|Object} params 要传递的参数。
     * @param {Numbeer?} pageType = 0 指示载入的页面类型。0：完整页面；1：更新页面；2：页面片段。
     * @param {Boolean} forceGet = false 指示是否忽略缓存强制刷新。
     */
    go: function (url, params, pageType, forceGet, isAbsoluteUrl) {

        if (params) {
            url = QueryString.append(url, QueryString.stringify(params));
        }

        // 重写并统一 URL 地址。
        url = App.urlRewrite(url, 0);

        // 判断访问的 URL 是否是跨站点访问。
        var urlInfo = /^(\w+:)?\/\/([^\/]+)/.exec(url);
        if (urlInfo) {
            // NOTE:修改此处以支持虚拟目录跳转。
            if (urlInfo[2] != location.host) {
                location.href = url;
                return;
            }
            isAbsoluteUrl = true;
        }

        // 处理 javascript:
        if (/^javascript:/.test(url)) {
            window["eval"].call(window, url.substr(11)); // "javascript:".length == 11
            return;
        }

        // 将 URL 转为绝对路径。
        if (!isAbsoluteUrl) {
            var a = App._anchor || (App._anchor = document.createElement('a'));
            a.href = url;
            url = a.href;
        }

        // 处理哈希地址。
        if (url.indexOf('#') >= 0 && url.replace(/#.*$/, "") === location.href.replace(/#.*$/, "")) {
            location.href = url;
            return;
        }

        // 真正打开页面逻辑。
        App._open(url, pageType, forceGet);

    },

    /**
     * 实现对指定的 URL 进行重写。
     * @param {String} url 要重写的 URL。
     * @param {Number} urlType 指示页面类型。0：HTML 文件；1：JavaScript 文件:2：CSS文件；3：后台数据接口。
     */
    urlRewrite: function (/*String*/url, /*Number*/urlType) {

        // 更新 ~/。
        url = url.replace(/^~\//, '/');

        // 更新主页。
        if (urlType === 0) {
            url = url.replace(/\/(\?|#|$)/, '/index.html$1');
        }

        return url;
    },

    /**
     * 打开指定的页面。
     * @param {String} pageAbsoluteUrl 要打开的页面完整路径。页面地址不允许跨域。
     * @param {Numbeer?} pageType = 0 指示载入的页面类型。0：完整页面；1：更新页面；2：页面片段。
     * @param {Boolean?} forceGet = false 指示是否忽略缓存强制刷新。
     */
    _open: function (pageAbsoluteUrl, pageType, forceGet) {

        // 创建页面实例对象。
        var newPage = App._pages[pageAbsoluteUrl],
            oldPage = App.activePage;
        if (!newPage || forceGet) {
            App._pages[pageAbsoluteUrl] = newPage = new App.Page(pageAbsoluteUrl);
        }

        App.trigger('changing', newPage);

        // 如果正在打开指定页面，则无需操作。
        // 通知老页面隐藏。
        if (oldPage === newPage || !App.currentPage.trigger('hide', newPage)) {
            return false;
        }

        // 更新页面类型。
        if (pageType != undefined) {
            newPage.type = pageType;
        }

        // 更新最后打开的页面。
        // 页面可能在加载完成之前就被其它页面代替。
        App.activePage = newPage;

        // 开始加载新页面。

        // 如果页面相关的文件都已加载。则直接显示页面。
        if (newPage.readyState > 2) {
            newPage.show();
        } else {

            // 第一次载入页面需要显示载入框。
            // 如果最后一个页面正在加载，则说明已经打开了载入框。
            if (oldPage.readyState > 2) {
                App.currentPage.doToggleLoading(true);
            }

            // 如果页面未加载，则先加载页面。
            if (newPage.readyState === 0) {

                // 开始载入 HTML。
                newPage.readyState = 1;

                // 真正加载页面。
                App.ajax(QueryString.append(newPage.url, '_=' + App.version), 'GET', null, function (html) {

                    // 创建新容器。
                    var container = document.createElement('div');
                    container.innerHTML = html;

                    // 更新标题。
                    var title = container.getElementsByTagName('title')[0];
                    if (title) {
                        newPage.title = title.innerHTML;
                    }

                    // 搜索容器。
                    newPage.elem = container = pageType !== 2 && container.getElementsByClassName('x-page')[0] || container;

                    // 默认隐藏容器。
                    container.style.display = 'none';

                    // 插入页面代码，执行页面代码。
                    oldPage.elem.parentNode.appendChild(container);

                    // 标记 HTML 已加载，现在需要加载 JS。
                    newPage.readyState = 2;

                    // 开始载入页面相关的 JS。
                    newPage._unloadedScripts = Array.prototype.slice.call(container.getElementsByTagName('SCRIPT'), 0);
                    App._startLoadScriptTask();

                }, null, App.sessions, newPage.filePath);

            } else if (newPage.readyState === 2) {
                // 页面正在加载 JS 时被强制终止，继续加载它。
                App._startLoadScriptTask();
            }

        }

        return true;
    },

    /**
     * 指示执行脚本加载任务的页面。
     */
    _loadingPage: null,

    /**
     * 开始执行下一个脚本加载的任务。
     */
    _startLoadScriptTask: function () {
        if (!App._loadingPage) {
            App._executeNextLoadScriptTask();
        }
    },

    /**
     * 负责执行下一个脚本加载的任务。
     */
    _executeNextLoadScriptTask: function () {

        // 本函数为页面加载的驱动函数。
        // _startLoadScriptTask 负责保证同时仅加载一个页面。
        // _executeNextLoadScriptTask 每次仅加载最后需要打开的页面。
        // 如果正在打开 A 页面时，需要打开 B 页面，则等待 A 的当前任务加载完成后，
        // 忽略 A 的剩余页面，直接加载 B 页面。
        // 等待下一次重新打开 A 页面时再继续加载 A 剩下的页面。

        var page = App._loadingPage = App.activePage,
            scripts = page._unloadedScripts;

        // 如果全部脚本都已加载完。
        if (!scripts || !scripts.length) {

            // 标记当前任务执行完毕，可以继续执行其它任务。
            App._loadingPage = null;

            // 标记页面内容已加载。
            delete page._unloadedScripts;

            // 通知页面已加载。
            page.trigger('ready', page);
            page.readyState = 3;
            page.show();
        } else {
            var script = scripts.shift();
            if (script.type && script.type !== 'text/javascript') {
                App._executeNextLoadScriptTask();
            } else if (script.src) {
                App.loadScript(script.src, App._executeNextLoadScriptTask, script);
            } else {
                window["eval"].call(window, script.innerHTML);
                App._executeNextLoadScriptTask();
            }
        }

    },

    /**
     * 动态载入一个脚本。
     * @param {String} scriptUrl 脚本所在的地址。
     * @param {Function} callback 打开脚本后的回调。
     */
    loadScript: function (scriptUrl, callback, oldScript) {
        var script = document.createElement('SCRIPT');
        script.type = 'text/javascript';
        script.src = QueryString.append(scriptUrl, '_=' + App.version);
        script.onload = callback;
        script.onerror = App.onLoadScriptError;
        oldScript.parentNode.replaceChild(script, oldScript);
    },

    /**
     * 发生脚本错误的回调。
     */
    onLoadScriptError: function (e) {
        console.error('载入脚本 ' + this.src + ' 错误');
    },

    /**
     * 设置当前页面 DOM 加载完成后的回调函数。
     * @param {Function} callback 回调函数。
     */
    ready: function (/*Function*/callback) {
        var page = App._loadingPage || App.activePage;
        if (page.readyState < 3) {
            page.on('ready', callback);
        } else {
            callback.call(page, page);
        }
    },

    /**
     * 发生历史回退的回调。
     */
    onPopState: function () {
        App._open(location.href);
    },

    /**
     * 发生网络错误的回调。
     * @param {String} url 请求的地址。
     * @param {XMLHttpRequest} xhr 请求的对象。
     */
    onNetworkError: function (url, xhr) {
        console.error('网络连接错误： ' + url);
    },

    /**
     * 用于在不同页面之间临时传递数据。
     * @type {Object}
     */
    sessions: {},

    /**
     * 向服务器发送一个异步请求。
     * @param {String} url 请求的地址。
     * @param {String} type 请求的类型，如“GET”。
     * @param {Object/String} data 请求的数据。可以是一个 JSON 对象或已格式化的字符串。
     * @param {Function} success 请求成功的回调函数。
     * @param {Number} cacheObject 缓存对象。
     * @param {String} cacheKey 缓存的键。
     * @param {Function} error 请求失败的回调函数。
     */
    ajax: function (/*String*/url, /*String*/type, /*Object/String*/data, /*Function*/success, /*Function?*/error, /*Number*/cacheObject/* = null*/, /*String?*/cacheKey) {

        // 处理数据。
        if (data) {
            data = QueryString.stringify(data);
            if (type === 'GET') {
                url = QueryString.append(url, data);
                data = null;
            }
        }

        // 处理缓存。
        if (cacheObject) {
            cacheKey = cacheKey || url;
            var cacheData = cacheObject[cacheKey];
            if (cacheData !== undefined) {
                success(cacheData);
                return;
            }
        }

        // 处理参数。
        error = error || App.onNetworkError;

        // 发送请求。
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            var xhr = this;
            if (xhr.readyState === 4) {
                xhr.onreadystatechange = null;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    var cacheData = xhr.responseText;
                    if (cacheObject) {
                        cacheObject[cacheKey] = cacheData;
                    }
                    success(cacheData, xhr);
                } else {
                    error(url, xhr);
                }
            }
        };
        xhr.open(type, url, true);
        xhr.setRequestHeader("accept", '*/*');
        xhr.setRequestHeader("content-type", 'application/x-www-form-urlencoded');
        xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
        xhr.send(data || null);

    },

    /**
     * 请求后台服务数据。
     * @param {String} url 请求的地址。
     * @param {Object/String} data 请求的数据。可以是一个 JSON 对象或已格式化的字符串。
     * @param {Function} success 请求成功的回调函数。
     * @param {String} type 请求的类型，默认为“POST”。
     * @param {Number} cacheType = 1 请求缓存类型。0：不缓存；1：页面缓存；2：会话缓存；3：本地存储缓存。
     * @param {Function} error 请求失败的回调函数。
     * @example
     * App.api(url, data, success);
     * App.api({url: url, data: data, type: 'POST', success: success});
     * App.api({apis:[{url: url, data: data}, {url: url, data: data}], success: success});
     */
    api: function (/*String*/url, /*Object/String*/data, /*Function*/success, /*Number*/cacheType, /*Function?*/error) {
        if (url.constructor === String) {
            App.ajax(App.urlRewrite(url, 3), 'POST', data, success, error, cacheType);
        } else {
            var apis = url.apis || [{
                url: url.url,
                data: url.data,
                type: url.type,
                cacheType: url.cacheType
            }],
                leftApiCount = apis.length,
                datas = new Array(leftApiCount);

            apis.forEach(function (api, index) {
                App.api(api.url, api.data, function (data) {
                    datas[index] = data;
                    // 如果所有数据都加载完成，则并发执行。
                    if (--leftApiCount <= 0) {
                        url.success.apply(url, datas);
                    }
                }, api.type || 'POST', api.cacheType || 0, url.error);
            });

        }

    },

    /**
     * 表示一个单页应用的页面。
     * @class
     */
    Page: Base.extend({

        /**
         * 指示当前页面的加载状态。
         * 0：页面刚初始化；
         * 1：正在加载页面相关的 HTML 文件；
         * 2：正在加载页面相关的 JavaScript 文件；
         * 3：页面相关文件已加载完毕，但未显示过；
         * 4：页面已显示过。
         * @type {Number}
         */
        readyState: 0,

        /**
         * 获取当前页面的地址。
         * @type {String}
         */
        url: null,

        /**
         * 获取当前页面的文件地址。
         */
        get filePath() {
            return this.url.replace(/[?#].*$/, "");
        },

        /**
         * 获取当前页面的参数。
         * @type {Object}
         */
        get params() {
            return this._params || (this._params = QueryString.getQuery(this.url));
        },

        /**
         * 获取当前页面的容器。
         * @type {Object}
         */
        elem: null,

        /**
         * 获取或设置当前页面的标题。
         * @type {String}
         */
        title: '',

        /**
         * 存储当前页面需要加载的全部脚本。
         * @type {Array}
         */
        _unloadedScripts: null,

        /**
         * 初始化新的页面。
         * @param {String} url 当前 URL。
         */
        constructor: function (/*String*/url) {
            this.url = url;
        },

        /**
         * 获取当前页面的类型。
         */
        type: 0,

        /**
         * 判断当前页面是否正在加载。
         * @type {Boolean}
         */
        isLoading: false,

        /**
         * 指示当前页面正在开始异步加载数据。
         * @remark 调用此函数后必须调用 endLoading() 以指示载入已完成。
         */
        startLoading: function () {
            this.isLoading = true;
            if (App.currentPage === this || App.activePage === this) {
                this.doToggleLoading(true);
            }
        },

        /**
         * 指示异步载入已完成，可以开始显示页面。
         */
        endLoading: function () {
            this.isLoading = false;
            if (App.activePage === this) {
                this.show();
            } else if (App.currentPage === this) {
                his.doToggleLoading(false);
            }
        },

        /**
         * 显示当前页面。
         */
        show: function () {

            var oldPage = App.currentPage;

            // 如果当前页面正在载入，则停止显示。
            // 触发新页面的 show 事件。
            if (this.isLoading) {
                return false;
            }

            // 首页不需要重绘。
            if (oldPage) {

                this.doShow(oldPage);

                // 加入历史。
                if (this.type === 0) {
                    history.pushState(null, this.title, this.url);
                } else if (this.type === 1) {
                    history.replaceState(null, this.title, this.url);
                }

                // 隐藏载入图标。
                oldPage.doToggleLoading(false);

            }

            // 标记页面已显式。
            this.readyState = 4;

            // 更新当前页面。
            App.currentPage = this;

            // 触发改变事件。
            App.trigger('change', oldPage);

            // 触发 show。
            return this.trigger('show', oldPage);
        },

        /**
         * 切换 UI 以显示当前页面。
         */
        doShow: function (oldPage) {

            // 更新 UI 标题。
            if (this.title) {
                document.title = this.title;
            }

            // UI 上切换图层的显示和隐藏。
            oldPage.elem.style.display = 'none';
            this.elem.style.display = 'block';

        },

        /**
         * 显示或隐藏加载框。
         * @param {Boolean} show 指示需要显示或隐藏加载框。
         */
        doToggleLoading: function (show) {
            $('#loading').html(show ? "加载中" : "");
        },

        /**
         * 在当前页面执行指定的选择器。
         * @param {String} selector 执行的选择器。
         */
        find: function (/*String*/selector) {
            return $(selector, this.elem);
        },

        /**
         * 渲染指定 ID 的模板。
         * @param {String} tplId 要渲染的模板 ID。
         * @param {Object} data 要渲染的模板数据。
         * @param {Object} scope 模板中 this 的指向。
         */
        render: function (tplId, data, scope) {
            var tpl = document.getElementById(tplId),
                div = document.createElement('div');
            div.id = tplId;
            div.innerHTML = Tpl.parse(tpl.textContent, data, scope, tplId);
            tpl.parentNode.replaceChild(div, tpl);
        }

    }),

    /**
     * 初始化整个应用。
     */
    init: function () {

        // 创建第一个页面。
        var url = App.urlRewrite(location.href, 0);
        var frontPage = App.activePage = App._pages[url] = new App.Page(url);

        // 绑定回退事件。
        window.addEventListener('popstate', App.onPopState, false);

        // 绑定页面所有 click 事件。
        document.addEventListener('click', function (e) {
            var elem = e.target;
            if (elem.nodeName === 'A' && !elem.target) {
                App.go(elem.href, null, false, false, true);
                e.preventDefault();
            }
        }, false);

        $(function () {

            // 设置首页元素。
            frontPage.title = document.title;
            frontPage.elem = document.getElementsByClassName('x-page')[0] || document.body.lastElementChild;

            // 首页相关的 HTML 和 JavaScript 已加载。
            frontPage.readyState = 3;

            // 触发首页 ready 事件。
            frontPage.trigger('ready', frontPage);

            // 显示首页。
            frontPage.show();

        });

    }

};

App.init();

// #endregion

// #region 调试相关
// #if DEBUG

/**
 * 指示当前是否是调试模式。
 * @type {Boolean}
 */
App.debug = true;
App.__defineGetter__('version', function () {
    return Date.now();
});

/**
 * 调试输出任何变量。
 */
function trace() {
    return console.debug.apply(console, arguments);
}

// #endif
// #endregion
