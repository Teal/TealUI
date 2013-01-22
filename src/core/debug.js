

/**
 * Debug Tools
 */

/**
 * 调试输出指定的信息。
 * @param {Object} ... 要输出的变量。
 */
function trace() {

    // 无参数的话，自动补充一个参数。
    if (arguments.length === 0) {
        if (!trace.$count)
            trace.$count = 0;
        return trace('(trace: ' + (trace.$count++) + ')');
    }


    if (trace.enable) {

        var hasConsole = window.console, data;

        // 优先使用 console.debug
        if (hasConsole && console.debug && console.debug.apply) {
            return console.debug.apply(console, arguments);
        }

        // 然后使用 console.log
        if (hasConsole && console.log && console.log.apply) {
            return console.log.apply(console, arguments);
        }

        // 最后使用 trace.inspect
        for (var i = 0, r = []; i < arguments.length; i++) {
            r[i] = trace.inspect(arguments[i]);
        }

        data = r.join(' ');

        return hasConsole && console.log ? console.log(data) : alert(data);
    }
}

/**
 * 确认一个值是 **true**，否则向用户显示一个警告。
 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。
 * @param {Object} ... 用于格式化 message 中被 {} 包围的参数名的具体值。
 * @return {Boolean} 返回 *value* 的等效布尔值。
 * @example <pre>
 * var value = 1;
 * assert(value > 0, "{value} 应该大于 0。", value);
 * </pre>
 */
function assert(value, message) {
    if (!value) {

        var args = arguments;

        switch (args.length) {
            case 1:
                message = "断言失败";
            case 2:
                break;
            case 0:
                return true;
            default:
                var i = 2;
                message = message.replace(/\{([\w\.\(\)]*?)\}/g, function (match, argsName) {
                    return "参数 " + (args.length <= i ? match : argsName + " = " + trace.ellipsis(trace.inspect(args[i++]), 200));
                });
        }

        // 显示调用堆栈。
        if (assert.stackTrace) {

            // 函数调用源。
            args = args.callee.caller;

            // 跳过 assert 函数。
            while (args && args.debugStepThrough)
                args = args.caller;

            // 找到原调用者。
            if (args && args.caller) {
                args = args.caller;
            }

            if (args)
                message += "\r\n--------------------------------------------------------------------\r\n" + trace.ellipsis(trace.decodeUTF8(args.toString()), 600);

        }

        window.trace.error(message);

    }

    return !!value;
}

/**
 * 载入一个组件的 js 和 css源码。
 * @param {String} namespace 组件全名。
 * @example <pre>
 * using("System.Dom.Keys");
 * </pre>
 */
function using(namespace, isStyle) {

    assert.isString(namespace, "using(ns): {ns} 不是合法的组件全名。");

    var cache = using[isStyle ? 'styles' : 'scripts'];

    for (var i = 0; i < cache.length; i++) {
        if (cache[i] === namespace)
            return;
    }

    cache.push(namespace);

    namespace = using.resolve(namespace, isStyle);

    var tagName,
    	type,
    	exts,
    	callback;

    if (isStyle) {
        tagName = "LINK";
        type = "href";
        exts = [".css"];
        callback = using.loadStyle;

    } else {
        tagName = "SCRIPT";
        type = "src";
        exts = [".js"];
        callback = using.loadScript;
    }

    // 如果在节点找到符合的就返回，找不到，调用 callback 进行真正的 加载处理。

    var doms = document.getElementsByTagName(tagName),
		path = namespace.replace(/^[\.\/\\]+/, "");

    for (var i = 0; doms[i]; i++) {
        var url = ((document.constructor ? doms[i][type] : doms[i].getAttribute(type, 4)) || '');
        for (var j = 0; j < exts.length; j++) {
            if (url.indexOf(path + exts[j]) >= 0) {
                return;
            }
        }
    }

    callback(using.rootPath + namespace + exts[0]);
}

/**
 * 导入指定组件全名表示的样式文件。
 * @param {String} namespace 组件全名。
 */
function imports(namespace) {
    return using(namespace, true);
}

(function () {

    /// #region Trace

    /**
     * @namespace trace
     */
    extend(trace, {

        /**
		 * 是否打开调试输出。
		 * @config {Boolean}
		 */
        enable: true,

        /**
		 * 将字符串限定在指定长度内，超出部分用 ... 代替。
		 * @param {String} value 要处理的字符串。
		 * @param {Number} length 需要的最大长度。
		 * @example
		 * <pre>
	     * String.ellipsis("1234567", 6); //   "123..."
	     * String.ellipsis("1234567", 9); //   "1234567"
	     * </pre>
		 */
        ellipsis: function (value, length) {
            return value.length > length ? value.substr(0, length - 3) + "..." : value;
        },

        /**
         * 将字符串从 utf-8 字符串转义。
         * @param {String} s 字符串。
         * @return {String} 返回的字符串。
         */
        decodeUTF8: function (s) {
            return s.replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
                return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
            })
        },

        /**
         * 输出类的信息。
         * @param {Object} [obj] 要查看成员的对象。如果未提供这个对象，则显示全局的成员。
         * @param {Boolean} showPredefinedMembers=true 是否显示内置的成员。
         */
        api: (function () {

            var nodeTypes = 'Window Element Attr Text CDATASection Entity EntityReference ProcessingInstruction Comment HTMLDocument DocumentType DocumentFragment Document Node'.split(' '),

                definedClazz = 'String Date Array Number RegExp Function XMLHttpRequest Object'.split(' ').concat(nodeTypes),

                predefinedNonStatic = {
                    'Object': 'valueOf hasOwnProperty toString',
                    'String': 'length charAt charCodeAt concat indexOf lastIndexOf match quote slice split substr substring toLowerCase toUpperCase trim sub sup anchor big blink bold small fixed fontcolor italics link',
                    'Array': 'length pop push reverse shift sort splice unshift concat join slice indexOf lastIndexOf filter forEach',
                    /*
                     * every
                     * map
                     * some
                     * reduce
                     * reduceRight'
                     */
                    'Number': 'toExponential toFixed toLocaleString toPrecision',
                    'Function': 'length extend call',
                    'Date': 'getDate getDay getFullYear getHours getMilliseconds getMinutes getMonth getSeconds getTime getTimezoneOffset getUTCDate getUTCDay getUTCFullYear getUTCHours getUTCMinutes getUTCMonth getUTCSeconds getYear setDate setFullYear setHours setMinutes setMonth setSeconds setTime setUTCDate setUTCFullYear setUTCHours setUTCMilliseconds setUTCMinutes setUTCMonth setUTCSeconds setYear toGMTString toLocaleString toUTCString',
                    'RegExp': 'exec test'
                },

                predefinedStatic = {
                    'Array': 'isArray',
                    'Number': 'MAX_VALUE MIN_VALUE NaN NEGATIVE_INFINITY POSITIVE_INFINITY',
                    'Date': 'now parse UTC'
                },

                APIInfo = function (obj, showPredefinedMembers) {
                    this.members = {};
                    this.sortInfo = {};

                    this.showPredefinedMembers = showPredefinedMembers !== false;
                    this.isClass = obj === Function || (obj.prototype && obj.prototype.constructor !== Function);

                    // 如果是普通的变量。获取其所在的原型的成员。
                    if (!this.isClass && obj.constructor !== Object) {
                        this.prefix = this.getPrefix(obj.constructor);

                        if (!this.prefix) {
                            var nodeType = obj.replaceChild ? obj.nodeType : obj.setInterval && obj.clearTimeout ? 0 : null;
                            if (nodeType) {
                                this.prefix = this.memberName = nodeTypes[nodeType];
                                if (this.prefix) {
                                    this.baseClassNames = ['Node', 'Element', 'HTMLElement', 'Document'];
                                    this.baseClasses = [window.Node, window.Element, window.HTMLElement, window.HTMLDocument];
                                }
                            }
                        }

                        if (this.prefix) {
                            this.title = this.prefix + this.getBaseClassDescription(obj.constructor) + "的实例成员: ";
                            this.prefix += '.prototype.';
                        }

                        if ([Number, String, Boolean].indexOf(obj.constructor) === -1) {
                            var betterPrefix = this.getPrefix(obj);
                            if (betterPrefix) {
                                this.orignalPrefix = betterPrefix + ".";
                            }
                        }

                    }

                    if (!this.prefix) {

                        this.prefix = this.getPrefix(obj);

                        // 如果是类或对象， 在这里遍历。
                        if (this.prefix) {
                            this.title = this.prefix
                                    + (this.isClass ? this.getBaseClassDescription(obj) : ' ' + getMemberType(obj, this.memberName)) + "的成员: ";
                            this.prefix += '.';
                        }

                    }

                    // 如果是类，获取全部成员。
                    if (this.isClass) {
                        this.getExtInfo(obj);
                        this.addStaticMembers(obj);
                        this.addStaticMembers(obj.prototype, 1, true);
                        this.addEvents(obj, '');
                        delete this.members.prototype;
                        if (this.showPredefinedMembers) {
                            this.addPredefinedNonStaticMembers(obj, obj.prototype, true);
                            this.addPredefinedMembers(obj, obj, predefinedStatic);
                        }

                    } else {
                        this.getExtInfo(obj.constructor);
                        // 否则，获取当前实例下的成员。
                        this.addStaticMembers(obj);

                        if (this.showPredefinedMembers && obj.constructor) {
                            this.addPredefinedNonStaticMembers(obj.constructor, obj);
                        }

                    }
                };

            APIInfo.prototype = {

                memberName: '',

                title: 'API 信息:',

                prefix: '',

                getPrefix: function (obj) {
                    if (!obj)
                        return "";
                    for (var i = 0; i < definedClazz.length; i++) {
                        if (window[definedClazz[i]] === obj) {
                            return this.memberName = definedClazz[i];
                        }
                    }

                    return this.getTypeName(obj, window, "", 3);
                },

                getTypeName: function (obj, base, baseName, deep) {

                    for (var memberName in base) {
                        if (base[memberName] === obj) {
                            this.memberName = memberName;
                            return baseName + memberName;
                        }
                    }

                    if (deep-- > 0) {
                        for (var memberName in base) {
                            try {
                                if (base[memberName] && isUpper(memberName, 0)) {
                                    memberName = this.getTypeName(obj, base[memberName], baseName + memberName + ".", deep);
                                    if (memberName)
                                        return memberName;
                                }
                            } catch (e) {
                            }
                        }
                    }

                    return '';
                },

                getBaseClassDescription: function (obj) {
                    if (obj && obj.base && obj.base !== JPlus.Object) {
                        var extObj = this.getTypeName(obj.base, window, "", 3);
                        return " 类" + (extObj && extObj != "System.Object" ? "(继承于 " + extObj + " 类)" : "");
                    }

                    return " 类";
                },

                /**
                 * 获取类的继承关系。
                 */
                getExtInfo: function (clazz) {
                    if (!this.baseClasses) {
                        this.baseClassNames = [];
                        this.baseClasses = [];
                        while (clazz && clazz.prototype) {
                            var name = this.getPrefix(clazz);
                            if (name) {
                                this.baseClasses.push(clazz);
                                this.baseClassNames.push(name);
                            }

                            clazz = clazz.base;
                        }
                    }

                },

                addStaticMembers: function (obj, nonStatic) {
                    for (var memberName in obj) {
                        this.addMember(obj, memberName, 1, nonStatic);
                    }

                },

                addPredefinedMembers: function (clazz, obj, staticOrNonStatic, nonStatic) {
                    for (var type in staticOrNonStatic) {
                        if (clazz === window[type]) {
                            staticOrNonStatic[type].forEach(function (memberName) {
                                this.addMember(obj, memberName, 5, nonStatic);
                            }, this);
                        }
                    }
                },

                addPredefinedNonStaticMembers: function (clazz, obj, nonStatic) {

                    if (clazz !== Object) {

                        predefinedNonStatic.Object.forEach(function (memberName) {
                            if (clazz.prototype[memberName] !== Object.prototype[memberName]) {
                                this.addMember(obj, memberName, 5, nonStatic);
                            }
                        }, this);

                    }

                    if (clazz === Object && !this.isClass) {
                        return;
                    }

                    this.addPredefinedMembers(clazz, obj, predefinedNonStatic, nonStatic);

                },

                addEvents: function (obj, extInfo) {
                    var evtInfo = obj.$event;

                    if (evtInfo) {

                        for (var evt in evtInfo) {
                            this.sortInfo[this.members[evt] = evt + ' 事件' + extInfo] = 4 + evt;
                        }

                        if (obj.base) {
                            this.addEvents(obj.base, '(继承的)');
                        }
                    }
                },

                addMember: function (base, memberName, type, nonStatic) {
                    try {

                        var hasOwnProperty = Object.prototype.hasOwnProperty, owner = hasOwnProperty.call(base, memberName), prefix, extInfo = '';

                        nonStatic = nonStatic ? 'prototype.' : '';

                        // 如果 base 不存在 memberName 的成员，则尝试在父类查找。
                        if (owner) {
                            prefix = this.orignalPrefix || (this.prefix + nonStatic);
                            type--; // 自己的成员置顶。
                        } else {

                            // 搜索包含当前成员的父类。
                            this.baseClasses.each(function (baseClass, i) {
                                if (baseClass.prototype[memberName] === base[memberName] && hasOwnProperty.call(baseClass.prototype, memberName)) {
                                    prefix = this.baseClassNames[i] + ".prototype.";

                                    if (nonStatic)
                                        extInfo = '(继承的)';

                                    return false;
                                }
                            }, this);

                            // 如果没找到正确的父类，使用当前类替代，并指明它是继承的成员。
                            if (!prefix) {
                                prefix = this.prefix + nonStatic;
                                extInfo = '(继承的)';
                            }

                        }

                        this.sortInfo[this.members[memberName] = (type >= 4 ? '[内置]' : '') + prefix + getDescription(base, memberName) + extInfo] = type
							+ memberName;

                    } catch (e) {
                    }
                },

                copyTo: function (value) {
                    for (var member in this.members) {
                        value.push(this.members[member]);
                    }

                    if (value.length) {
                        var sortInfo = this.sortInfo;
                        value.sort(function (a, b) {
                            return sortInfo[a] < sortInfo[b] ? -1 : 1;
                        });
                        value.unshift(this.title);
                    } else {
                        value.push(this.title + '没有可用的子成员信息。');
                    }

                }

            };

            initPredefined(predefinedNonStatic);
            initPredefined(predefinedStatic);

            function initPredefined(predefined) {
                for (var obj in predefined)
                    predefined[obj] = predefined[obj].split(' ');
            }

            function isEmptyObject(obj) {

                // null 被认为是空对象。
                // 有成员的对象将进入 for(in) 并返回 false 。
                for (obj in (obj || {}))
                    return false;
                return true;
            }

            // 90 是 'Z' 65 是 'A'
            function isUpper(str, index) {
                str = str.charCodeAt(index);
                return str <= 90 && str >= 65;
            }

            function getMemberType(obj, name) {

                // 构造函数最好识别。
                if (typeof obj === 'function' && name === 'constructor')
                    return '构造函数';

                // IE6 的 DOM 成员不被认为是函数，这里忽略这个错误。
                // 有 prototype 的函数一定是类。
                // 没有 prototype 的函数肯能是类。
                // 这里根据命名如果名字首字母大写，则作为空类理解。
                // 这不是一个完全正确的判断方式，但它大部分时候正确。
                // 这个世界不要求很完美，能解决实际问题的就是好方法。
                if (obj.prototype && obj.prototype.constructor)
                    return !isEmptyObject(obj.prototype) || isUpper(name, 0) ? '类' : '函数';

                // 最后判断对象。
                if (obj && typeof obj === 'object')
                    return name.charAt(0) === 'I' && isUpper(name, 1) ? '接口' : '对象';

                // 空成员、值类型都作为属性。
                return '属性';
            }

            function getDescription(base, name) {
                return name + ' ' + getMemberType(base[name], name);
            }

            return function (obj, showPredefinedMembers) {
                var r = [];

                // 如果没有参数，显示全局对象。
                if (arguments.length === 0) {
                    for (var i = 0; i < 7; i++) {
                        r.push(getDescription(window, definedClazz[i]));
                    }

                    r.push("trace 函数", "assert 函数", "using 函数", "imports 函数");

                    for (var name in window) {

                        try {
                            if (isUpper(name, 0) || JPlus[name] === window[name])
                                r.push(getDescription(window, name));
                        } catch (e) {

                        }
                    }

                    r.sort();
                    r.unshift('全局对象: ');

                } else if (obj != null) {
                    new APIInfo(obj, showPredefinedMembers).copyTo(r);
                } else {
                    r.push('无法对 ' + (obj === null ? "null" : "undefined") + ' 分析');
                }

                trace(r.join('\r\n'));

            };

        })(),

        /**
         * 获取对象的字符串形式。
         * @param {Object} obj 要输出的内容。
         * @param {Number/undefined} deep=0 递归的层数。
         * @return String 成员。
         */
        inspect: function (obj, deep, showArrayPlain) {

            if (deep == null)
                deep = 3;
            switch (typeof obj) {
                case "function":
                    // 函数
                    return deep >= 3 ? trace.decodeUTF8(obj.toString()) : "function ()";

                case "object":
                    if (obj == null)
                        return "null";
                    if (deep < 0)
                        return obj.toString();

                    if (typeof obj.length === "number") {
                        var r = [];
                        for (var i = 0; i < obj.length; i++) {
                            r.push(trace.inspect(obj[i], ++deep));
                        }
                        return showArrayPlain ? r.join("   ") : ("[" + r.join(", ") + "]");
                    } else {
                        if (obj.setInterval && obj.resizeTo)
                            return "window#" + obj.document.URL;
                        if (obj.nodeType) {
                            if (obj.nodeType == 9)
                                return 'document ' + obj.URL;
                            if (obj.tagName) {
                                var tagName = obj.tagName.toLowerCase(), r = tagName;
                                if (obj.id) {
                                    r += "#" + obj.id;
                                    if (obj.className)
                                        r += "." + obj.className;
                                } else if (obj.outerHTML)
                                    r = obj.outerHTML;
                                else {
                                    if (obj.className)
                                        r += " class=\"." + obj.className + "\"";
                                    r = "<" + r + ">" + obj.innerHTML + "</" + tagName + ">  ";
                                }

                                return r;
                            }

                            return '[Node type=' + obj.nodeType + ' name=' + obj.nodeName + ' value=' + obj.nodeValue + ']';
                        }
                        var r = "{\r\n", i, flag = 0;
                        for (i in obj) {
                            if (typeof obj[i] !== 'function')
                                r += "\t" + i + " = " + trace.inspect(obj[i], deep - 1) + "\r\n";
                            else {
                                flag++;
                            }
                        }

                        if (flag) {
                            r += '\t... (' + flag + '个函数)\r\n';
                        }

                        r += "}";
                        return r;
                    }
                case "string":
                    return deep >= 3 ? obj : '"' + obj + '"';
                case "undefined":
                    return "undefined";
                default:
                    return obj.toString();
            }
        },

        /**
         * 输出方式。 {@param {String} message 信息。}
         * @type Function
         */
        log: function (message) {
            if (trace.enable && window.console && console.log) {
                window.console.log(message);
            }
        },

        /**
         * 输出一个错误信息。
         * @param {Object} msg 内容。
         */
        error: function (msg) {
            if (trace.enable) {
                if (window.console && console.error)
                    window.console.error(msg); // 这是一个预知的错误，请根据函数调用堆栈查找错误原因。
                else
                    throw msg; // 这是一个预知的错误，请根据函数调用堆栈查找错误原因。
            }
        },

        /**
         * 输出一个警告信息。
         * @param {Object} msg 内容。
         */
        warn: function (msg) {
            if (trace.enable) {
                if (window.console && console.warn)
                    window.console.warn(msg);
                else
                    window.trace("[警告]" + msg);
            }
        },

        /**
         * 输出一个信息。
         * @param {Object} msg 内容。
         */
        info: function (msg) {
            if (trace.enable) {
                if (window.console && console.info)
                    window.console.info(msg);
                else
                    window.trace.write("[信息]" + msg);
            }
        },

        /**
         * 遍历对象每个元素。
         * @param {Object} obj 对象。
         */
        dir: function (obj) {
            if (trace.enable) {
                if (window.console && console.dir)
                    window.console.dir(obj);
                else if (obj) {
                    var r = "", i;
                    for (i in obj)
                        r += i + " = " + trace.inspect(obj[i], 1) + "\r\n";
                    window.trace(r);
                }
            }
        },

        /**
         * 清除调试信息。 (没有控制台时，不起任何作用)
         */
        clear: function () {
            if (window.console && console.clear)
                window.console.clear();
        },

        /**
         * 如果是调试模式就运行。
         * @param {String/Function} code 代码。
         * @return String 返回运行的错误。如无错, 返回空字符。
         */
        eval: function (code) {
            if (trace.enable) {
                try {
                    typeof code === 'function' ? code() : eval(code);
                } catch (e) {
                    return e;
                }
            }
            return "";
        },

        /**
         * 输出一个函数执行指定次使用的时间。
         * @param {Function} fn 函数。
         */
        time: function (fn) {
            var time = 0,
				currentTime,
				start = +new Date(),
				past;

            try {

                do {

                    time += 10;

                    currentTime = 10;
                    while (--currentTime > 0) {
                        fn();
                    }

                    past = +new Date() - start;

                } while (past < 100);

            } catch (e) {

            }
            window.trace("[时间] " + past / time);
        }

    });

    /// #region Assert

    /**
     * @namespace assert
     */
    extend(assert, {

        /**
		 * 是否在 assert 失败时显示函数调用堆栈。
		 * @config {Boolean} stackTrace
		 */
        stackTrace: true,

        debugStepThrough: true,

        /**
		 * 指示一个函数已过时。
		 * @param {String} message="此成员已过时" 提示的信息。
		 */
        deprected: function (message) {
            trace.warn(message || "此成员已过时");
        },

        /**
         * 确认一个值为函数。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         * @example <pre>
         * assert.isFunction(a, "a ~");
         * </pre>
         */
        isFunction: createAssertFunc(function (value) {
            return typeof value == 'function';
        }, "必须是函数。"),

        /**
         * 确认一个值为数组。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         */
        isArray: createAssertFunc(function (value) {
            return typeof value.length == 'number';
        }, "必须是数组。"),

        /**
         * 确认一个值为数字。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         */
        isNumber: createAssertFunc(function (value) {
            return typeof value === "number" || value instanceof Number;
        }, "必须是数字。"),

        /**
         * 确认一个值是字符串。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         */
        isString: createAssertFunc(function (value) {
            return typeof value === "string" || value instanceof String;
        }, "必须是字符串。"),

        /**
         * 确认一个值是日期。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         */
        isDate: createAssertFunc(function (value) {
            return value && value instanceof Date;
        }, "必须是日期对象。"),

        /**
         * 确认一个值是正则表达式。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         */
        isRegExp: createAssertFunc(function (value) {
            return value && value instanceof RegExp;
        }, "必须是正则表达式。"),

        /**
         * 确认一个值为函数变量。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         */
        isObject: createAssertFunc(function (value) {
            return value && (typeof value === "object" || typeof value === "function" || typeof value.nodeType === "number");
        }, "必须是一个引用对象。"),

        /**
         * 确认一个值为节点。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         */
        isNode: createAssertFunc(function (value) {
            return value ? typeof value.nodeType === "number" || value.setTimeout : value === null;
        }, "必须是 DOM 节点。"),

        /**
         * 确认一个值为节点。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         */
        isElement: createAssertFunc(function (value) {
            return value ? typeof value.nodeType === "number" && value.style : value === null;
        }, "必须是 DOM 元素。"),

        /**
         * 确认一个值非空。
		 * @param {Object} value 要用于判断的值。它会被自动转为布尔型之后再作判断。
		 * @param {String} message="断言失败" 如果 *value* 为 **false**, 则显示的错误提示。可以用 ~ 代替默认的错误提示信息。
		 * @return {Boolean} 返回 *value* 的等效布尔值。
         */
        notNull: createAssertFunc(function (value) {
            return value != null;
        }, "不可为空。")

    });

    function createAssertFunc(assertFunction, defaultMessage) {
        var fn = function (value, message) {
            return assert(assertFunction(value), (message || "断言失败。").replace('~', defaultMessage), value)
        };
        fn.debugStepThrough = true;
        return fn;
    }

    /// #endregion

    /// #region Using

    extend(using, {

        /**
         * 同步载入代码。
         * @param {String} uri 地址。
         * @example <pre>
         * JPlus.loadScript('./v.js');
         * </pre>
         */
        loadScript: function (url) {

            var src = using.loadText(url);

            if (src) {
                try {
                    if (window.execScript) {
                        window.execScript(src);
                    } else {
                        window["eval"].call(window, src);
                    }
                } catch (e) {
                    trace.error("执行 " + url + " 出现错误: " + e.toString());
                }
            }
        },

        /**
         * 异步载入样式。
         * @param {String} uri 地址。
         * @example <pre>
         * JPlus.loadStyle('./v.css');
         * </pre>
         */
        loadStyle: function (url) {

            // 在顶部插入一个css，但这样肯能导致css没加载就执行 js 。所以，要保证样式加载后才能继续执行计算。
            return document.getElementsByTagName("HEAD")[0].appendChild(extend(document.createElement('link'), {
                href: url,
                rel: 'stylesheet',
                type: 'text/css'
            }));
        },

        /**
         * 同步载入文本。
         * @param {String} uri 地址。
         * @param {Function} [callback] 对返回值的处理函数。
         * @return {String} 载入的值。 因为同步，所以无法跨站。
         * @example <pre>
         * trace(  JPlus.loadText('./v.html')  );
         * </pre>
         */
        loadText: function (url) {

            // 新建请求。
            // 下文对 XMLHttpRequest 对象进行兼容处理。
            var xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
		        status;

            try {

                // 打开请求。
                xmlHttp.open("GET", url, false);

                // 发送请求。
                xmlHttp.send(null);

                // 获取返回的状态码。
                status = xmlHttp.status;

                // 判断状态码是否合格。
                if ((status >= 200 && status < 300) || status == 304 || status == 1223) {
                    // 返回相应内容。
                    return xmlHttp.responseText;
                } else {
                    throw "服务器返回状态码 " + status;
                }

            } catch (e) {

                // 调试输出。
                trace.error("请求失败: " + url + " \r\n\t原因: " + (window.location.protocol == "file:" ? " 本网页是使用 file 协议打开的，请改用 http 协议。" : e.toString()));

            } finally {

                // 释放资源。
                xmlHttp = null;
            }

        },

        /**
         * 全部已载入的样式。
         * @type Array
         * @private
         */
        styles: [],

        /**
         * 全部已载入的组件全名。
         * @type Array
         * @private
         */
        scripts: [],

        /**
         * JPlus 安装的根目录, 可以为相对目录。
         * @config {String}
         */
        rootPath: (function () {
            try {
                var scripts = document.getElementsByTagName("script");

                // 当前脚本在 <script> 引用。最后一个脚本即当前执行的文件。
                scripts = scripts[scripts.length - 1];

                // IE6/7 使用 getAttribute
                scripts = !document.constructor ? scripts.getAttribute('src', 4) : scripts.src;

                // 设置路径。
                return (scripts.match(/([\S\s]*\/)System\/Core\/assets\/scripts\//) || [0, ""])[1];

            } catch (e) {

                // 出错后，设置当前位置.
                return "";
            }

        })(),

        /**
         * 将指定的组件全名转为路径。
         * @param {String} namespace 组件全名。
         * @param {Boolean} isStyle=false 是否为样式表。
         */
        resolve: function (namespace, isStyle) {
            return namespace.replace(/^([^.]+\.[^.]+)\./, isStyle ? '$1.assets.styles.' : '$1.assets.scripts.').replace(/\./g, '/');
        }

    });

    /// #endregion

    /// #endregion

    /**
	 * 复制所有属性到任何对象。
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
    function extend(dest, src) {

        assert(dest != null, "Object.extend(dest, src): {dest} 不可为空。", dest);

        // 直接遍历，不判断是否为真实成员还是原型的成员。
        for (var b in src)
            dest[b] = src[b];
        return dest;
    }

})();

/// #endif

