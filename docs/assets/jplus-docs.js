/*********************************************************
 * This file is created by a tool at 2013/3/29 09:35
 ********************************************************/

//#included core/base.js
//#included core/class.js
//#included dom/base.js
//#included dom/pin.js
//#included fx/animate.js
//#included fx/base.js
//#included fx/tween.js
//#included ui/button/button.css
//#included ui/button/menubutton.css
//#included ui/core/base.css
//#included ui/core/base.js
//#included ui/core/common.css
//#included ui/core/idropdownowner.js
//#included ui/core/iinput.js
//#included ui/form/searchtextbox.css
//#included ui/form/searchtextbox.js
//#included ui/form/textbox.css
//#included ui/nav/scrolltotop.css
//#included ui/nav/scrolltotop.js
//#included ui/suggest/picker.css
//#included ui/suggest/picker.js
//#included ui/typography/heading.css
//#included utils/deferrable.js
/*********************************************************
 * core/base.js
 ********************************************************//**
 * @author xuld
 * @fileOverview 为浏览器环境扩展一些必要的方法。
 */

var JPlus = (function (undefined) {

    //#region Functions

	/**
	 * Array.prototype 简写。
	 * @type  Object
	 */
	var ap = Array.prototype;

    /**
	 * 复制所有属性到任何对象。
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function extend(dest, src) {

		//#//assert dest!=null @Object.extend

	    // 直接遍历，不判断是否为真实成员还是原型的成员。
	    for (var key in src)
	        dest[key] = src[key];
	    return dest;
	}

    /**
	 * 复制对象的所有属性到其它对象，但不覆盖原对象的相应值。
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function extendIf(dest, src) {

		//#//assert dest!=null @Object.extendIf

	    // 和 extend 类似，只是判断目标的值，如果不是 undefined 然后拷贝。
	    for (var b in src)
	        if (dest[b] === undefined)
	            dest[b] = src[b];
	    return dest;
	}

    /**
	 * 对数组运行一个函数。
	 * @param {Function} fn 遍历的函数。参数依次 value, index, array 。
	 * @param {Object} scope 对象。
	 * @return {Boolean} 返回一个布尔值，该值指示本次循环时，有无出现一个函数返回 false 而中止循环。
	 */
	function each(fn, scope) {

		//#//assert fn:Function @Array.each(fn, scope)

	    var i = -1, me = this;

	    while (++i < me.length)
	        if (fn.call(scope, me[i], i, me) === false)
	            return false;
	    return true;
	}

	/**
	 * 系统原生的对象。
	 * @static class Object
	 */
	extend(Object, {

		//#if CompactMode

		/**
		 * 复制对象的所有属性到其它对象。
		 * @param {Object} dest 复制的目标对象。
		 * @param {Object} src 复制的源对象。
		 * @return {Object} 返回 *dest*。
		 * @see extendIf
		 * @example <pre>
	     * var a = {v: 3}, b = {g: 2};
	     * Object.extend(a, b);
	     * trace(a); // {v: 3, g: 2}
	     * </pre>
		 */
		extend: (function () {
			for (var item in {
				toString: 1
			})
				return extend;

			// IE6: for in 不会遍历原生函数，所以手动拷贝这些元素函数。
			extend.enumerables = "toString hasOwnProperty valueOf constructor isPrototypeOf".split(' ');
			return function (dest, src) {
				if (src) {
					//#//assert dest!=null @Object.extend
					for (var i = extend.enumerables.length, value; i--;)
					    if (Object.prototype.hasOwnProperty.call(src, value = extend.enumerables[i]))
							dest[value] = src[value];
					extend(dest, src);
				}

				return dest;
			};
		})(),

		//#else

		//# extend: extend,

		//#endif

		/**
		 * 复制对象的所有属性到其它对象，但不覆盖原对象的相应值。
		 * @param {Object} dest 复制的目标对象。
		 * @param {Object} src 复制的源对象。
		 * @return {Object} 返回 *dest*。
		 * @see Object.extend
		 * @example
		 * <pre>
	     * var a = {v: 3, g: 5}, b = {g: 2};
	     * extendIf(a, b);
	     * trace(a); // {v: 3, g: 5}  b 未覆盖 a 任何成员。
	     * </pre>
		 */
		extendIf: extendIf,

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
		 * @return {Boolean} 如果循环是因为 *fn* 返回 **false** 而中止，则返回 **false**， 否则返回 **true**。
		 * @see Array#each
		 * @see Array#forEach
		 * @example
		 * <pre>
	     * Object.each({a: '1', c: '3'}, function (value, key) {
	     * 		trace(key + ' : ' + value);
	     * });
	     * // 输出 'a : 1' 'c : 3'
	     * </pre>
		 */
		each: function (iterable, fn, scope) {

			//#//assert typeof iterable !== 'function' @Object.each
			//#//assert fn:Function @Object.each

			// 如果 iterable 是 null， 无需遍历 。
			if (iterable != null) {

				// 普通对象使用 for( in ) , 数组用 0 -> length 。
				if (typeof iterable.length !== "number") {

					// Object 遍历。
					for (var key in iterable)
						if (fn.call(scope, iterable[key], key, iterable) === false)
							return false;
				} else {
					return each.call(iterable, fn, scope);
				}

			}

			// 正常结束返回 true。
			return true;
		},

		/**
		 * 遍历一个类数组对象并调用指定的函数，返回每次调用的返回值数组。
		 * @param {Array/String/Object} iterable 任何对象，不允许是函数。如果是字符串，将会先将字符串用空格分成数组。
		 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
		 *
		 * - {Object} value 当前元素的值。
		 * - {Number} index 当前元素的索引。
		 * - {Array} array 当前正在遍历的数组。
		 *
		 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
		 * @param {Object} [dest] 仅当 *iterable* 是字符串时，传递 *dest* 可以将函数的返回值保存到 dest。
		 * @return {Object/Undefiend} 返回的结果对象。当 *iterable* 是字符串时且未指定 dest 时，返回空。
		 * @example
		 * <pre>
		 * 
		 * // 传统的 map 用法:
		 * 
	     * Object.map(["a","b"], function(a){
	     * 	  return a + a;
	     * }); // => ["aa", "bb"];
	     *
	     * Object.map({a: "a", b: "b"}, function(a){
	     * 	  return a + a
	     * }); // => {a: "aa", b: "bb"};
	     *
	     * Object.map({length: 1, "0": "a"}, function(a){
	     * 	   return a + a
	     * }); // => ["a"];
	     * 
	     * // 字符串 map 用法:
	     *
	     * Object.map("a b", function(a){
	     * 		return a + a
	     * }, {}); // => {a: "aa", b: "bb"};
	     *
	     * Object.map("a b", function(a){
	     * 		return a + a
	     * }); // => undefined; 注意: 如果未指定 dest，则结果值将丢失。
	     *
	     * Object.map("a b", 3, {}); // => {a: 3, b: 3};
	     * </pre>
		 */
		map: function (iterable, fn, dest) {

			// Object.map("a b c")
			if (typeof iterable === 'string') {
			    iterable = iterable.split(' ');

			    // Object.map({})
			} else {
			    dest = dest || typeof iterable.length !== "number" ? {} : [];
			}

			// 遍历对象。
			Object.each(iterable, dest ? function (value, key, array) {
			    this[value] = fn(value, key, array);
			} : fn, dest);

			// 返回目标。
			return dest;
		}

	});

	/**
     * 表示一个空函数。这个函数总是返回 undefined 。
     * @property
     * @type Function
     * @remark
     * 在定义一个类的抽象函数时，可以让其成员的值等于 **Function.empty** 。
     */
	Function.empty = function emptyFn() {

	};

	/**
	 * 格式化指定的字符串。
	 * @param {String} formatString 要格式化的字符串。格式化的方式见备注。
	 * @param {Object} ... 格式化用的参数。
	 * @return {String} 格式化后的字符串。
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
  	 * 默认地，String.format 将使用函数的作用域(默认为 String) 函数将参数格式化为字符串后填入目标字符串。
  	 * 因此在使用 String.format 时，应该保证 String.format 的作用域为 String 或其它格式化函数。
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
	String.format = function (formatString, args) {

		//#//assert formatString:String? @String.format(formatString, ...)

		// 支持参数2为数组或对象的直接格式化。
		var toString = this;

		args = arguments.length === 2 && args && typeof args === 'object' ? args : ap.slice.call(arguments, 1);

		// 通过格式化返回。
		return formatString ? formatString.replace(/\{+?(\S*?)\}+/g, function (match, name) {
			var start = match.charAt(1) === '{', end = match.charAt(match.length - 2) === '}';
			if (start || end)
				return match.slice(start, match.length - end);
			return name in args ? toString(args[name]) : "";
		}) : "";
	};

    //#if CompactMode

	/**
	 * 系统原生的数组对象。
	 * @class Array
	 */
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

	/**
	 * 系统原生的日期对象。
	 * @class Date
	 */
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

	//#endif

	/**
	 * @namespace window
	 */

	if (!window.execScript) {

		/**
		 * 在全局作用域运行一个字符串内的代码。
		 * @param {String} statement Javascript 语句。
		 * @example
		 * <pre>
		 * execScript('alert("hello")');
		 * </pre>
		 */
		window.execScript = function (statements) {

			//#//assert statements:String? @execScript

			// 如果正常浏览器，使用 window.eval 。
			window["eval"].call(window, statements);

		};

	}

	//#endregion

	//#region Navigator

	/**
	 * 系统原生的浏览器对象实例。
	 * @type Navigator
	 * @namespace navigator
	 */

    // 检查信息
	var ua = navigator.userAgent,

		match = ua.match(/(IE|Firefox|Chrome|Safari|Opera)[\/\s]([\w\.]*)/i) || ua.match(/(WebKit|Gecko)[\/\s]([\w\.]*)/i) || [0, "Other", 0],

		isIE678 = !+"\v1";

    /**
	 * 获取一个值，该值指示是否为 IE 浏览器。
	 * @getter isIE
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 IE6 浏览器。
	 * @getter isIE6
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 IE7 浏览器。
	 * @getter isIE7
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 IE8 浏览器。
	 * @getter isIE8
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 IE9 浏览器。
	 * @getter isIE9
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 IE10 浏览器。
	 * @getter isIE10
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 Firefox 浏览器。
	 * @getter isFirefox
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 Chrome 浏览器。
	 * @getter isChrome
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 Opera 浏览器。
	 * @getter isOpera
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 Opera10 浏览器。
	 * @getter isOpera10
	 * @type Boolean
	 */

    /**
	 * 获取一个值，该值指示是否为 Safari 浏览器。
	 * @getter isSafari
	 * @type Boolean
	 */

	navigator["is" + match[1]] = navigator["is" + match[1] + parseInt(match[2])] = true;

    /**
	 * 判断当前浏览器是否是 IE678。
	 * @getter
	 * @type Boolean
	 */
	navigator.isIE678 = isIE678;

    /**
	 * 获取一个值，该值指示当前浏览器是否支持标准事件。
	 * @getter
	 * @type Boolean
	 */
	navigator.isIE67 = isIE678 && typeof document.constructor !== 'object';

	//#endregion

    //#region Methods

	//#if CompactMode

	/**
	 * 系统原生的字符串对象。
	 * @class String
	 */
	extendIf(String.prototype, {

		/**
		 * 去除字符串的首尾空格。
		 * @return {String} 处理后的字符串。
		 * @remark 目前除了 IE8-，主流浏览器都已内置此函数。
		 * @example
		 * <pre>
	     * "   g h   ".trim(); //  返回     "g h"
	     * </pre>
		 */
		trim: function () {
			return this.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "");
		}

	});

	/**
	 * 系统原生的函数对象。
	 * @class Function
	 */
	extendIf(Function.prototype, {

		/**
		 * 绑定函数作用域(**this**)。并返回一个新函数，这个函数内的 **this** 为指定的 *scope* 。
		 * @param {Object} scope 要绑定的作用域的值。
		 * @example
		 * <pre>
		 * var fn = function(){ trace(this);  };
		 *
		 * var fnProxy = fn.bind(0);
		 *
	     * fnProxy()  ; //  输出 0
	     * </pre>
		 */
		bind: function (scope) {

			var me = this;

			// 返回对 scope 绑定。
			return function () {
				return me.apply(scope, arguments);
			}
		}

	});

	//#endif

	/**
	 * 系统原生的数组对象。
	 * @class Array
	 */
	extendIf(ap, {

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
		 * @return {Boolean} 如果循环是因为 *fn* 返回 **false** 而中止，则返回 **false**， 否则返回 **true**。
		 * @method
		 * @see Object.each
		 * @see #forEach
		 * @see #filter
		 * @see Object.map
		 * @remark
		 * 在高版本浏览器中，forEach 和 each 功能大致相同，但是 forEach 不支持通过 return false 中止循环。
		 * 在低版本(IE8-)浏览器中， forEach 为 each 的别名。
		 * @example 以下示例演示了如何遍历数组，并输出每个元素的值。
		 * <pre>
	     * [2, 5].each(function (value, index) {
	     * 		trace(value);
	     * });
	     * // 输出 '2 5'
	     * </pre>
	     *
	     * 以下示例演示了如何通过 return false 来中止循环。
	     * <pre>
	     * [2, 5].each(function (value, index) {
	     * 		trace(value);
	     * 		return false;
	     * });
	     * // 输出 '2'
	     * </pre>
		 */
		each: each,

		/**
		 * 删除数组中重复元素。
		 * @return {Array} this
		 * @example
		 * <pre>
	     * [1, 7, 8, 8].unique(); //    [1, 7, 8]
	     * </pre>
		 */
		unique: function () {

			// 删除从 i + 1 之后的当前元素。
			for (var i = 0, j, value; i < this.length;) {
				value = this[i];
				j = ++i;
				do {
					j = ap.remove.call(this, value, j);
				} while (j >= 0);
			}

			return this;
		},

		/**
		 * 删除当前数组中指定的元素。
		 * @param {Object} value 要删除的值。
		 * @param {Number} startIndex=0 开始搜索 *value* 的起始位置。
		 * @return {Number} 被删除的值在原数组中的位置。如果要擅长的值不存在，则返回 -1 。
		 * @remark
		 * 如果数组中有多个相同的值， remove 只删除第一个。
		 * @example
		 * <pre>
	     * [1, 7, 8, 8].remove(7); // 返回 1,  数组变成 [7, 8, 8]
	     * </pre>
	     *
	     * 以下示例演示了如何删除数组全部相同项。
	     * <pre>
	     * var arr = ["wow", "wow", "J+ UI", "is", "powerful", "wow", "wow"];
	     *
	     * // 反复调用 remove， 直到 remove 返回 -1， 即找不到值 wow
	     * while(arr.remove(wow) >= 0);
	     *
	     * trace(arr); // 输出 ["J+ UI", "is", "powerful"]
	     * </pre>
		 */
		remove: function (value, startIndex) {

			// 找到位置， 然后删。
			var i = ap.indexOf.call(this, value, startIndex);
			if (i !== -1)
				ap.splice.call(this, i, 1);
			return i;
		},

		//#if CompactMode

		/**
		 * 返回当前数组中某个值的第一个位置。
		 * @param {Object} item 成员。
		 * @param {Number} startIndex=0 开始查找的位置。
		 * @return {Number} 返回 *vaue* 的索引，如果不存在指定的值， 则返回-1 。
		 * @remark 目前除了 IE8-，主流浏览器都已内置此函数。
		 */
		indexOf: function (value, startIndex) {
			startIndex = startIndex || 0;
			for (var len = this.length; startIndex < len; startIndex++)
				if (this[startIndex] === value)
					return startIndex;
			return -1;
		},

		/**
		 * 对数组每个元素通过一个函数过滤。返回所有符合要求的元素的数组。
		 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
		 *
		 * - {Object} value 当前元素的值。
		 * - {Number} index 当前元素的索引。
		 * - {Array} array 当前正在遍历的数组。
		 *
		 * 如果函数返回 **true**，则当前元素会被添加到返回值数组。
		 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
		 * @return {Array} 返回一个新的数组，包含过滤后的元素。
		 * @remark 目前除了 IE8-，主流浏览器都已内置此函数。
		 * @see #each
		 * @see #forEach
		 * @see Object.map
		 * @example
		 * <pre>
		 * [1, 7, 2].filter(function (key) {
		 * 		return key < 5;
		 * })  //  [1, 2]
		 * </pre>
		 */
		filter: function (fn, scope) {
			//#assert.isFunction(fn, "Array#filter(fn, scope): {fn} ~");
			var ret = [];
			ap.forEach.call(this, function (value, i, array) {
				if (fn.call(scope, value, i, array))
					ret.push(value);
			});
			return ret;
		},

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
		 * @see #each
		 * @see Object.each
		 * @see #filter
		 * @see Object.map
		 * @remark
		 * 在高版本浏览器中，forEach 和 each 功能大致相同，但是 forEach 不支持通过 return false 中止循环。
		 * 在低版本(IE8-)浏览器中， forEach 为 each 的别名。
		 *
		 * 目前除了 IE8-，主流浏览器都已内置此函数。
		 * @example 以下示例演示了如何遍历数组，并输出每个元素的值。
		 * <pre>
	     * [2, 5].forEach(function (value, key) {
	     * 		trace(value);
	     * });
	     * // 输出 '2' '5'
	     * </pre>
		 */
		forEach: each

		//#endif

	});

    //#endregion

    //#region Export

	/**
	 * 包含系统有关的函数。
	 * @type Object
	 * @namespace JPlus
	 */
	return {

		/**
		 * id种子 。
		 * @type Number
		 * @defaultValue 1
		 * @example 下例演示了 JPlus.id 的用处。
		 * <pre>
		 *		var uid = JPlus.id++;  // 每次使用之后执行 ++， 保证页面内的 id 是唯一的。
		 * </pre>
		 */
		id: 1,

		/**
		 * 获取当前框架的版本号。
		 * @getter
		 */
		version: /*@VERSION*/0.41

	};

    //#endregion

})();
/*********************************************************
 * core/class.js
 ********************************************************//**
 * @author xuld
 * @fileOverview 提供类的支持。
 */

//#include core/base.js

var Class = (function () {

    /**
	 * 所有自定义类的基类。
	 */
    function Base() {

    }

    Base.prototype = {

        constructor: Base,

        toString: function () {
            for (var item in window) {
                if (window[item] === this.constructor)
                    return item;
            }

            return Object.prototype.toString.call(this);
        },

        //#region Event

        /**
         * 增加一个事件监听者。
         * @param {String} eventName 事件名。
         * @param {Function} eventHandler 监听函数。当事件被处罚时会执行此函数。
         * @param {Object} scope=this *eventHandler* 执行时的作用域。
         * @return this
         * @example
         * <pre>
         *
         * // 创建一个类 A
         * var A = new Class({
         *
         * });
         *
         * // 创建一个变量。
         * var a = new A();
         *
         * // 绑定一个 click 事件。
         * a.on('click', function (e) {
         * 		return true;
         * });
         * </pre>
         */
        on: function (type, fn, scope) {

            //#//assert fn:Function @Class.Base#on

            // 获取本对象 本对象的数据内容 本事件值
            var me = this,

                // 获取存储事件对象的空间。
                data = me.$event || (me.$event = {}),

                // 获取当前事件对应的函数监听器。
                eventHandler = data[type];

            // 生成默认的事件作用域。
            scope = [fn, scope || me];

            // 如果未绑定过这个事件, 则不存在监听器，先创建一个有关的监听器。
            if (!eventHandler) {

                // 生成实际处理事件的监听器。
                data[type] = eventHandler = function () {
                    var handlers = arguments.callee.handlers.slice(0),
                        handler,
                        i = 0,
                        length = handlers.length;

                    // 循环直到 return false。
                    while (i < length) {
                        handler = handlers[i++];
                        if (handler[0].apply(handler[1], arguments) === false) {
                            return false;
                        }
                    }

                    return true;
                };

                // 当前事件的全部函数。
                eventHandler.handlers = [scope];

            } else {

                // 添加到 handlers 。
            	eventHandler.handlers.push(scope);
            }


            return me;
        },

        /**
         * 手动触发一个监听器。
         * @param {String} eventName 监听名字。
         * @param {Object} [e] 传递给监听器的事件对象。
         * @return this
         * @example <pre>
         *
         * // 创建一个类 A
         * var A = new Class({
         *
         * });
         *
         * // 创建一个变量。
         * var a = new A();
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
        trigger: function (type) {

            // 获取本对象 本对象的数据内容 本事件值 。
            var data = this.$event;

            // 执行事件。
            return !data || !(data = data[type]) || (arguments.length <= 1 ? data() : data.apply(null, [].slice.call(arguments, 1)));

        },

        /**
         * 删除一个或多个事件监听器。
         * @param {String} [eventName] 事件名。如果不传递此参数，则删除全部事件的全部监听器。
         * @param {Function} [eventHandler] 回调器。如果不传递此参数，在删除指定事件的全部监听器。
         * @return this
         * @remark
         * 注意: `function () {} !== function () {}`, 这意味着下列代码的 un 将失败:
         * <pre>
         * elem.on('click', function () {});
         * elem.un('click', function () {});   // 无法删除 on 绑定的函数。
         * </pre>
         * 正确的做法是把函数保存起来。 <pre>
         * var fn =  function () {};
         * elem.on('click', fn);
         * elem.un('click', fn); // fn  被成功删除。
         *
         * 如果同一个 *eventListener* 被增加多次， un 只删除第一个。
         * </pre>
         * @example
         * <pre>
         *
         * // 创建一个类 A
         * var A = new Class({
         *
         * });
         *
         * // 创建一个变量。
         * var a = new A();
         *
         * var fn = function (e) {
         * 		return true;
         * };
         *
         * // 绑定一个 click 事件。
         * a.on('click', fn);
         *
         * // 删除一个 click 事件。
         * a.un('click', fn);
         * </pre>
         */
        un: function (type, fn) {

            //#//assert fn:Function? @Class.Base#un

            // 获取本对象 本对象的数据内容 本事件值
            var me = this,
                data = me.$event,
                eventHandler,
                handlers,
                i;

            if (data) {

                // 获取指定事件的监听器。
                if (eventHandler = data[type]) {

                    // 如果删除特定的处理函数。
                    // 搜索特定的处理函数。
                    if (fn) {

                        handlers = eventHandler.handlers;
                        i = handlers.length;

                        // 根据常见的需求，这里逆序搜索有助于提高效率。
                        while (i-- > 0) {

                            if (handlers[i][0] === eventHandler) {

                                // 删除 hander 。
                                handlers.splice(i, 1);

                                // 如果删除后只剩 0 个句柄，则删除全部数据。
                                fn = handlers.length;

                                break;
                            }
                        }

                    }

                    // 检查是否存在其它函数或没设置删除的函数。
                    if (!fn) {

                        // 删除对事件处理句柄的全部引用，以允许内存回收。
                        delete data[type];
                    }
                } else if (!type) {
                    for (type in data)
                        delete data[type];
                }
            }
            return me;
        },

        /**
         * 增加一个仅监听一次的事件监听者。
         * @param {String} type 事件名。
         * @param {Function} listener 监听函数。当事件被处罚时会执行此函数。
         * @param {Object} scope=this *listener* 执行时的作用域。
         * @return this
         * @example <pre>
         *
         * // 创建一个类 A
         * var A = new Class({
         *
         * });
         *
         * // 创建一个变量。
         * var a = new A();
         *
         * a.once('click', function (e) {
         * 		trace('click 被触发了');
         * });
         *
         * a.trigger('click');   //  输出  click 被触发了
         * a.trigger('click');   //  没有输出
         * </pre>
         */
        once: function (type, fn, scope) {

            //#//assert fn:Function @Class.Base#once

            // 先插入一个用于删除句柄的函数。
            return this.on(type, function () {
                this.un(type, fn).un(type, arguments.callee);
            }, this).on(type, fn, scope);
        }

        //#endregion

    };

    /**
	 * 扩展当前类的动态方法。
	 * @param {Object} members 用于扩展的成员列表。
	 * @return this
	 * @see #implementIf
	 * @example 以下示例演示了如何扩展 Number 类的成员。<pre>
	 * Number.implement({
	 *      sin: function () {
	 * 	        return Math.sin(this);
	 *      }
	 * });
	 *
	 * (1).sin();  //  Math.sin(1);
	 * </pre>
	 */
    Base.implement = function (members) {

        //#//assert this.prototype @MyClass.implement: MyClass.prototype is undefined.

        // 直接将成员复制到原型上即可 。
        Object.extend(this.prototype, members);

        return this;
    };

    /**
	 * 继承当前类创建并返回子类。
	 * @param {Object/Function} [methods] 子类的员或构造函数。
	 * @return {Function} 返回继承出来的子类。
	 * @remark
	 * 在 Javascript 中，继承是依靠原型链实现的， 这个函数仅仅是对它的包装，而没有做额外的动作。
	 *
	 * 成员中的 constructor 成员 被认为是构造函数。
	 *
	 * 这个函数实现的是 单继承。如果子类有定义构造函数，则仅调用子类的构造函数，否则调用父类的构造函数。
	 *
	 * 要想在子类的构造函数调用父类的构造函数，可以使用 {@link JPlus.Base#base} 调用。
	 *
	 * 这个函数返回的类实际是一个函数，但它被 {@link Class.Native} 修饰过。
	 *
	 * 由于原型链的关系， 肯能存在共享的引用。 如: 类 A ， A.prototype.c = []; 那么，A的实例 b ,
	 * d 都有 c 成员， 但它们共享一个 A.prototype.c 成员。 这显然是不正确的。所以你应该把 参数 quick
	 * 置为 false ， 这样， A创建实例的时候，会自动解除共享的引用成员。 当然，这是一个比较费时的操作，因此，默认
	 * quick 是 true 。
	 *
	 * 也可以把动态成员的定义放到 构造函数， 如: this.c = []; 这是最好的解决方案。
	 *
	 * @example 下面示例演示了如何创建一个子类。
	 * <pre>
	 * var MyClass = new Class(); //创建一个类。
	 *
	 * var Child = MyClass.extend({  // 创建一个子类。
	 * 	  type: 'a'
	 * });
	 *
	 * var obj = new Child(); // 创建子类的实例。
	 * </pre>
	 */
    Base.extend = function (members) {

        // 未指定函数 使用默认构造函数(Object.prototype.constructor);

        // 生成子类 。
        var subClass = members && members.hasOwnProperty("constructor") ? members.constructor : function () {

            // 调用父类构造函数 。
            return arguments.callee.base.apply(this, arguments);

        }, delegateClass = function () {

        	// 覆盖构造函数。
        	this.constructor = subClass;
        };

    	// 在高级浏览器优先使用 __proto__ 以节约内存。
        if (subClass.__proto__) {
        	subClass.__proto__ = Base;
        } else {
        	Object.extend(subClass, Base);
        }

        // 代理类 。
        delegateClass.prototype = this.prototype;

        // 指定成员 。
        subClass.prototype = Object.extend(new delegateClass, members);

		// 绑定父类。
        subClass.base = this;

        // 创建类 。
        return subClass;

    };

    /**
	 * 创建一个类。
	 * @param {Object/Function} [methods] 类成员列表对象或类构造函数。
	 * @return {Function} 返回创建的类。
	 * @see Class.Base
	 * @see Class.Base.extend
	 * @example 以下代码演示了如何创建一个类:
	 * <pre>
	 * var MyCls = Class({
	 *
	 *    constructor: function (a, b) {
	 * 	      alert('构造函数执行了 ' + a + b);
	 *    },
	 *
	 *    say: function(){
	 *    	alert('调用了 say 函数');
	 *    }
	 *
	 * });
	 *
	 *
	 * var c = new MyCls('参数1', '参数2');  // 创建类。
	 * c.say();  //  调用 say 方法。
	 * </pre>
	 */
    function Class(members) {

        // 所有类都是继承 Class.Base 创建的。
        return Base.extend(members);
    }

    /**
	 * 所有类的基类。
	 * @abstract class
	 * {@link Class.Base} 提供了全部类都具有的基本函数。
	 */
    Class.Base = Base;

    return Class;

})();
/*********************************************************
 * dom/base.js
 ********************************************************//**
 * @author xuld
 * @fileOverview 提供 DOM 操作的辅助函数。
 */

//#include core/class.js

var Dom = (function () {

    //#region Core

    /**
	 * Object.extend 简写。
	 * @type Function
	 */
    var extend = Object.extend,

		/**
		 * Object.map 简写。
		 * @type Object
		 */
		map = Object.map,

		/**
		 * 数组原型。
		 * @type Object
		 */
		ap = Array.prototype,

		/**
		 * 指示当前浏览器是否为标签浏览器。
		 */
		isIE678 = navigator.isIE678,

		/**
		 * 用于测试的元素。
		 * @type Element
		 */
		html = document.documentElement,

		/**
		 * 提供对单一原生 HTML 节点的封装操作。
		 * @class
		 * @remark 
		 * @see Dom
		 * @see Dom.get
		 * @see Dom.query
		 * @remark
		 * 所有 DOM 方法都是依赖于此类进行的。比如如下 HTML 代码:
		 * <pre>
		 * &lt;div id="myDivId"&gt;内容&lt;/div&gt;
		 * </pre>
		 * 现在如果要操作这个节点，必须获取这个节点对应的 **Dom** 对象实例。
		 * 最常用的创建 **Dom** 对象实例的方法是 {@link Dom.get}。如:
		 * <pre>
		 * var myDiv = Dom.get("myDivId");
		 * 
		 * myDiv.addClass("cssClass");
		 * </pre>
		 * 其中，myDiv就是一个 **Dom** 对象。然后通过 **Dom** 对象提供的方法可以方便地操作这个节点。<br>
		 * myDiv.node 属性就是这个 Dom 对象对应的原生 HTML 节点。即:
		 * <pre>
		 * Dom.get("myDivId").node === document.getElementById("myDivId");
		 * </pre>
		 * 
		 * **Dom** 类仅实现了对一个节点的操作，如果需要同时处理多个节点，可以使用 {@link Dom} 类。
		 * 	{@link Dom} 类的方法和 **Dom** 类的方法基本一致。
		 */
		Dom = Class({

		    /**
			 * 获取当前集合的节点个数。
			 * @type {Number}
			 * @property
			 */
		    length: 0,

		    /**
			 * @constructor
			 */
		    constructor: function (nodelist) {
		        if (nodelist) {
		            var i = 0;
		            while (nodelist[i])
		                this[this.length++] = nodelist[i++];
		        }
		    },

		    item: function (index) {
		        var node = this[index < 0 ? this.length + index : index];
		        return new Dom(node && [node]);
		    },

		    add: function (value) {
		        this.push.apply(this, Dom.query(value));
		        return this;
		    },

		    /**
	         * 遍历 Dom 对象，并对每个元素执行 setter。
	         */
		    iterate: function (fn, args) {
		        var i = 0, len = this.length;
		        ap.unshift.call(args, 0);
		        while (i < len) {
		            args[0] = this[i++];
		            fn.apply(Dom, args);
		        }
		        return this;
		    },

		    map: function (fn, args) {
		    	var me = this, ret = new me.constructor(), t;
		    	for (var i = 0 ; i < me.length; i++) {
		    		if (t = fn(me[i], args)) {
		    			if (t instanceof Dom) {
		    				ret.push.apply(ret, t);
		    			} else {
		    				ret.push(t);
		    			}
		    		}
		    	}
		    	return ret;
		    },

		    filter: function (selector) {
		    	return this.map(typeof selector === 'string' ? function (elem, selector) {
		    		return Dom.match(elem, selector) && elem;
		    	} : function (elem, selector) {
		    		return fn(elem) !== false && elem;
		    	}, selector);
		    }

		}),

		/**
		 * Dom.prototype 简写。
		 */
		dp = Dom.prototype;

    // 复制数组函数。
    map("push indexOf each forEach splice slice sort unique", function (fnName, index) {
        dp[fnName] = index < 4 ? ap[fnName] : function () {
            return new Dom(ap[fnName].apply(this, arguments));
        };
    });

    //#endregion

    //#region Selector

    /**
	 * 一个选择器引擎。
	 */
    var Selector, fixGetElementById, nativeQuerySelector, nativeMatchesSelector, rBackslash = /\\/g;

    (function () {
        var div = document.createElement("div");
        div.innerHTML = '<a name="__SELECTOR__"/>';
        html.appendChild(div);

        fixGetElementById = !!document.getElementById('__SELECTOR__');
        nativeQuerySelector = !!div.querySelectorAll;
        nativeMatchesSelector = div.matchesSelector || div.mozMatchesSelector || div.webkitMatchesSelector;

        html.removeChild(div);
        div = null;
    })();

    function addElementsByTagName(elem, tagName, result) {

        if (elem.getElementsByTagName) {
            pushResult(elem.getElementsByTagName(tagName), result);
        } else if (elem.querySelectorAll) {
            pushResult(elem.querySelectorAll(tagName), result);
        }

    }

    function pushResult(nodelist, result) {
        for (var i = 0; nodelist[i]; i++) {
            result[result.length++] = nodelist[i];
        }
    }

    /**
	 * 抛出选择器语法错误。 
	 * @param {String} message 提示。
	 */
    function throwError(message) {
        throw new SyntaxError('An invalid or illegal string was specified : "' + message + '"!');
    }

    Selector = {

        all: function (selector, context) {

            context = context || document;

            // 如果原生支持 querySelectorAll, 则先尝试使用原生的。
            if (nativeQuerySelector) {

                // hack: div.query('div selector') 应该返回空。
                if (context.nodeType === 1) {

                    var oldId = context.id, displayId = oldId;

                    if (!oldId) {
                        context.id = displayId = '__SELECTOR__';
                        oldId = 0;
                    }

                    try {
                        return new Dom(context.querySelectorAll('#' + displayId + ' ' + selector));
                    } catch (e) {
                    } finally {
                        if (oldId === 0) {
                            context.removeAttribute('id');
                        }
                    }
                } else {
                    try {
                        return new Dom(context.querySelectorAll(selector));
                    } catch (e) {

                    }
                }

            }

            return Selector.query(selector, context);
        },

        one: function (selector, context) {

            context = context || document;

            // 如果原生支持 querySelectorAll, 则先尝试使用原生的。
            if (nativeQuerySelector) {

                // hack: div.query('div selector') 应该返回空。
                if (context.nodeType === 1) {

                    var oldId = context.id, displayId = oldId;

                    if (!oldId) {
                        context.id = displayId = '__SELECTOR__';
                        oldId = 0;
                    }

                    try {
                        return context.querySelector('#' + displayId + ' ' + selector);
                    } catch (e) {
                    } finally {
                        if (oldId === 0) {
                            context.removeAttribute('id');
                        }
                    }
                } else {
                    try {
                        return context.querySelector(selector);
                    } catch (e) {

                    }
                }

            }

            return Selector.query(selector, context)[0] || null;
        },

    	/**
		 * 检查当前 Dom 对象是否符合指定的表达式。
		 * @param {String} String
		 * @return {Boolean} 如果匹配表达式就返回 true，否则返回  false 。
		 * @example
		 * 由于input元素的父元素是一个表单元素，所以返回true。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;form&gt;&lt;input type="checkbox" /&gt;&lt;/form&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("input[type='checkbox']").match("input")</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">true</pre>
		 */
        match: function (elem, selector, context) {

            //if (elem.nodeType !== 1)
            //	return false;

            // 判断的第一步：使用原生的判断函数。

            try {
                return nativeMatchesSelector.call(elem, selector.replace(/\[([^=]+)=\s*([^'"\]]+?)\s*\]/g, '[$1="$2"]'));
            } catch (e) {

            }

            // 判断的第二步：使用简单过滤器。

            var t = [elem], i, doc = elem.ownerDocument;

            if (!Selector.filter(selector, t)) {
                return t.length > 0;
            }

        	// 判断的第三步：使用查询的方式判断。

            context = context || doc;

            // 未添加到 DOM 树的节点是无法找到的，因此，首先将节点追加到 DOM 树进行判断。
            if (Dom.contains(doc.body, elem)) {
                try {
                	t = context.querySelectorAll(selector);
                } catch (e) {
                	t = Selector.query(selector, context);
                }
            } else {

                i = elem;
                while (i.parentNode)
                    i = i.parentNode;

                doc.documentElement.appendChild(i);

                try {
                	t = Selector.all(selector, context);
                } finally {
                    doc.documentElement.removeChild(i);
                }
            }

            for (i = 0; t[i]; i++)
                if (t[i] === elem)
                    return true;

            return false;
        },

        /**
		 * 使用指定的选择器代码对指定的结果集进行一次查找。
		 * @param {String} selector 选择器表达式。
		 * @param {DomList/Dom} result 上级结果集，将对此结果集进行查找。
		 * @return {DomList} 返回新的结果集。
		 */
        query: function (selector, context) {

            var result = new Dom(),
				match,
				value,
				prevResult,
				lastSelector,
				elem,
				i;

            selector = selector.trim();

            // 解析的第一步: 解析简单选择器

            // ‘*’ ‘tagName’ ‘.className’ ‘#id’
            if (match = /^(^|[#.])((?:[-\w]|[^\x00-\xa0]|\\.)+)$/.exec(selector)) {

                value = match[2].replace(rBackslash, "");

                switch (match[1]) {

                    // ‘#id’
                    case '#':

                        // 仅对 document 使用 getElementById 。
                        if (context.nodeType === 9) {
                            prevResult = context.getElementById(value);
                            if (prevResult && (!fixGetElementById || prevResult.getAttributeNode("id").nodeValue === value)) {
                                result[result.length++] = prevResult;
                            }
                            return result;
                        }

                        break;

                        // ‘.className’
                    case '.':

                        // 仅优化存在 getElementsByClassName 的情况。
                        if (context.getElementsByClassName) {
                            pushResult(context.getElementsByClassName(value), result);
                            return result;
                        }

                        break;

                        // ‘*’ ‘tagName’
                    default:
                        addElementsByTagName(context, value, result);
                        return result;

                }

            }

            // 解析的第二步: 获取所有子节点。并不断进行筛选。

            prevResult = [context];

            // 解析分很多步进行，每次解析  selector 的一部分，直到解析完整个 selector 。
            for (; ;) {

                // 保存本次处理前的选择器。
                // 用于在本次处理后检验 selector 是否有变化。
                // 如果没变化，说明 selector 不能被正确处理，即 selector 包含非法字符。
                lastSelector = selector;

                // 解析的第三步: 获取所有子节点。第四步再一一筛选。
                // 针对子选择器和标签选择器优化(不需要获取全部子节点)。

                // ‘ selector’ ‘>selector’ ‘~selector’ ‘+selector’
                if (match = /^\s*([>+~\s])\s*(\*|(?:[-\w*]|[^\x00-\xa0]|\\.)*)/.exec(selector)) {

                    selector = RegExp.rightContext;
                    value = match[2].replace(rBackslash, "").toUpperCase() || "*";

                    for (i = 0; elem = prevResult[i]; i++) {
                        switch (match[1]) {
                            case ' ':
                                addElementsByTagName(elem, value, result);
                                break;

                            case '>':
                                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                                    if (elem.nodeType === 1 && (value === "*" || value === elem.tagName)) {
                                        result[result.length++] = elem;
                                    }
                                }
                                break;

                            case '+':
                                while (elem = elem.nextSibling) {
                                    if (elem.nodeType === 1) {
                                        if ((value === "*" || value === elem.tagName)) {
                                            result[result.length++] = elem;
                                        }
                                        break;
                                    }
                                }

                                break;

                            case '~':
                                while (elem = elem.nextSibling) {
                                    if (elem.nodeType === 1 && (value === "*" || value === elem.tagName)) {
                                        result[result.length++] = elem;
                                    }
                                }
                                break;

                            default:
                                throwError(match[0]);
                        }
                    }


                } else {

                    // ‘tagName’ ‘*’ 
                    if (match = /^((?:[-\w\*]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
                        value = match[1].replace(rBackslash, "").toUpperCase();
                        selector = RegExp.rightContext;
                    } else {
                    	value = "*";
                    }

                    for (i = 0; elem = prevResult[i]; i++) {
                        addElementsByTagName(elem, value, result);
                    }

                }

                if (prevResult.length > 1) {
                    result.unique();
                }

                // 解析的第四步: 筛选第三步返回的结果。

                // 如果没有剩余的选择器，说明节点已经处理结束。
                if (selector) {

                    // 进行过滤筛选。
                    selector = Selector.filter(selector, result);

                }

                // 如果筛选后没有其它选择器。返回结果。
                if (!selector) {
                    break;
                }

                // 解析的第五步: 解析, 如果存在，则继续。

                // ‘,selectpr’ 
                if (match = /^\s*,\s*/.exec(selector)) {
                    result.add(Selector.query(RegExp.rightContext, context)).unique();
                    break;
                }

                // 存储当前的结果值，用于下次继续筛选。
                prevResult = result;

                // 清空之前的属性值。
                result = new Dom();

                // 如果没有一个正则匹配选择器，则这是一个无法处理的选择器，向用户报告错误。
                if (lastSelector.length === selector.length) {
                    throwError(selector);
                }
            }

            return result;
        },

        filter: function (selector, result) {

            var match, filterFn, value, code;

            // ‘#id’ ‘.className’ ‘:filter’ ‘[attr’
            while (match = /^([#\.:]|\[\s*)((?:[-\w]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {

                selector = RegExp.rightContext;
                
                if(result.length) {
	
                	code = match[0];

	                filterFn = (Selector.filterFn || (Selector.filterFn = {}))[code];
	
	                // 如果不存在指定过滤器的特定函数，则先编译一个。
	                if (!filterFn) {
	
	                    filterFn = 'for(var n=0,i=0,e,t;e=r[i];i++){t=';
	                    value = match[2].replace(rBackslash, "");
	
	                    switch (match[1]) {
	
	                        // ‘#id’
	                        case "#":
	                            filterFn += 'Dom.getAttr(e,"id")===v';
	                            break;
	
	                            // ‘.className’
	                        case ".":
	                            filterFn += 'Dom.hasClass(e,v)';
	                            break;
	
	                            // ‘:filter’
	                        case ":":
	
	                            filterFn += Selector.pseudos[value] || throwError(match[0]);
	
	                            // ‘selector:nth-child(2)’
	                            if (match = /^\(\s*("([^"]*)"|'([^']*)'|[^\(\)]*(\([^\(\)]*\))?)\s*\)/.exec(selector)) {
	                                selector = RegExp.rightContext;
	                                value = match[3] || match[2] || match[1];
	                            }
	
	                            break;
	
	                            // ‘[attr’
	                        default:
	                            value = [value.toLowerCase()];
	
	                            // ‘selector[attr]’ ‘selector[attr=value]’ ‘selector[attr='value']’  ‘selector[attr="value"]’    ‘selector[attr_=value]’
	                            if (match = /^\s*(?:(\S?=)\s*(?:(['"])(.*?)\2|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/.exec(selector)) {
	                                selector = RegExp.rightContext;
	                                if (match[1]) {
	                                    value[1] = match[1];
	                                    value[2] = match[3] || match[4];
	                                    value[2] = value[2] ? value[2].replace(/\\([0-9a-fA-F]{2,2})/g, function (x, y) {
	                                        return String.fromCharCode(parseInt(y, 16));
	                                    }).replace(rBackslash, "") : "";
	                                }
	                            }
	
	                            filterFn += 'Dom.getAttr(e,v[0])' + (Selector.relative[value[1]] || throwError(code));
	
	                    }
	
	                    filterFn += ';if(t)r[n++]=e;}while(r.length>n)delete r[--r.length];';
	
	                    Selector.filterFn[code] = filterFn = new Function('r', 'v', filterFn);
	
	                    filterFn.value = value;
	
	                }
	
	                filterFn(result, filterFn.value);
	                
                }

            }

            return selector;

        },

        /**
		 * 用于查找所有支持的伪类的函数集合。
		 * @private
		 * @static
		 */
        pseudos: {
            target: 'window.location&&window.location.hash;t=t&&t.slice(1)===e.id',
            empty: 'Dom.isEmpty(e)',
            contains: 'Dom.getText(e).indexOf(v)>=0',
            hidden: 'Dom.isHidden(e)',
            visible: '!Dom.isHidden(e)',

            not: '!Dom.match(e, v)',
            has: '!Dom.find(v, e)',

            selected: 'Dom.attrHooks.selected.get(e, "selected", 1)',
            checked: 'e.checked',
            enabled: 'e.disabled===false',
            disabled: 'e.disabled===true',

            input: '^(input|select|textarea|button)$/i.test(e.nodeName)',

            "nth-child": 'Dom.index(elem)+1;t=v==="odd"?t%2:v==="even"?t%2===0:t===v',
            "first-child": '!Dom.prev(elem)',
            "last-child": '!Dom.next(elem)',
            "only-child": '!Dom.prev(elem)&&!Dom.next(elem)'

        },

        relative: {
            'undefined': '!=null',
            '=': '===v[2]',
            '~=': ';t=(" "+t+" ").indexOf(" "+v[2]+" ")>=0',
            '!=': '!==v[2]',
            '|=': ';t=("-"+t+"-").indexOf("-"+v[2]+"-")>=0',
            '^=': ';t=t&&t.indexOf(v[2])===0',
            '$=': ';t=t&&t.indexOf(v[2].length-t.length)===v[2]',
            '*=': ';t=t&&t.indexOf(v[2])>=0'
        }

    };

    //#endregion

    //#region Helper

    /**
	 * 获取元素的文档。
	 * @param {Node} node 元素。
	 * @return {Document} 文档。
	 */
    function getDocument(node) {
        ////assert.isNode(node, 'Dom.getDocument(node): {node} ~', node);
        return node.ownerDocument || node.document || node;
    }

    /**
	 * 执行一个 CSS 选择器，返回一个新的 {@link Dom} 对象。
	 * @param {String/NodeList/Dom/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点列表。
	 * @return {Element} 如果没有对应的节点则返回一个空的 Dom 对象。
	 * @static
	 * @see Dom
	 * @example
	 * 找到所有 p 元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 * </pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.query("p");
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
	 * Dom.query("div &gt; p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * [ &lt;p&gt;two&lt;/p&gt; ]
	 * </pre>
	 * 
	 * <br>
	 * 查找所有的单选按钮(即: type 值为 radio 的 input 元素)。
	 * <pre>Dom.query("input[type=radio]");</pre>
	 */
    Dom.query = function (selector, context) {

        // Dom.query("selector")
        return typeof selector === 'string' ? Selector.all(selector, context) :

				// Dom.query(dom)
				selector instanceof Dom ? selector :

					// Dom.query(node)
					selector && (selector.nodeType || selector.setInterval) ? new Dom([selector]) :

						// Dom.query()/Dom.query(nodelist)
						new Dom(selector);

    };

    /**
	 * 根据一个 *id* 或原生节点获取一个 {@link Dom} 类的实例。
	 * @param {String/Node/Dom/Dom} id 要获取元素的 id 或用于包装成 Dom 对象的任何元素，如是原生的 DOM 节点、原生的 DOM 节点列表数组或已包装过的 Dom 对象。。
	 * @return {Dom} 此函数返回是一个 Dom 类型的变量。通过这个变量可以调用所有文档中介绍的 DOM 操作函数。如果无法找到指定的节点，则返回 null 。此函数可简写为 $。
	 * @static
	 * @example
	 * 找到 id 为 a 的元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p id="a"&gt;once&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 * </pre>
	 * #####JavaScript:
	 * <pre>Dom.get("a");</pre>
	 * #####结果:
	 * <pre>{&lt;p id="a"&gt;once&lt;/p&gt;}</pre>
	 * 
	 * <br>
	 * 返回 id 为 a1 的 DOM 对象
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;p id="a1"&gt;&lt;/p&gt; &lt;p id="a2"&gt;&lt;/p&gt; </pre>
	 *
	 * #####JavaScript:
	 * <pre>Dom.get(document.getElecmentById('a1')) // 等效于 Dom.get('a1')</pre>
	 * <pre>Dom.get(['a1', 'a2']); // 等效于 Dom.get('a1')</pre>
	 * <pre>Dom.get(Dom.get('a1')); // 等效于 Dom.get('a1')</pre>
	 * 
	 * #####结果:
	 * <pre>{&lt;p id="a1"&gt;&lt;/p&gt;}</pre>
	 */
    Dom.get = function (id) {
        return typeof id !== "string" ? (!id || id.nodeType || id.setInterval ? id : id[0]) || null : document.getElementById(id);
    };

    /**
	 * 执行一个 CSS 选择器，返回第一个元素对应的 {@link Dom} 对象。
	 * @param {String/NodeList/Dom/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点。
	 * @return {Element} 如果没有对应的节点则返回一个空的 Dom 对象。
	 * @static
	 * @see Dom
	 * @example
	 * 找到第一个 p 元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 * </pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.find("p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * {  &lt;p&gt;one&lt;/p&gt;  }
	 * </pre>
	 * 
	 * <br>
	 * 找到第一个 p 元素，并且这些元素都必须是 div 元素的子元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.find("div &gt; p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * { &lt;p&gt;two&lt;/p&gt; }
	 * </pre>
	 */
    Dom.find = function (selector, context) {
        return typeof selector !== "string" ? (!selector || selector.nodeType || selector.setInterval ? selector : selector[0]) || null : Selector.one(selector, context);
    };

    Dom.match = function (elem, selector, context) {
    	return elem.nodeType === 1 && Selector.match(elem, selector, context);
    };

    /**
	 * 获取当前类对应的数据字段。
	 * @protected override
	 * @return {Object} 一个可存储数据的对象。
	 * @remark
	 * 此函数会在原生节点上创建一个 $data 属性以存储数据。
	 */
    Dom.data = function (node) {

        // 将数据绑定在原生节点上。
        // 这在 IE 6/7 存在内存泄露问题。由于 IE 6/7 即将退出市场。此处忽略。
        return (node.nodeType === 1 || node.nodeType === 9 || node.setInterval) ? node.$data || (node.$data = {}) : null;
    };

    /**
	 * 获取元素的文档。
	 * @param {Element} elem 元素。
	 * @return {Document} 文档。
	 * @static
	 */
    Dom.getDocument = getDocument;

    Dom.Selector = Selector;

    //#endregion

    //#region Parse

    /**
	 * 新元素缓存。
	 * @type Object
	 * @remark 在 Dom.parse 使用。
	 */
    var parseCache = {},

		/**
		 * 对 HTML 字符串进行包装用的字符串。
		 * @type Object 部分元素只能属于特定父元素， parseFix 列出这些元素，并使它们正确地添加到父元素中。 IE678
		 *       会忽视第一个标签，所以额外添加一个 div 标签，以保证此类浏览器正常运行。
		 * @remark 在 Dom.parse 和 Dom#setHtml 使用。
		 */
		parseFix = Dom.parseFix = {
		    $default: isIE678 ? [1, '$<div>', '</div>'] : [0, '', ''],
		    option: [1, '<select multiple="multiple">', '</select>'],
		    legend: [1, '<fieldset>', '</fieldset>'],
		    thead: [1, '<table>', '</table>'],
		    tr: [2, '<table><tbody>', '</tbody></table>'],
		    td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
		    col: [3, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
		    area: [1, '<map>', '</map>']
		},

		/**
		 * 判断选择框的正则表达式。
		 * @type RegExp
		 * @remark Dom.parse 和 Dom#clone 使用。
		 */
		rCheckBox = /^(?:checkbox|radio)$/,

		/**
		 * 处理 <div/> 格式标签的正则表达式。
		 * @type RegExp
		 */
		rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;

    // 初始化 parseFix。
    parseFix.optgroup = parseFix.option;
    parseFix.tbody = parseFix.tfoot = parseFix.colgroup = parseFix.caption = parseFix.thead;
    parseFix.th = parseFix.td;

    /**
	 * 解析一个 html 字符串，返回相应的原生节点。
	 * @param {String/Element} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
	 * @param {Element} context=document 生成节点使用的文档中的任何节点。
	 * @param {Boolean} cachable=true 指示是否缓存节点。这会加速下次的解析速度。
	 * @return {Element/TextNode/DocumentFragment} 如果 HTML 是纯文本，返回 TextNode。如果 HTML 包含多个节点，返回 DocumentFragment 。否则返回 Element。
	 * @static
	 */
    Dom.parseNode = function (html, context, cachable) {

        // 不是 html，直接返回。
        if (typeof html === 'string') {

            var srcHTML = html, div, tag, wrap;

            // 仅缓存 512B 以内的 HTML 字符串。
            cachable = cachable !== false && srcHTML.length < 512;
            context = context && context.ownerDocument || document;

            ////assert(context.createElement, 'Dom.parseNode(html, context, cachable): {context} 必须是 DOM 节点。', context);

            // 查找是否存在缓存。
            if (cachable && (html = parseCache[srcHTML]) && html.ownerDocument === context) {

                // 复制并返回节点的副本。
                html = html.cloneNode(true);

            } else {

                // 测试查找 HTML 标签。
                if (tag = /<([!\w:]+)/.exec(srcHTML)) {

                    ////assert.isString(srcHTML, 'Dom.parseNode(html, context, cachable): {html} ~');
                    div = context.createElement("div");

                    wrap = Dom.parseFix[tag[1].toLowerCase()] || Dom.parseFix.$default;

                    // IE8- 会过滤字符串前的空格。
                    // 为了保证全部浏览器统一行为，此处删除全部首尾空格。

                    div.innerHTML = wrap[1] + srcHTML.trim().replace(rXhtmlTag, "<$1></$2>") + wrap[2];

                    // IE67: 如果节点未添加到文档。需要重置 checkbox 的 checked 属性。
                    if (navigator.isIE67) {
                        Object.each(div.getElementsByTagName('INPUT'), function (elem) {
                            if (rCheckBox.test(elem.type)) {
                                elem.checked = elem.defaultChecked;
                            }
                        });
                    }

                    // IE 下有些标签解析会错位，这里转到实际的节点位置。
                    for (tag = wrap[0]; tag--;)
                        div = div.lastChild;

                    ////assert.isNode(div, "Dom.parseNode(html, context, cachable): 无法根据 {html} 创建节点。", srcHTML);

                    // 获取第一个节点。
                    html = div.firstChild;

                    // 如果有多个节点，则返回 Dom 对象。
                    if (html === div.lastChild) {

                        // 删除用于创建节点的父 DIV 标签。
                        div.removeChild(html);

                    } else {

                        html = new Dom;

                        cachable = false;

                        for (tag = div.firstChild; tag; tag = wrap) {

                            // 先记录 标签的下一个节点。
                            wrap = tag.nextSibling;

                            // 删除用于创建节点的父 DIV 标签。
                            div.removeChild(tag);

                            // 保存节点。
                            html.push(tag);

                        }

                    }

                    div = null;

                    // 如果可以，先进行缓存。优化下次的节点解析。
                    if (cachable && !/<(?:script|object|embed|option|style)/i.test(srcHTML)) {
                        parseCache[srcHTML] = html.cloneNode(true);
                    }

                } else {

                    // 创建文本节点。
                    html = context.createTextNode(srcHTML);
                }

            }

        }

        return html;

    };

    /**
	 * 根据提供的原始 HTML 标记字符串，解析并动态创建一个节点，并返回这个节点的 Dom 对象包装对象。
	 * @param {String/Node} html 用于动态创建DOM元素的HTML字符串。
	 * @param {Document} ownerDocument=document 创建DOM元素所在的文档。
	 * @param {Boolean} cachable=true 指示是否缓存节点。
	 * @return {Dom} Dom 对象。
	 * @static
	 * @remark
	 * 可以传递一个手写的 HTML 字符串，或者由某些模板引擎或插件创建的字符串，也可以是通过 AJAX 加载过来的字符串。但是在你创建 input 元素的时会有限制，可以参考第二个示例。当然这个字符串可以包含斜杠 (比如一个图像地址)，还有反斜杠。当创建单个元素时，请使用闭合标签或 XHTML 格式。
	 * 在这个函数的内部，是通过临时创建一个元素，并将这个元素的 innerHTML 属性设置为给定的标记字符串，来实现标记到 DOM 元素转换的。所以，这个函数既有灵活性，也有局限性。
	 * 
	 * @example
	 * 动态创建一个 div 元素（以及其中的所有内容），并将它追加到 body 元素中。
	 * #####JavaScript:
	 * <pre>Dom.parse("&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;").appendTo(document.body);</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;]</pre>
	 * 
	 * 创建一个 &lt;input&gt; 元素必须同时设定 type 属性。因为微软规定 &lt;input&gt; 元素的 type 只能写一次。
	 * #####JavaScript:
	 * <pre>
	 * // 在 IE 中无效:
	 * Dom.parse("&lt;input&gt;").setAttr("type", "checkbox");
	 * // 在 IE 中有效:
	 * Dom.parse("&lt;input type='checkbox'&gt;");
	 * </pre>        
	 */
    Dom.parse = function (html, context, cachable) {
        return Dom.query(Dom.parseNode(html, context, cachable));
    };

    //#endregion

    //#region Attribute

    /**
	 * 默认用于获取和设置属性的函数。
	 */
    var defaultHook = {
        getProp: function (elem, name) {
            return name in elem ? elem[name] : null;
        },
        setProp: function (elem, name, value) {

            // 不对 2,3,8 节点类型设置属性。
            if ('238'.indexOf(elem.nodeType) === -1) {
                elem[name] = value;
            }
        },

        get: function (elem, name) {
            return elem.getAttribute ? elem.getAttribute(name) : this.getProp(elem, name);
        },
        set: function (elem, name, value) {
            if (elem.setAttribute) {

                // 如果设置值为 null, 表示删除属性。
                if (value === null) {
                    elem.removeAttribute(name);
                } else {
                    elem.setAttribute(name, value);
                }
            } else {
                this.setProp(elem, name, value);
            }
        }
    },

		/**
		 * 获取和设置优先使用 prop 而不是 attr 的特殊属性的函数。
		 * @remark 在 Dom.getAtt, Dom.setAtt, Dom.getText 使用。
		 */
		propHook = {
		    get: function (elem, name, type) {
		        return type || !(name in elem) ? defaultHook.get(elem, name) : elem[name];
		    },
		    set: function (elem, name, value) {
		        if (name in elem) {
		            elem[name] = value;
		        } else {
		            defaultHook.set(elem, name, value);
		        }
		    }
		},

		/**
		 * 获取和设置返回类型是 boolean 的特殊属性的函数。
		 */
		boolHook = {
		    get: function (elem, name, type) {
		        var value = name in elem ? elem[name] : defaultHook.get(elem, name);
		        return type ? value ? name.toLowerCase() : null : !!value;
		    },
		    set: function (elem, name, value) {
		        elem[name] = value;
		    }
		},

		/**
		 * 获取和设置 FORM 专有属性的函数。
		 */
		formHook = {
		    get: function (elem, name, type) {
		        var value = defaultHook.get(elem, name);
		        if (!type && !value) {

		            // elem[name] 被覆盖成 DOM 节点，创建空的 FORM 获取默认值。
		            if (elem[name].nodeType) {
		                elem = document.createElement('form');
		            }
		            value = elem[name];
		        }
		        return value;
		    },
		    set: defaultHook.set
		},

		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attrFix = Dom.attrFix = {
		    innerText: 'innerText' in html ? 'innerText' : 'textContent'
		},

		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attrHooks = Dom.attrHooks = {

		    maxLength: {
		        get: propHook.get,
		        set: function (elem, name, value) {
		            if (value || value === 0) {
		                elem[name] = value;
		            } else {
		                defaultHook.set(elem, name, null);
		            }
		        }
		    },

		    selected: {
		        get: function (elem, name, type) {

		            // Webkit、IE 误报 Selected 属性。
		            // 通过调用 parentNode 属性修复。
		            var parent = elem.parentNode;

		            // 激活 select, 更新 option 的 select 状态。
		            if (parent) {
		                parent.selectedIndex;

		                // 同理，处理 optgroup 
		                if (parent.parentNode) {
		                    parent.parentNode.selectedIndex;
		                }
		            }

		            // type  0 => boolean , 1 => "selected",  2 => defaultSelected => "selected"
		            return name in elem ? type ? (type === 1 ? elem[name] : elem.defaultSelected) ? name : null : elem[name] : defaultHook.get(elem, name);

		        },
		        set: boolHook.set
		    },

		    checked: {
		        get: function (elem, name, type) {
		            // type  0 => boolean , 1 => "checked",  2 => defaultChecked => "checked"
		            return name in elem ? type ? (type === 1 ? elem[name] : elem.defaultChecked) ? name : null : elem[name] : defaultHook.get(elem, name);
		        },
		        set: boolHook.set
		    },

		    value: {
		        get: function (elem, name, type) {
		            // type  0/1 => "value",  2 => defaultValue => "value"
		            return name in elem ? type !== 2 ? elem[name] : elem.defaultValue : defaultHook.get(elem, name);
		        },
		        set: propHook.set
		    },

		    tabIndex: {
		        get: function (elem, name, type) {
		            // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
		            // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
		            var value = elem.getAttributeNode(name);
		            value = value && value.specified && value.value || null;
		            return type ? value : +value;
		        },
		        set: propHook.set
		    }

		},

		/**
		 * 获取文本时应使用的属性值。
		 * @private
		 * @static
		 */
		textFix = Dom.textFix = {};

    map("defaultChecked defaultSelected readOnly disabled autofocus autoplay async controls hidden loop open required scoped compact noWrap isMap declare noshade multiple noresize defer useMap", function (attr) {
        attrHooks[attr] = boolHook;
    });

    // 初始化 attrHooks。
    map("enctype encoding action method target", function (attr) {
        attrHooks[attr] = formHook;
    });

    map("readOnly tabIndex defaultChecked defaultSelected accessKey useMap contentEditable maxLength", function (value) {
        attrFix[value.toLowerCase()] = value;
    });
    map("innerHTML innerText textContent tagName nodeName nodeType nodeValue defaultValue selectedIndex cellPadding cellSpacing rowSpan colSpan frameBorder", function (value) {
        attrFix[value.toLowerCase()] = value;
        attrHooks[value] = propHook;
    });

    // 初始化 textFix。
    textFix.INPUT = textFix.SELECT = textFix.TEXTAREA = 'value';
    textFix['#text'] = textFix['#comment'] = 'nodeValue';

    if (isIE678) {

        defaultHook.get = function (elem, name) {

            if (!elem.getAttributeNode) {
                return defaultHook.getProp(elem, name);
            }

            // 获取属性节点，避免 IE 返回属性。
            name = elem.getAttributeNode(name);

            // 如果不存在节点， name 为 null ，如果不存在节点值， 返回 null。
            return name ? name.value || (name.specified ? "" : null) : null;

        };

        defaultHook.set = formHook.set = function (elem, name, value) {

            if (elem.getAttributeNode) {

                // 获取原始的属性节点。
                var node = elem.getAttributeNode(name);

                // 如果 value === null 表示删除节点。
                if (value === null) {

                    // 仅本来存在属性时删除节点。
                    if (node) {
                        node.nodeValue = '';
                        elem.removeAttributeNode(node);
                    }

                    // 本来存在属性值，则设置属性值。
                } else if (node) {
                    node.nodeValue = value;
                } else {
                    elem.setAttribute(name, value);
                }

            } else {
                defaultHook.setProp(elem, name, value);
            }
        };

        // IE678 无法获取 style 属性，改用 style.cssText 获取。
        attrHooks.style = {
            get: function (elem, name) {
                return elem.style.cssText.toLowerCase() || null;
            },
            set: function (elem, name, value) {
                elem.style.cssText = value || '';
            }
        };

        if (navigator.isIE67) {

            // IE 6/7 获取 Button 的value会返回文本。
            attrHooks.value = {

                _get: attrHooks.value.get,

                get: function (elem, name, type) {
                    return elem.tagName === 'BUTTON' ? defaultHook.get(elem, name) : this._get(elem, name, type);
                },

                set: function (elem, name, value) {
                    if (elem.tagName === 'BUTTON') {
                        defaultHook.set(elem, name, value);
                    } else {
                        elem.value = value || '';
                    }
                }
            };

            // IE 6/7 会自动添加值到下列属性。
            attrHooks.href = attrHooks.src = attrHooks.useMap = attrHooks.width = attrHooks.height = {

                get: function (elem, name) {
                    return elem.getAttribute(name, 2);
                },

                set: function (elem, name, value) {
                    elem.setAttribute(name, value);
                }
            };

            // IE 6/7 在设置 contenteditable 为空时报错。
            attrHooks.contentEditable = {

                get: function (elem, name) {

                    // 获取属性节点，避免 IE 返回属性。
                    name = elem.getAttributeNode(name);

                    // 如果不存在节点， name 为 null ，如果不存在节点值， 返回 null。
                    return name && name.specified ? name.value : null;

                },

                set: function (elem, name, value) {
                    if (value === null) {
                        elem.removeAttributeNode(elem.getAttributeNode(name));
                    } else {
                        defaultHook.set(elem, name, value || "false");
                    }
                }
            };

        }

    }

    /**
	 * 获取元素的属性值。
	 * @param {Node} elem 元素。
	 * @param {String} name 要获取的属性名称。
	 * @return {String} 返回属性值。如果元素没有相应属性，则返回 null 。
	 * @static
	 */
    Dom.getAttr = function (elem, name, type) {

        ////assert.isNode(elem, "Dom.getAttr(elem, name, type): {elem} ~");

        // 将小写的属性名改为骆驼形式。
        name = attrFix[name] || name;

        // 获取指定属性钩子。
        var hook = attrHooks[name];

        // 如果存在钩子，使用钩子获取属性。
        // 最后使用 defaultHook 获取。
        return hook ? hook.get(elem, name, type) : defaultHook.get(elem, name.toLowerCase(), type);

    };

    /**
	 * 设置或删除一个 HTML 属性值。
	 * @param {String} name 要设置的属性名称。
	 * @param {String} value 要设置的属性值。当设置为 null 时，删除此属性。
	 * @return this
	 * @example
	 * 为所有图像设置src属性。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;img/&gt;
	 * &lt;img/&gt;
	 * </pre>
	 * #####JavaScript:
	 * <pre>Dom.query("img").setAttribute("src","test.jpg");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[ &lt;img src= "test.jpg" /&gt; , &lt;img src= "test.jpg" /&gt; ]</pre>
	 *
	 * 将文档中图像的src属性删除
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;img src="test.jpg"/&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("img").setAttribute("src");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[ &lt;img /&gt; ]</pre>
	 */
    Dom.setAttr = function (elem, name, value) {

        name = attrFix[name] || name;

        var hook = attrHooks[name];

        if (!hook) {
            hook = defaultHook;
            name = name.toLowerCase();
        }

        hook.set(elem, name, value);

    };

    /**
	 * 获取一个元素对应的文本。
	 * @param {Element} elem 元素。
	 * @return {String} 值。对普通节点返回 text 属性。
	 * @static
	 */
    Dom.getText = function (node) {
        ////assert.isNode(node, "Dom.getText(node, name): {node} ~");
        return node[textFix[node.nodeName] || attrFix.innerText] || '';
    };

    /**
	 * 设置当前 Dom 对象的文本内容。对于输入框则设置其输入的值。
	 * @param {String} 用于设置元素内容的文本。
	 * @return this
	 * @see #setHtml
	 * @remark 与 {@link #setHtml} 类似, 但将编码 HTML (将 "&lt;" 和 "&gt;" 替换成相应的HTML实体)。
	 * @example
	 * 设定文本框的值。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;input type="text"/&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("input").setText("hello world!");</pre>
	 */
    Dom.setText = function (node, value) {
        node[textFix[node.nodeName] || attrFix.innerText] = value;
    };

    /**
	 * 取得当前 Dom 对象的html内容。
	 * @return {String} HTML 字符串。
	 * @example
	 * 获取 id="a" 的节点的内部 html。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
	 * #####JavaScript:
	 * <pre>$Dom.query("a").getHtml();</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">"&lt;p/&gt;"</pre>
	 */
    Dom.getHtml = function (elem) {
        return elem.innerHTML;
    };

    /**
	 * 设置当前 Dom 对象的 Html 内容。
	 * @param {String} value 用于设定HTML内容的值。
	 * @return this
	 * @example
	 * 设置一个节点的内部 html
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.get("a").setHtml("&lt;a/&gt;");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;a/&gt;&lt;/div&gt;</pre>
	 */
    Dom.setHtml = function (elem, value) {

        // 如果存在 <script> 或 <style> ，则不能使用 innerHTML 设置。
        if (!/<(?:script|style)/i.test(value)) {
            var wrap = parseFix.$default;

            try {

                // 对每个子元素清空内存。
                // each(elem.getElementsByTagName("*"), clean);

                // 内部执行 innerHTML 。
                elem.innerHTML = (wrap[1] + value + wrap[2]).replace(rXhtmlTag, "<$1></$2>");

                // IE6 需要包装节点，此处解除包装的节点。
                if (wrap[0]) {
                    wrap = elem.lastChild;
                    while (wrap.firstChild)
                        elem.appendChild(wrap.firstChild);
                    elem.removeChild(elem.firstChild);
                    elem.removeChild(wrap);
                }

                // 设置成功，返回。
                return;

                // 如果 innerHTML 出现错误，则直接使用节点方式操作。
            } catch (e) {

            }

        }

        // 使用节点的 append 方式。
        Dom.empty(elem);

        Dom.append(elem, value);
    };

    //#endregion

    //#region Style

    /**
	 * 透明度的正则表达式。
	 * @type RegExp IE8 使用滤镜支持透明度，这个表达式用于获取滤镜内的表示透明度部分的子字符串。
	 */
    var rOpacity = /opacity=([^)]*)/,

		//#if CompactMode

		/**
		 * 获取元素的实际的样式属性。
		 * @param {Element} elem 需要获取属性的节点。
		 * @param {String} name 需要获取的CSS属性名字。
		 * @return {String} 返回样式字符串，肯能是 undefined、 auto 或空字符串。
		 */
		getCurrentStyle = Dom.currentStyle = window.getComputedStyle ? function (elem, name) {

		    // getComputedStyle为标准浏览器获取样式。
		    ////assert.isElement(elem, "Dom.getStyle(elem, name): {elem} ~");

		    // 获取真实的样式owerDocument返回elem所属的文档对象
		    // 调用getComputeStyle的方式为(elem,null)
		    var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);

		    // 返回 , 在 火狐如果存在 IFrame， 则 computedStyle == null
		    // http://drupal.org/node/182569
		    // IE9 必须使用 getPropertyValue("filter")
		    return computedStyle ? computedStyle.getPropertyValue(name) || computedStyle[name] : null;

		} : function (elem, name) {

		    ////assert.isElement(elem, "Dom.getStyle(elem, name): {elem} ~");

		    var r, hook = styleHooks[name];

		    // 特殊样式保存在 styleHooks 。
		    if (hook && hook.compute) {
		        return hook.compute(elem);
		    }

		    // currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
		    // currentStyle是运行时期样式与style属性覆盖之后的样式
		    r = elem.currentStyle[name];

		    // 来自 jQuery
		    // 如果返回值不是一个带px的 数字。 转换为像素单位
		    if (/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {

		        // 保存初始值
		        var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;

		        // 放入值来计算
		        elem.runtimeStyle.left = elem.currentStyle.left;
		        style.left = name === "fontSize" ? "1em" : (r || 0);
		        r = style.pixelLeft + "px";

		        // 回到初始值
		        style.left = left;
		        elem.runtimeStyle.left = rsLeft;

		    }

		    return r;
		},

		//#else

		//# getCurrentStyle = function (elem, name) {
		//#
		//# 	// 获取样式
		//# 	var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
		//#
		//# 	// 返回
		//# 	return computedStyle ? computedStyle[ name ]: null;
		//#
		//# },

		//#endif

		/**
		 * 特殊的样式集合。
		 * @property
		 * @type Object
		 * @private
	 	 * @static
		 */
		styleHooks = Dom.styleHooks = {
		    height: {
		        get: function (elem) {
		            return styleNumber(elem, "height") + "px";
		        },
		        compute: function (elem) {
		            return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
		        },
		        set: function (elem, value) {
		            elem.style.height = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
		        }
		    },
		    width: {
		        get: function (elem) {
		            return styleNumber(elem, "width") + "px";
		        },
		        compute: function (elem) {
		            return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
		        },
		        set: function (elem, value) {
		            elem.style.width = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
		        }
		    },
		    'float': {

		        // IE：styleFloat Other：cssFloat
		        name: 'cssFloat' in html.style ? 'cssFloat' : 'styleFloat',
		        get: function (elem) {
		            return styleString(elem, this.name);
		        },
		        set: function (elem, value) {
		            elem.style[this.name] = value;
		        }
		    }
		};

    //#if CompactMode

    if (typeof html.style.opacity === 'undefined') {
        styleHooks.opacity = {

            get: function (elem, value) {
                return rOpacity.test(styleString(elem, 'filter')) ? parseInt(RegExp.$1) / 100 + '' : '1';
            },

            set: function (elem, value) {
                var style = elem.style;

                ////assert(!+value || (value <= 1 && value >= 0), 'Dom#setStyle("opacity", value): {value} 必须在 0~1 间。', value);
                ////assert.isElement(elem, "Dom#setStyle(name, value): 当前 dom 不支持样式");

                if (value)
                    value *= 100;
                value = value || value === 0 ? 'opacity=' + value : '';

                // 获取真实的滤镜。
                elem = styleString(elem, 'filter');

                ////assert(!/alpha\([^)]*\)/i.test(elem) || rOpacity.test(elem), 'Dom#setOpacity(value): 当前元素的 {filter} CSS属性存在不属于 alpha 的 opacity， 将导致 setOpacity 不能正常工作。', elem);

                // 当元素未布局，IE会设置失败，强制使生效。
                style.zoom = 1;

                // 设置值。
                style.filter = rOpacity.test(elem) ? elem.replace(rOpacity, value) : (elem + ' alpha(' + value + ')');

                return this;

            }
        };

        styleHooks.opacity.compute = styleHooks.opacity.get;
    }

    if (typeof html.style.userSelect === 'undefined') {
        styleHooks.userSelect = {
            get: function (elem) {
                return styleString(elem, 'userSelect');
            },

            unselectable: 'unselectable' in html ? function (elem, value) {
                elem.unselectable = value ? 'on' : '';
            } : 'onselectstart' in html ? function (elem, value) {
                elem.onselectstart = value ? function () { return false; } : null;
            } : function (elem, value) {
                elem.style.MozUserSelect = value ? 'none' : '';
            },

            set: function (elem, value) {

                if (value === 'none') {
                    this.unselectable(elem, true);
                } else if (elem.style.userSelect === 'none') {
                    this.unselectable(elem, false);
                }

                elem.style.userSelect = value;
            }
        };
    }

    //#endif

    /**
	 * 到骆驼模式。
	 * @param {String} all 全部匹配的内容。
	 * @param {String} match 匹配的内容。
	 * @return {String} 返回的内容。
	 */
    function toUpperCase(all, match) {
        return match.toUpperCase();
    }

    /**
	 * 读取样式字符串。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。
	 * @return {String} 字符串。
	 */
    function styleString(elem, name) {
        ////assert.isElement(elem, "Dom.styleString(elem, name): {elem} ~");
        return elem.style[name] || getCurrentStyle(elem, name);
    }

    /**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 */
    function styleNumber(elem, name) {
        //////assert.isElement(elem, "Dom.styleNumber(elem, name): {elem} ~");

        var style = elem.style, value;

        if (style) {

            // 优先从 style 获取。
            value = style[name];

            // 如果已经制定了一个 0px 格式的数字，直接返回。
            if (value && /^[\d\.]+px$/.test(value)) {
                value = parseFloat(value);
            } else {

                // 如果获取不到值，则从 currentStyle 获取。
                value = parseFloat(getCurrentStyle(elem, name));

                // value 不能使 NaN
                if (!value && value !== 0) {

                    // 处理 width/height，必须在 display 不是 none 的时候进行获取。
                    if (name in styleHooks) {

                        var styles = {};
                        for (var name in Dom.displayFix) {
                            styles[name] = style[name];
                        }

                        extend(style, Dom.displayFix);
                        value = parseFloat(getCurrentStyle(elem, name)) || 0;
                        extend(style, styles);
                    } else {
                        value = 0;
                    }
                }
            }

        } else if (elem.nodeType === 9) {
            elem = elem.documentElement;

            value = name === "height" ? elem.clientHeight :
				name === "width" ? elem.clientWidth :
				styleNumber(elem, name);

        }

        return value;
    }

    /**
	 * 不需要单位的 css 属性。
	 * @static
	 * @type Object
	 */
    Dom.styleNumbers = map('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', function () {
        return true;
    }, {});

    /**
	 * 显示元素的样式。
	 * @static
	 * @type Object
	 */
    Dom.displayFix = {
        position: "absolute",
        visibility: "visible",
        display: "block"
    };

    Dom.camelCase = function (name) {
        return name.replace(/-(\w)/g, toUpperCase);
    };

    /**
	 * 根据不同的内容进行计算。
	 * @param {Element} elem 元素。
	 * @param {String} type 要计算的值。一个 type 是一个 js 表达式，它有一些内置的变量来表示元素的相关计算值。预定义的变量有：
	 *
	 *		- ml: marginLeft (同理有 r=right, t=top, b=bottom，x=left+right,y=top+bottom 下同)
	 *		- bl: borderLeftWidth
	 *		- pl: paddingLeft
	 *		- sx: bl + pl + height (同理有 y)
	 *		- css 样式: 如 height, left
	 *
	 * @return {Number} 计算值。
	 * @static
	 */
    Dom.calc = (function () {

        /**
		 * 样式表。
		 * @static
		 * @type Object
		 */
        var parseCache = {},

			init,

			tpl;

        if (window.getComputedStyle) {
            init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
            tpl = '(parseFloat(c["#"])||0)';
        } else {
            init = 'return ';
            tpl = '(parseFloat(Dom.getStyle(e, "#"))||0)';
        }

        /**
		 * 翻译 type。
		 * @param {String} type 输入字符串。
		 * @return {String} 处理后的字符串。
		 */
        function format(type) {
            return tpl.replace('#', type);
        }

        return function (elem, type) {
            ////assert.isElement(elem, "Dom.calc(elem, type): {elem} ~");
            ////assert.isString(type, "Dom.calc(elem, type): {type} ~");
            return (parseCache[type] || (parseCache[type] = new Function("e", init + type.replace(/\w+/g, format))))(elem);
        }
    })();

    /**
	 * 设置一个元素可拖动。
	 * @param {Element} elem 要设置的节点。
	 * @static
	 */
    Dom.movable = function (elem) {
        ////assert.isElement(elem, "Dom.movable(elem): 参数 elem ~");
        if (!/^(?:abs|fix)/.test(styleString(elem, "position")))
            elem.style.position = "relative";
    };

    /**
	 * 读取样式数字。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。必须使用骆驼规则的名字。
	 * @return {String} 字符串。
	 * @static
	 */
    Dom.styleString = styleString;

    /**
	 * 读取样式数字。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。必须使用骆驼规则的名字。
	 * @return {String} 字符串。
	 * @static
	 */
    Dom.styleNumber = styleNumber;

    /**
	 * 判断当前元素是否是隐藏的。
	 * @return {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
	 */
    Dom.isHidden = function (elem) {
        return styleString(elem, 'display') === 'none';
    };

    ///**
	// * 获取一个标签的默认 display 属性。
	// * @param {Element} elem 元素。
	// */
    //Dom.defaultDisplay = function (elem) {
    //    var displays = Dom.displays || (Dom.displays = {}),
	//		tagName = elem.tagName,
	//		display = displays[tagName],
	//		iframe,
	//		iframeDoc;

    //    if (!display) {

    //        elem = document.createElement(tagName);
    //        document.body.appendChild(elem);
    //        display = getCurrentStyle(elem, 'display');
    //        document.body.removeChild(elem);

    //        // 如果简单的测试方式失败。使用 IFrame 测试。
    //        if (display === "none" || display === "") {
    //            iframe = document.body.appendChild(Dom.emptyIframe || (Dom.emptyIframe = Object.extend(document.createElement("iframe"), {
    //                frameBorder: 0,
    //                width: 0,
    //                height: 0
    //            })));

    //            // Create a cacheable copy of the iframe document on first call.
    //            // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
    //            // document to it; WebKit & Firefox won't allow reusing the iframe document.
    //            iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
    //            iframeDoc.write("<!doctype html><html><body>");
    //            iframeDoc.close();

    //            elem = iframeDoc.body.appendChild(iframeDoc.createElement(tagName));
    //            display = getCurrentStyle(elem, 'display');
    //            document.body.removeChild(iframe);
    //        }

    //        displays[tagName] = display;
    //    }

    //    return display;
    //},

    ///**
	// * 通过设置 display 属性来显示元素。
	// * @param {Element} elem 元素。
	// * @static
	// */
	//Dom.show = function (elem) {
	//    ////assert.isElement(elem, "Dom.show(elem): {elem} ~");

	//    // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
	//    elem.style.display = '';

	//    // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
	//    if (getCurrentStyle(elem, 'display') === 'none')
	//        elem.style.display = elem.style.defaultDisplay || Dom.defaultDisplay(elem);
	//},

    ///**
	// * 通过设置 display 属性来隐藏元素。
	// * @param {Element} elem 元素。
	// * @static
	// */
	//Dom.hide = function (elem) {
	//    ////assert.isElement(elem, "Dom.hide(elem): {elem} ~");
	//    var currentDisplay = styleString(elem, 'display');
	//    if (currentDisplay !== 'none') {
	//        elem.style.defaultDisplay = currentDisplay;
	//        elem.style.display = 'none';
	//    }
	//};

    Dom.getStyle = function (elem, name) {

        name = Dom.camelCase(name);

        // 特殊属性单独获取。
        if (name in styleHooks) {
            return styleHooks[name].get(elem);
        }

        ////assert.isString(name, "Dom#getStyle(name): {name} ~");
        ////assert(elem.style, "Dom#getStyle(name): 当 Dom 对象对应的节点不是元素，无法使用样式。");

        return elem.style[name] || getCurrentStyle(elem, name);
    };

    /**
	 * 设置一个样式属性的值。
	 * @param {String} name CSS 属性名或 CSS 字符串。
	 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则会自动添加像素单位。
	 * @return this
	 * @example
	 * 将所有段落的字体颜色设为红色并且背景为蓝色。
	 * <pre>Dom.query("p").setStyle('color', "#ff0011");</pre>
	 */
    Dom.setStyle = function (elem, name, value) {

        // 将属性名转为骆驼形式。
        name = Dom.camelCase(name);

        ////assert.isString(name, "Dom.setStyle(name, value): {name} ~");
        //     ////assert.isElement(elem, "Dom.setStyle(name, value): 当前 dom 不支持样式");

        // 特殊属性单独设置。
        if (name in styleHooks) {
            styleHooks[name].set(elem, value);
        } else {

            // 设置样式，为一些数字类型的样式自动追加单位。
            elem.style[name] = typeof value !== "number" || name in Dom.styleNumbers ? value : (value + "px");

        }
    };

    //#endregion

    //#region Event

    var emptyObj = {};

    /**
	 * 特殊处理的事件对象。
	 */
    Dom.eventFix = {};

    /**
	 * DOM 事件。
	 */
    Dom.Event = Class({

        /**
		 * 构造函数。
		 * @param {Object} [e] 事件对象的属性。
		 * @constructor
		 */
        constructor: function (e) {
            if (e) {

                // IE 8- 在处理原生事件时肯能出现错误。
                try {
                    extend(this, e);
                } catch (ex) {

                }

            }
        },

        /**
         * 阻止事件的冒泡。
         * @remark 默认情况下，事件会向父元素冒泡。使用此函数阻止事件冒泡。
         */
        stopPropagation: function () {
            this.cancelBubble = true;
        },

        /**
         * 取消默认事件发生。
         * @remark 有些事件会有默认行为，如点击链接之后执行跳转，使用此函数阻止这些默认行为。
         */
        preventDefault: function () {
            this.returnValue = false;
        }

    });

    /**
	 * 初始化 DOM Event 对象，并返回一个最终传递给处理函数的 Event 对象。
	 */
    Dom.initEvent = function (e) {

        // Chrome 23+ e.target 可能是文本节点。
        var target = e.target;
        if (target.nodeType === 3) {
            target = target.parentNode;

            // e.target 为只读属性，重写 getter 覆盖。
            e.__defineGetter__("target", function () {
                return target;
            });
        }
        return e;
    };

    Dom.defineEvents = function (events, hooks) {

        var eventFix = Dom.eventFix;

        map(events, function (eventName) {

            // 支持 bind 字段：自动添加和删除指定的父事件。
            if (hooks.bindType) {

                hooks.add = function (elem, type, fn) {
                    Dom.addListener(elem, this.bindType, fn);
                };

                hooks.remove = function (elem, type, fn) {
                    defaultEvent.remove(elem, this.bind, fn);
                };
            }

            // 将已有的信息拷贝回来。
            if (eventFix[eventName]) {
                eventFix[eventName] = extend(extend({}, eventFix[eventName]), hooks);
            } else {
                eventFix[eventName] = hooks;
            }
        });
    };

    if (isIE678) {
        Dom.initEvent = function (e) {
            e.target = e.srcElement || document;
            e.stopPropagation = Dom.Event.prototype.stopPropagation;
            e.preventDefault = Dom.Event.prototype.preventDefault;
            e.which = e.keyCode;
            return e;
        };

        Dom.defineEvents("click dblclick mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend", {
            initEvent: function (e) {
                e = Dom.initEvent(e);

                // 没有 target 时，重新初始化 IE 事件对象的参数。
                if (!e.target) {
                    e.relatedTarget = e.fromElement === e.srcElement ? e.toElement : e.fromElement;

                    var eventDoc = getDocument(e.target).documentElement;
                    e.pageX = e.clientX + (eventDoc.scrollLeft || 0) - (eventDoc.clientLeft || 0);
                    e.pageY = e.clientY + (eventDoc.scrollTop || 0) - (eventDoc.clientTop || 0);

                    e.layerX = e.x;
                    e.layerY = e.y;

                    // 1 ： 单击 2 ： 中键点击 3 ： 右击
                    e.which = e.button & 1 ? 1 : e.button & 2 ? 3 : e.button & 4 ? 2 : 0;

                }

                return e;
            }
        });
    }

    if (html.onfocusin === undefined) {
        Dom.defineEvents('focusin focusout', {
            add: function (elem, type, fn) {
                var doc = elem.ownerDocument || elem,
					data = Dom.data(doc);

                if (!data[type + 'Handler']) {
                    doc.addEventListener(type === 'focusin' ? 'focus' : 'blur', data[type + 'Handler'] = function (e) {
                        if (e.eventPhase <= 1) {
                            var p = elem;
                            while (p && p.parentNode) {
                                if (!Dom.trigger(p, type, e)) {
                                    return;
                                }

                                p = p.parentNode;
                            }
                        }
                    }, true);
                }
            }
        });
    }

    if (html.onmousewheel === undefined) {
        Dom.defineEvents('mousewheel', {
            bindType: 'DOMMouseScroll'
        });
    }

    // Firefox 会在右击时触发 document.onclick 。
    Dom.defineEvents('click', {

        filter: navigator.isFirefox ? function (target, e) {
            return !target.disabled && (e.which === undefined || e.which === 1);
        } : function (target, e) {
            return !target.disabled;
        }

    });

    Object.each({
        'mouseenter': 'mouseover',
        'mouseleave': 'mouseout'
    }, function (fix, orig) {
        Dom.defineEvents(orig, {

            // 处理指定的事件，如果返回 true, 说明已经处理完成。
            filter: function (target, e) {

                // 如果浏览器原生支持 mouseenter/mouseleave, 不作操作。
                return e.type === orig || !Dom.contains(target, e.relatedTarget);

            },

            bindType: html.onmouseenter === null ? null : fix,
            delegateType: fix
        });
    });

    Dom.defineEvents('focus', {
        delegateType: 'focusin'
    });

    Dom.defineEvents('blur', {
        delegateType: 'focusout'
    });

    Dom.addListener = html.addEventListener ? function (elem, type, fn) {
        elem.addEventListener(type, fn, false);
    } : function (elem, type, fn) {
        elem.attachEvent('on' + type, fn);
    };

    Dom.removeListener = html.removeEventListener ? function (elem, type, fn) {
        elem.removeEventListener(type, fn, false);
    } : function (elem, type, fn) {
        elem.detachEvent('on' + type, fn);
    };

    // 处理 DOM 事件。
    function dispatchEvent(e, eventHandler) {
        var handler,
			i,
			length,
			delegateTarget,
            target = eventHandler.target,
			filter = eventHandler.filter,
			delegateHandlers = eventHandler.delegateFn,
			actualHandlers = [];

        // 初始化和修复事件。
        e = eventHandler.initEvent(e);

        // 遍历委托处理句柄，将符合要求的句柄放入 actualHandlers 。
        if (delegateHandlers && (delegateTarget = e.target).nodeType) {

            // 从当前实际发生事件的元素开始一直往上查找，直到当前节点。
            for (; delegateTarget != target; delegateTarget = delegateTarget.parentNode || target) {

                // 获取发生事件的原始对象。
                i = 0;
                length = delegateHandlers.length;

                while (i < length) {

                    handler = delegateHandlers[i++];

                    // 如果节点满足 CSS 选择器要求，则放入队列。
                    // check 用于处理部分特殊的情况，不允许执行委托函数。（如 click 已禁用的按钮）
                    if (Dom.match(delegateTarget, handler[2], target) && (!filter || filter(delegateTarget, e) !== false)) {

                        actualHandlers.push([handler[0], handler[1] || delegateTarget]);

                    }

                }
            }

        }

        // 将普通的句柄直接复制到 actualHandlers 。
        if ((!filter || filter(target, e) !== false) && eventHandler.bindFn) {
            actualHandlers.push.apply(actualHandlers, eventHandler.bindFn);
        }

        i = 0;
        length = actualHandlers.length;

        // 循环直接以上提取的所有函数句柄。
        while (i < length) {

            handler = actualHandlers[i++];

            // 如果句柄函数返回 false, 则同时阻止事件并退出循环。
            if (handler[0].call(handler[1], e) === false) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }

        return true;
    }

    Dom.on = function (elem, type, selector, fn, scope) {

        ////assert.isString(selector, "Dom#delegate(selector, eventName, handler): {selector}  ~");
        ////assert.isString(eventName, "Dom#delegate(selector, eventName, handler): {eventName}  ~");
        ////assert.isFunction(handler, "Dom#delegate(selector, eventName, handler): {handler}  ~");
        ////assert(eventName, "Dom#bind(eventAndSelector, handler): {eventAndSelector} 中不存在事件信息。正确的 eventAndSelector 格式： click.selector");

        var data = Dom.data(elem), eventHandler, eventFix, filter;

        // 如果指定的节点无法存储数据，则不添加函数。
        if (!data) {
            return;
        }

        if (typeof selector === 'function') {
            scope = fn;
            fn = selector;
            selector = null;
        }

        // 初始化存储事件函数的对象。
        data = data.$events || (data.$events = {});
        eventFix = Dom.eventFix[type] || emptyObj;
        filter = eventFix.filter;

        // 转为其它事件。
        if (selector && eventFix.delegateType) {
            type = eventFix.delegateType;
            eventFix = Dom.eventFix[type] || emptyObj;
        }

        eventHandler = data[type];

        // 如果不存在指定事件的处理函数，则先创建。
        if (!eventHandler) {
            data[type] = eventHandler = function (e) {
                return dispatchEvent(e, arguments.callee);
            };

            // 保存最开始的参数类型，用于以后处理。
            eventHandler.target = elem;
            eventHandler.type = type;
            eventHandler.filter = filter;
            eventHandler.initEvent = eventFix.initEvent || Dom.initEvent;

            // 第一次绑定事件时，同时会绑定 DOM 事件。
            // 如果自定义的 .add 函数返回 false，说明 add 无法处理，则添加 DOM 事件。
            if (!eventFix.add || eventFix.add(elem, type, eventHandler) === false) {
                Dom.addListener(elem, type, eventHandler);
            }
        }

        // 添加当前函数到队列末尾。
        data = [fn, scope || (selector ? 0 : elem), selector];
        type = selector ? 'delegateFn' : 'bindFn';

        if (eventFix = eventHandler[type]) {
            eventFix.push(data);
        } else {
            eventHandler[type] = [data];
        }


    };

    Dom.un = function (elem, type, selector, fn) {

        var data = (Dom.data(elem) || {}).$events || emptyObj, eventHandler = data[type], eventFix;

        // 如果不传递 type, 表示删除当前 DOM 的全部事件。
        // 如果指定的节点无法存储数据，则不添加函数。
        if (eventHandler) {

            if (typeof selector !== 'string') {
                fn = selector;
                selector = null;
            }

            // 如果指定了函数，则搜索指定的函数。
            if (fn) {

                handlers = selector ? eventHandler.delegateFn : eventHandler.bindFn;

                for (i = 0; i < handlers.length; i++) {
                    if ((handlers[i][0] === fn) || (!selector || handlers[i][2] === selector)) {
                        handlers.splice(i, 1);
                        fn = handlers.length;
                        break;
                    }
                }

            }

            // 否则，删除全部事件函数。
            if (!fn) {

                delete data[type];
                eventFix = Dom.eventFix[type];

                // 第一次绑定事件时，同时会绑定 DOM 事件。
                // 如果自定义的 .add 函数返回 false，说明 add 无法处理，则添加 DOM 事件。
                if (!eventFix || !eventFix.remove || eventFix.remove(elem, type, eventHandler) === false) {
                    Dom.removeListener(elem, type, eventHandler);
                }

            }

        } else {

            // 否则，删除全部事件函数。
            for (type in data) {
                Dom.un(elem, type);
            }

        }

    };

    Dom.trigger = function (elem, type, e) {

        var data = Dom.data(elem).$events;

        if (!data || !(data = data[type])) {
            return true;
        }

        if (!e || !e.type) {
            e = new Dom.Event(e);
            e.target = elem;
            e.type = type;
        }

        return dispatchEvent(e, data) && (!elem[type = 'on' + type] || elem[type](e) !== false);
    };

    //#endregion

    //#region Class

    /**
     * 检查是否含指定类名。
     * @param {Element} elem 要测试的元素。
     * @param {String} className 类名。
     * @return {Boolean} 如果存在返回 true。
     * @static
     */
    Dom.hasClass = function (elem, className) {
        ////assert.isNode(elem, "Dom.hasClass(elem, className): {elem} ~");
        ////assert(className && (!className.indexOf || !/[\s\r\n]/.test(className)), "Dom.hasClass(elem, className): {className} 不能空，且不允许有空格和换行。如果需要判断 2 个 class 同时存在，可以调用两次本函数： if(hasClass('A') && hasClass('B')) ...");
        return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
    };

    /**
	 * 为当前 Dom 对象添加指定的 Css 类名。
	 * @param {String} className 一个或多个要添加到元素中的CSS类名，用空格分开。
	 * @return this
	 * @example
	 * 为匹配的元素加上 'selected' 类。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("p").addClass("selected");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt; ]</pre>
	 *
	 * 为匹配的元素加上 selected highlight 类。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("p").addClass("selected highlight");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[ &lt;p class="selected highlight"&gt;Hello&lt;/p&gt; ]</pre>
     */
    Dom.addClass = function (elem, className) {
        ////assert.isString(className, "Dom#addClass(className): {className} ~");

        var classList = className.split(/\s+/);

        className = " " + elem.className + " ";

        for (var i = 0; i < classList.length; i++) {
            if (className.indexOf(" " + classList[i] + " ") < 0) {
                className += classList[i] + " ";
            }
        }

        elem.className = className.trim();
    };

    /**
     * 从当前 Dom 对象中删除全部或者指定的类。
     * @param {String} [className] 一个或多个要删除的CSS类名，用空格分开。如果不提供此参数，将清空 className 。
     * @return this
     * @example
     * 从匹配的元素中删除 'selected' 类
     * #####HTML:
     * <pre lang="htm" format="none">
     * &lt;p class="selected first"&gt;Hello&lt;/p&gt;
     * </pre>
     * #####JavaScript:
     * <pre>Dom.query("p").removeClass("selected");</pre>
     * #####结果:
     * <pre lang="htm" format="none">
     * [ &lt;p class="first"&gt;Hello&lt;/p&gt; ]
     * </pre>
     */
    Dom.removeClass = function (elem, className) {
        ////assert(!className || className.split, "Dom#removeClass(className): {className} ~");

        if (className) {
            var classList = className.split(/\s+/);
            className = " " + elem.className + " ";
            for (var i = classList.length; i--;) {
                className = className.replace(" " + classList[i] + " ", " ");
            }
            className = className.trim();
        }
        elem.className = className;
    };

    /**
     * 如果存在（不存在）就删除（添加）一个类。
     * @param {String} className CSS类名。
     * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
     * @return this
     * @see #addClass
     * @see #removeClass
     * @example
     * 为匹配的元素切换 'selected' 类
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").toggleClass("selected");</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt;, &lt;p&gt;Hello Again&lt;/p&gt; ]</pre>
     */
    Dom.toggleClass = function (elem, className, state) {
        Dom[(state == undefined ? Dom.hasClass(elem, className) : !state) ? 'removeClass' : 'addClass'](elem, className);
    };

    //#endregion

    //#region Traversing

    /**
	 * 返回简单的遍历函数。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
    function createTreeWalker(next, first) {
        first = first || next;
        return function (node, selector) {

            node = node[first];

            // 找到第一个nodeType == 1 的节点。
            while (node && node.nodeType !== 1) {
                node = node[next];
            }

            return !selector || (node && Dom.match(node, selector)) ? node : null;
        };
    }

    /**
	 * 返回简单的遍历函数。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
    function createTreeDir(next, first) {
        first = first || next;
        return function (node, selector) {
            var ret = new Dom();

            node = node[first];

            while (node) {
                if (node.nodeType === 1 && (!selector || Dom.match(node, selector)))
                    ret.push(node);
                node = node[next];
            }

            return ret;
        };
    }

    /**
     * 获取当前 Dom 对象的第一个子节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 获取匹配的第二个元素
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").first(1)</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
     */
    Dom.first = createTreeWalker('nextSibling', 'firstChild');

    /**
     * 获取当前 Dom 对象的最后一个子节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 获取匹配的第二个元素
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").getChild(1)</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
     */
    Dom.last = createTreeWalker('previousSibling', 'lastChild');

    /**
     * 获取当前 Dom 对象的下一个相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 找到每个段落的后面紧邻的同辈元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").getNext()</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p&gt;Hello Again&lt;/p&gt;, &lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt; ]</pre>
     */
    Dom.next = createTreeWalker('nextSibling');

    /**
     * 获取当前 Dom 对象的上一个相邻的节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 找到每个段落紧邻的前一个同辈元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").getPrevious()</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt; ]</pre>
     *
     * 找到每个段落紧邻的前一个同辈元素中类名为selected的元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/div&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").getPrevious("div")</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
     */
    Dom.prev = createTreeWalker('previousSibling');

    /**
     * 获取当前 Dom 对象的全部直接子节点。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {NodeList} 返回满足要求的节点的列表。
     * @example
     *
     * 查找DIV中的每个子元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("div").getChildren()</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;span&gt;Hello Again&lt;/span&gt; ]</pre>
     *
     * 在每个div中查找 div。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;&lt;/div&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("div").getChildren("div")</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
     */
    Dom.children = createTreeDir('nextSibling', 'firstChild');

    /**
     * 获取当前 Dom 对象以后的全部相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个 Dom 对象。
     */
    Dom.nextAll = createTreeDir('nextSibling');

    /**
     * 获取当前 Dom 对象以前的全部相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个 Dom 对象。
     */
    Dom.prevAll = createTreeDir('previousSibling');

    /**
     * 获取当前 Dom 对象以上的全部相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个 Dom 对象。
     */
    Dom.parents = createTreeDir('parentNode');

    /**
     * 获取当前 Dom 对象的在原节点的位置。
     * @param {Boolean} args=true 如果 args 为 true ，则计算文本节点。
     * @return {Number} 位置。从 0 开始。
     */
    Dom.index = function (node) {
        var i = 0;
        while (node = node.previousSibling)
            if (node.nodeType === 1)
                i++;
        return i;
    };

    /**
     * 获取当前 Dom 对象的指定位置的直接子节点。
     * @param {Integer} index 用于查找子元素的 CSS 选择器 或者 元素在 Dom 对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。如果 args 是小于 0 的数字，则从末尾开始计算。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
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

    /**
     * 获取当前 Dom 对象的父节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在 Dom 对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 找到每个span元素的所有祖先元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.find("span").parent()</pre>
     */
    Dom.parent = createTreeWalker('parentNode');

    /**
     * 编辑当前 Dom 对象及父节点对象，找到第一个满足指定 CSS 选择器或函数的节点。
     * @param {String/Function} [filter] 用于判断的元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
     * @param {Dom/String} [context=document] 只在指定的节点内搜索此元素。
     * @return {Dom} 如果当前节点满足要求，则返回当前节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
     * @remark
     * closest 和 parent 最大区别就是 closest 会测试当前的元素。
     */
    Dom.closest = function (node, selector, context) {

        while (node) {
            if (Dom.match(node, selector)) {
                return !context || Dom.query(context).contains(node) ? node : null;
            }

            node = node.parentNode;
        }

        return null;
    };

    //#endregion

    //#region Clone

    /**
	 * 特殊属性集合。
	 * @type Object 特殊的属性，在节点复制时不会被复制，因此需要额外复制这些属性内容。
	 * @static
	 */
    Dom.cloneFix = {
        INPUT: function (srcElem, destElem) {

            if (rCheckBox.test(srcElem.type)) {

                // IE6 必须同时设置 defaultChecked 属性。
                destElem.defaultChecked = destElem.checked = srcElem.checked;

                // IE67 无法复制 value 属性。
                if (destElem.value !== srcElem.value) {
                    destElem.value = srcElem.value;
                }
            } else {
                destElem.value = srcElem.value;
            }
        },
        TEXTAREA: 'value',
        OPTION: 'selected',
        OBJECT: function (destElem, srcElem) {
            if (destElem.parentNode) {
                destElem.outerHTML = srcElem.outerHTML;

                if (srcElem.innerHTML && !destElem.innerHTML)
                    destElem.innerHTML = srcElem.innerHTML;
            }
        }
    };

    if (isIE678)
        Dom.cloneFix.SCRIPT = 'text';

    /**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} cloneDataAndEvent=true 是否复制数据。
	 * @param {Boolean} keepId=false 是否留下ID。
	 */
    function cleanClone(srcElem, destElem, cloneDataAndEvent, keepId) {

        // 删除重复的 ID 属性。
        if (!keepId && destElem.removeAttribute)
            destElem.removeAttribute('id');

        /// #if CompactMode

        if (destElem.clearAttributes) {

            // IE 会复制 自定义事件， 清楚它。
            destElem.clearAttributes();
            destElem.mergeAttributes(srcElem);
            destElem.$data = null;

            if (srcElem.options) {
                each(srcElem.options, function (value) {
                    destElem.options.seleced = value.seleced;
                });
            }
        }

        /// #endif

        if (cloneDataAndEvent !== false && (cloneDataAndEvent = srcElem.$data)) {

            destElem.$data = cloneDataAndEvent = extend({}, cloneDataAndEvent);

            // event 作为系统内部对象。事件的拷贝必须重新进行 on 绑定。
            var event = cloneDataAndEvent.$event, dest;

            if (event) {
                cloneDataAndEvent.$event = null;
                for (cloneDataAndEvent in event) {

                    // 对每种事件。
                    event[cloneDataAndEvent].bindFn.forEach(function (handler) {

                        // 如果源数据的 target 是 src， 则改 dest 。
                        Dom.on(dest, cloneDataAndEvent, handler[0], handler[1] === srcElem ? dest : handler[1]);
                    });

                    // 对每种事件。
                    event[cloneDataAndEvent].delegateFn.forEach(function (handler) {

                        // 如果源数据的 target 是 src， 则改 dest 。
                        Dom.on(dest, cloneDataAndEvent + " " + handler[2], handler[0], handler[1] === srcElem ? dest : handler[1]);
                    });
                }
            }

        }

        // 特殊属性复制。
        if (keepId = Dom.cloneFix[srcElem.tagName]) {
            if (typeof keepId === 'string') {
                destElem[keepId] = srcElem[keepId];
            } else {
                keepId(destElem, srcElem);
            }
        }
    }

    /**
	 * 创建并返回当前 Dom 对象的副本。
	 * @param {Boolean} deep=true 是否复制子元素。
	 * @param {Boolean} cloneDataAndEvent=false 是否复制数据和事件。
	 * @param {Boolean} keepId=false 是否复制 id 。
	 * @return {Dom} 新 Dom 对象。
	 *
	 * @example
	 * 克隆所有b元素（并选中这些克隆的副本），然后将它们前置到所有段落中。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;, how are you?&lt;/p&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("b").clone().prependTo("p");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;&lt;b&gt;Hello&lt;/b&gt;, how are you?&lt;/p&gt;</pre>
	 */
    Dom.clone = function (elem, deep, cloneDataAndEvent, keepId) {

        var clone = elem.cloneNode(deep = deep !== false);

        if (elem.nodeType === 1) {
            if (deep) {
                for (var elemChild = elem.getElementsByTagName('*'), cloneChild = clone.getElementsByTagName('*'), i = 0; cloneChild[i]; i++)
                    cleanClone(elemChild[i], cloneChild[i], cloneDataAndEvent, keepId);
            }

            cleanClone(elem, clone, cloneDataAndEvent, keepId);
        }

        return clone;
    };

    //#endregion

    //#region Manipulation

    /**
	 * 清除节点的引用。
	 * @param {Element} elem 要清除的元素。
	 */
    function clean(elem) {

        // 删除自定义属性。
        if (elem.clearAttributes)
            elem.clearAttributes();

        // 删除句柄，以删除双重的引用。
        if (elem.$data) {

            // 删除事件。
            Dom.un(elem);

            elem.$data = null;

        }

    }

    /**
	 * 判断指定节点之后有无存在子节点。
	 * @param {Element} elem 节点。
	 * @param {Element} child 子节点。
	 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
	 * @static
	 */
    Dom.contains = html.compareDocumentPosition ? function (node, child) {
        ////assert.isNode(node, "Dom.contains(node, child): {elem} ~");
        ////assert.isNode(child, "Dom.contains(node, child): {child} ~");
        return node === child || !!(child && (node.compareDocumentPosition(child) & 16));
    } : function (node, child) {
        ////assert.isNode(node, "Dom.contains(elem, child): {elem} ~");
        ////assert.isNode(child, "Dom.contains(elem, child): {child} ~");
        while (child) {
            if (node === child)
                return true;
            child = child.parentNode;
        }

        return false;
    };

    Dom.manip = function (node, html, fn) {

        var dom, i, script;

        html = Dom.parseNode(html, node);

        if (!html.nodeType) {
            if (html.length > 1) {
                dom = html;
                html = getDocument(node).createDocumentFragment();
                for (i = 0; i < dom.length; i++) {
                    html.appendChild(dom[i]);
                }
            } else {
            	html = html[0];
            }
        }

        dom = html.getElementsByTagName ? html.getElementsByTagName("SCRIPT") : html.querySelectorAll ? html.querySelectorAll('SCRIPT') : [];

        // IE678 不支持更新 fragment 后保持 Scripts，这时先缓存。
        if (isIE678) {
            dom = new Dom(dom);
        }

        // 实际的插入操作。
        fn(node, html);

        // 如果存在脚本，则一一执行。
        for (i = 0; script = dom[i]; i++) {
            if (!script.type || /\/(java|ecma)script/i.test(script.type)) {

                if (script.src) {
                    ////assert(window.Ajax && Ajax.send, "必须载入 ajax/script.js 模块以支持动态执行 <script src=''>");
                    Ajax.send({
                        url: script.src,
                        type: "GET",
                        dataType: 'script',
                        async: false
                    });
                } else {
                    window.execScript(script.text || script.textContent || script.innerHTML || "");
                }

            }
        }

        dom = null;

        return html;

    };

    Dom.render = function (node, parent, refNode) {
        if (parent) {
            parent.insertBefore(node, refNode || null);
        } else if (!Dom.contains(document.body, node)) {
            document.body.appendChild(node);
        }
    };

    /**
	 * 判断一个节点是否有元素节点或文本节点。
	 * @param {Element} elem 要测试的元素。
	 * @return {Boolean} 如果存在子节点，则返回 true，否则返回 false 。
	 */
    Dom.isEmpty = function (elem) {
        for (elem = elem.firstChild; elem; elem = elem.nextSibling)
            if (elem.nodeType === 1 || elem.nodeType === 3)
                return false;
        return true;
    };

    /**
	 * 插入一个HTML 到末尾。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
    Dom.append = function (node, html) {
        return Dom.manip(node, html, function (node, html) {
            node.appendChild(html);
        });
    };

    /**
	 * 插入一个HTML 到顶部。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
    Dom.prepend = function (node, html) {
        return Dom.manip(node, html, function (node, html) {
            node.insertBefore(html, node.firstChild);
        });
    };

    /**
	 * 插入一个HTML 到前面。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
    Dom.before = function (node, html) {
        return Dom.manip(node, html, function (node, html) {
            node.parentNode && node.parentNode.insertBefore(html, node);
        });
    };

    /**
	 * 插入一个HTML 到后面。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
    Dom.after = function (node, html) {
        return Dom.manip(node, html, function (node, html) {
            node.parentNode && node.parentNode.insertBefore(html, node.nextSibling);
        });
    };

    /**
     * 移除当前 Dom 对象或其子对象。
     * @param {Dom} [child] 如果指定了子对象，则删除此对象。
     * @return this
     * @see #dispose
     * @remark
     * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
     * 如果需要彻底删除 Dom 对象，使用 {@link #dispose}方法。
     * @example
     * 从DOM中把所有段落删除。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").remove();</pre>
     * #####结果:
     * <pre lang="htm" format="none">how are</pre>
     *
     * 从DOM中把带有hello类的段落删除
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").remove(".hello");</pre>
     * #####结果:
     * <pre lang="htm" format="none">how are &lt;p&gt;you?&lt;/p&gt;</pre>
     */
    Dom.remove = function (node) {
        node.parentNode && node.parentNode.removeChild(node);
    };

    /**
     * 删除一个节点的所有子节点。
     * @return this
     * @example
     * 把所有段落的子元素（包括文本节点）删除。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello, &lt;span&gt;Person&lt;/span&gt; &lt;a href="#"&gt;and person&lt;/a&gt;&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").empty();</pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;&lt;/p&gt;</pre>
     */
    Dom.empty = function (node) {

        // 删除全部节点。
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        // IE678 中, 删除 <select> 中的选中项。
        if (node.options && node.nodeName === "SELECT") {
            node.options.length = 0;
        }

    };

    /**
     * 彻底删除当前 DOM 对象。释放占用的所有资源。
     * @see #remove
     * @remark 这个方法会同时删除节点绑定的事件以及所有的数据。
     * @example
     * 从DOM中把所有段落删除。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;dispose&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").dispose();</pre>
     * #####结果:
     * <pre lang="htm" format="none">how are</pre>
     *
     * 从DOM中把带有hello类的段落删除。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").dispose(".hello");</pre>
     */
    Dom.dispose = function (node) {
        if (node.nodeType == 1) {
            Object.each(node.getElementsByTagName("*"), clean);
            clean(node);
        }

        Dom.remove(node);
    };

    //#endregion

    //#region Dimension

    /**
     * 设置当前 Dom 对象的显示大小。
     * @param {Number/Point} x 要设置的宽或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的高。如果不设置，使用 null 。
     * @return this
     * @remark
     * 设置元素实际占用大小（包括内边距和边框，但不包括滚动区域之外的大小）。
     *
     * 此方法对可见和隐藏元素均有效。
     * @example
     * 设置 id=myP 的段落的大小。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p id="myP"&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.get("myP").setSize({x:200,y:100});</pre>
     */
    Dom.setSize = function (elem, value) {
        if (value.x != null)
            styleHooks.width.set(elem, value.x - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight'));

        if (value.y != null)
            styleHooks.height.set(elem, value.y - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight'));

    };

    /**
     * 获取当前 Dom 对象的可视区域大小。包括 border 大小。
     * @return {Point} 位置。
     * @remark
     * 此方法对可见和隐藏元素均有效。
     * 
     * 获取元素实际占用大小（包括内边距和边框）。
     * @example
     * 获取第一段落实际大小。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p:first").getSize();</pre>
     * #####结果:
     * <pre lang="htm" format="none">{x=200,y=100}</pre>
     */
    Dom.getSize = function (elem) {
        var ret;
        if (elem.nodeType === 9) {
            elem = elem.documentElement;
            ret = {
                x: elem.clientWidth,
                y: elem.clientHeight
            };
        } else {
            ret = {
                x: elem.offsetWidth,
                y: elem.offsetHeight
            };
        }

        return ret;

    };

    /**
     * 获取当前 Dom 对象设置CSS宽度(width)属性的值（不带滚动条）。
     * @param {Number} value 设置的宽度值。
     * @return this
     * @example
     * 将所有段落的宽设为 20。
     * <pre>Dom.query("p").setWidth(20);</pre>
     */
    Dom.setWidth = styleHooks.width.set;

    /**
     * 获取当前 Dom 对象的CSS width值。（不带滚动条）。
     * @return {Number} 获取的值。
     * 取得元素当前计算的宽度值（px）。
     * @example
     * 获取第一段的宽。
     * <pre>Dom.query("p").item(0).getWidth();</pre>
     * 
     * 获取当前HTML文档宽度。
     * <pre>document.getWidth();</pre>
     */
    Dom.getWidth = function (elem) {
        return styleNumber(elem, 'width');
    };

    /**
     * 获取当前 Dom 对象设置CSS高度(hidth)属性的值（不带滚动条）。
     * @param {Number} value 设置的高度值。
     * @return this
     * @example
     * 将所有段落的高设为 20。
     * <pre>Dom.query("p").setHeight(20);</pre>
     */
    Dom.setHeight = styleHooks.height.set;

    /**
     * 获取当前 Dom 对象的CSS height值。（不带滚动条）。
     * @return {Number} 获取的值。
     * 取得元素当前计算的高度值（px）。
     * @example
     * 获取第一段的高。
     * <pre>Dom.query("p").item(0).getHeight();</pre>
     * 
     * 获取当前HTML文档高度。
     * <pre>document.getHeight();</pre>
     */
    Dom.getHeight = function (elem) {
        return styleNumber(elem, 'height');
    };

    /**
     * 获取当前 Dom 对象的滚动区域大小。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * getScrollSize 获取的值总是大于或的关于 getSize 的值。
     * 
     * 此方法对可见和隐藏元素均有效。
     */
    Dom.getScrollSize = function (elem) {
        var ret = null, elem, body;

        if (elem.nodeType === 9) {
            body = elem.body;
            elem = elem.documentElement;
            ret = {
                x: Math.max(elem.scrollWidth, body.scrollWidth, elem.clientWidth),
                y: Math.max(elem.scrollHeight, body.scrollHeight, elem.clientHeight)
            };
        } else {
            ret = {
                x: elem.scrollWidth,
                y: elem.scrollHeight
            };
        }

        return ret;
    };

    //#endregion

    //#region Offset

    /**
     * 判断 body 节点的正则表达式。
     * @type RegExp
     */
    var rBody = /^(?:BODY|HTML|#document)$/i;

    function getDocumentScroll(doc) {
        var p, win;
        if ('pageXOffset' in (win = doc.defaultView || doc.parentWindow)) {
            p = {
                x: win.pageXOffset,
                y: win.pageYOffset
            };
        } else {
            elem = doc.documentElement;
            p = {
                x: elem.scrollLeft,
                y: elem.scrollTop
            };
        }

        return p;
    }

    /**
     * 获取用于让当前 Dom 对象定位的父对象。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     */
    Dom.offsetParent = function (elem) {
    	var p = elem;
        while ((p = p.offsetParent) && !rBody.test(p.nodeName) && styleString(p, "position") === "static");
        return p || getDocument(elem).body;
    };

    /**
     * 获取当前 Dom 对象的绝对位置。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * 此方法只对可见元素有效。
     * @example
     * 获取第二段的偏移
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>
     * var p = Dom.query("p").item(1);
     * var position = p.getPosition();
     * trace( "left: " + position.x + ", top: " + position.y );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 0, top: 35&lt;/p&gt;</pre>
     */
    Dom.getPosition = function (elem) {

        // 对于 document，返回 scroll 。
        if (elem.nodeType === 9) {
            return getDocumentScroll(elem);
        }

        var bound = typeof elem.getBoundingClientRect !== "undefined" ? elem.getBoundingClientRect() : { x: 0, y: 0 },
            doc = getDocument(elem),
            html = doc.documentElement,
            htmlScroll = getDocumentScroll(doc);
        return {
            x: bound.left + htmlScroll.x - html.clientLeft,
            y: bound.top + htmlScroll.y - html.clientTop
        };
    };

    /**
     * 设置当前 Dom 对象的绝对位置。
     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
     * @return this
     * @remark
     * 如果对象原先的position样式属性是static的话，会被改成relative来实现重定位。
     * @example
     * 设置第二段的位置。
     * #####HTML:
     * <pre lang="htm" format="none">
     * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;
     * </pre>
     * #####JavaScript:
     * <pre>
     * Dom.query("p:last").setPosition({ x: 10, y: 30 });
     * </pre>
     */
    Dom.setPosition = function (elem, value) {

        Dom.movable(elem);

        var currentPosition = Dom.getPosition(elem),
            offset = Dom.getOffset(elem);

        if (value.y != null) offset.y += value.y - currentPosition.y;
        else offset.y = null;

        if (value.x != null) offset.x += value.x - currentPosition.x;
        else offset.x = null;

        Dom.setOffset(elem, offset);

    };

    /**
     * 获取当前 Dom 对象的相对位置。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
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
     * trace( "left: " + offset.x + ", top: " + offset.y );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
     */
    Dom.getOffset = function (elem) {

        // 如果设置过 left top ，这是非常轻松的事。
        var left = styleString(elem, 'left'),
            top = styleString(elem, 'top');

        // 如果未设置过。
        if ((!left || !top || left === 'auto' || top === 'auto') && styleString(elem, "position") === 'absolute') {

            // 绝对定位需要返回绝对位置。
            top = Dom.offsetParent(elem);
            left = Dom.getPosition(elem);
            if (!rBody.test(top.nodeName)) {
            	var t = Dom.getPosition(top);
            	left.x -= t.x;
            	lefy.y -= t.y;
            }
            left.x -= styleNumber(elem, 'marginLeft') + styleNumber(top, 'borderLeftWidth');
            left.y -= styleNumber(elem, 'marginTop') + styleNumber(top, 'borderTopWidth');

            return left;
        }

        // 碰到 auto ， 空 变为 0 。
        return {
            x: parseFloat(left) || 0,
            y: parseFloat(top) || 0
        };


    };

    /**
     * 设置当前 Dom 对象相对父元素的偏移。
     * @param {Point} value 要设置的 x, y 对象。
     * @return this
     * @remark
     * 此函数仅改变 CSS 中 left 和 top 的值。
     * 如果当前对象的 position 是static，则此函数无效。
     * 可以通过 {@link #setPosition} 强制修改 position, 或先调用 {@link Dom.movable} 来更改 position 。
     *
     * @example
     * 设置第一段的偏移。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>
     * Dom.query("p:first").setOffset({ x: 10, y: 30 });
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
     */
    Dom.setOffset = function (elem, value) {

        ////assert(value, "Dom#setOffset(value): {value} 必须有 'x' 和 'y' 属性。", value);

        elem = elem.style;

        if (value.y != null)
            elem.top = value.y + 'px';

        if (value.x != null)
            elem.left = value.x + 'px';
    };

    /**
     * 获取当前 Dom 对象的滚动条的位置。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * 此方法对可见和隐藏元素均有效。
     *
     * @example
     * 获取第一段相对滚动条顶部的偏移。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>
     * var p = Dom.query("p").item(0);
     * trace( "scrollTop:" + p.getScroll() );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">
     * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;scrollTop: 0&lt;/p&gt;
     * </pre>
     */
    Dom.getScroll = function (elem) {
        return elem.nodeType === 9 ? getDocumentScroll(elem) : {
            x: elem.scrollLeft,
            y: elem.scrollTop
        };
    };

    /**
     * 设置当前 Dom 对象的滚动条位置。
     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
     * @return this
     */
    Dom.setScroll = function (elem, value) {

        if (elem.nodeType !== 9) {
            if (value.x != null) elem.scrollLeft = value.x;
            if (value.y != null) elem.scrollTop = value.y;
        } else {
            var scroll = getDocumentScroll(elem);
            if (value.x == null)
                value.x = scroll.x;
            if (value.y == null)
                value.y = scroll.y;
            (elem.defaultView || elem.parentWindow).scrollTo(value.x, value.y);
        }

    };

    //#endregion

    //#region DOMReady

    /**
     * 浏览器使用的真实的 DOMContentLoaded 事件名字。
     * @type String
     */
    var domReady = 'DOMContentLoaded';

    Dom.global = new Class.Base();

    if (isIE678) {

        domReady = 'readystatechange';

        try {

            // 修复IE6 因 css 改变背景图出现的闪烁。
            document.execCommand("BackgroundImageCache", false, true);
        } catch (e) {

        }
    }

    /**
	 * 设置在页面加载(不包含图片)完成时执行函数。
	 * @param {Functon} fn 当DOM加载完成后要执行的函数。
	 * @member Dom.ready
	 * @remark
	 * 允许你绑定一个在DOM文档载入完成后执行的函数。需要把页面中所有需要在 DOM 加载完成时执行的Dom.ready()操作符都包装到其中来。
	 * 
        @example
          当DOM加载完成后，执行其中的函数。
          #####JavaScript:<pre>Dom.ready(function(){
  // 文档就绪
});</pre>
        
	 */

    /**
	 * 设置在页面加载(包含图片)完成时执行函数。
	 * @param {Functon} fn 执行的函数。
	 * @member Dom.load
	 * @remark
	 * 允许你绑定一个在DOM文档载入完成后执行的函数。需要把页面中所有需要在 DOM 加载完成时执行的Dom.load()操作符都包装到其中来。
        @example
          当DOM加载完成后，执行其中的函数。
          #####JavaScript:<pre>Dom.load(function(){
  // 文档和引用的资源文件加载完成
});</pre>
        
	 */

    // 避免使用了默认的 DOM 事件处理。
    // Dom.$event.domready = Dom.$event.domload = {};

    map('ready load', function (readyOrLoad, isLoad) {

        var isReadyOrIsLoad = isLoad ? 'isLoaded' : 'isReady';

        // 设置 ready load
        Dom[readyOrLoad] = function (fn, scope) {

            // 忽略参数不是函数的调用。
            var isFn = typeof fn === 'function';

            // 如果已载入，则直接执行参数。
            if (Dom[isReadyOrIsLoad]) {

                if (isFn)
                    fn.call(scope);

                // 如果参数是函数。
            } else if (isFn) {

                Dom.global.on(readyOrLoad, fn, scope);

                // 触发事件。
                // 如果存在 JS 之后的 CSS 文件， 肯能导致 document.body 为空，此时延时执行 DomReady
            } else if (document.body) {

                // 如果 isReady, 则删除
                if (isLoad) {

                    // 使用系统文档完成事件。
                    isFn = window;
                    fn = readyOrLoad;

                    // 确保 ready 触发。
                    Dom.ready();

                } else {
                    isFn = document;
                    fn = domReady;
                }

                Dom.removeListener(isFn, fn, arguments.callee);

                // 先设置为已经执行。
                Dom[isReadyOrIsLoad] = true;

                // 触发事件。
                if (Dom.global.trigger(readyOrLoad, fn)) {

                    // 删除事件。
                    Dom.global.un(readyOrLoad);

                }

            } else {
                setTimeout(arguments.callee, 1);
            }

            return document;
        };

    });

    // 如果readyState 不是 complete, 说明文档正在加载。
    if (document.readyState !== "complete") {

        // 使用系统文档完成事件。
        Dom.addListener(document, domReady, Dom.ready);

        Dom.addListener(window, 'load', Dom.load);

        /// #if CompactMode

        // 只对 IE 检查。
        if (isIE678) {

            // 来自 jQuery
            // 如果是 IE 且不是框架
            var topLevel = false;

            try {
                topLevel = window.frameElement == null && document.documentElement;
            } catch (e) {
            }

            if (topLevel && topLevel.doScroll) {

                /**
				 * 为 IE 检查状态。
				 * @private
				 */
                (function doScrollCheck() {
                    if (Dom.isReady) {
                        return;
                    }

                    try {
                        // Use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        topLevel.doScroll("left");
                    } catch (e) {
                        return setTimeout(doScrollCheck, 50);
                    }

                    Dom.ready();
                })();
            }
        }

        /// #endif
    } else {
        setTimeout(Dom.load, 1);
    }

    //#endregion

    //#region Export

    return Dom;

    //#endregion

})();

// 导出函数。
var $ = $ || Dom.query, $$ = $$ || Dom.get;
/*********************************************************
 * ui/core/base.js
 ********************************************************//**
 * @author xuld
 */

//#include ui/core/base.css
//#include core/class.js
//#include dom/base.js

/**
 * 所有 UI 组件的基类。
 * @class Control
 * @abstract
 * 控件的生命周期：
 * constructor - 创建控件对应的 Javascript 类。不建议重写构造函数，除非你知道你在做什么。
 * create - 创建本身的 dom 节点。默认为解析 #tpl 对应的 HTML 字符串，返回相应原生节点。
 * init - 初始化控件本身。默认为空函数。
 * attach - 添加控件对应的节点到 DOM 树。不建议重写，如果一个控件封装了多个 DOM 节点则需重写本函数。
 * detach - 删除控件对应的节点。不建议重写，如果一个控件封装了多个 DOM 节点则需重写本函数。
 */
var Control = Class({

    /**
	 * 当前 UI 组件对应的原生节点。
	 * @type {Element}
	 */
    elem: null,

    /**
	 * 当前 UI 组件的 css 类。
	 * @protected virtual
	 */
    cssClass: "x-control",

    /**
	 * 当前 UI 组件的 HTML 模板字符串。其中 x-control 会被替换为 cssClass 属性的值。
	 * @getter {String} tpl
	 * @protected virtual
	 */
    tpl: '<div class="{cssClass}" />',

    /**
	 * 当被子类重写时，生成当前控件对应的原生节点。
	 * @param {Object} options 选项。
     * @return {Element} 原生的 DOM 节点。
	 * @protected virtual
	 */
    create: function () {

        // 转为对 tpl解析。
        return Dom.parseNode(String.format(this.tpl, this));
    },

    /**
	 * 当被子类重写时，初始化当前控件。
	 * @param {Object} options 当前控件的初始化配置。
	 * @protected virtual
	 */
    init: Function.empty,

    attach: function (parentNode, refNode) {
    	Dom.render(this.elem, parentNode, refNode);
    },

    detach: function () {
    	Dom.remove(this.elem);
    },

	/**
	 * 初始化一个新的控件。
	 * @param {String/Element/Dom/Object} [options] 绑定的节点或节点 id 或完整的配置对象，用于初始化当前控件。
	 */
    constructor: function (options) {

    	// 这是所有控件共用的构造函数。
    	var me = this,

			// 临时的配置对象。
			opt = {},
    	    
			key,
			    
			value;

    	// 如果存在配置。
    	if (options) {

    		// 如果 options 是纯配置。
    	    if (options.constructor === Object) {

    	        // 将配置拷贝到 opt 对象。
    	        Object.extend(opt, options);

    	        me.elem = opt.elem = opt.elem ? Dom.find(opt.elem) : me.create(opt);

    		} else {

    			// 否则，尝试根据 options 找到节点。
    			me.elem = Dom.find(options);
    		}

    	} else {

    		me.elem = me.create(opt);
    	}

    	// 调用 init 初始化控件。
    	me.init(opt);

    	// 设置其它的各个选项。
    	for (key in opt) {
    	    value = opt[key];

    	    if (typeof me[key] === 'function') {
    	        me[key](value);
    	    } else {
    	        me[key] = value;
    	    }
    	}
    },

    renderTo: function (parent, refChild) {
        this.attach(Dom.find(parent), refChild ? Dom.find(refChild) : null);
    	return this;
    },

    remove: function () {
    	this.detach();
    	return this;
    }

});
/*********************************************************
 * ui/core/iinput.js
 ********************************************************//**
 * @author xuld
 */

//#include dom/base.js

/**
 * 所有表单输入控件实现的接口。
 * @interface IInput
 */
var IInput = {
	
	/**
	 * 获取或设置当前表单的代理输入域。
	 * @protected
	 * @type {Dom}
	 */
	inputNode: null,
	
	/**
	 * 获取当前输入域实际用于提交数据的表单域。
	 * @return {Dom} 一个用于提交表单的数据域。
     * @remark 此函数会在当前控件内搜索可用于提交的表单域，如果找不到，则创建返回一个 input[type=hidden] 表单域。
	 * @protected virtual
	 */
	input: function () {
        
	    // 如果不存在隐藏域, 则创建一个。
	    // 如果当前控件本身就是 INPUT|SELECT|TEXTAREA|BUTTON，则输入域为自身。
	    // 否则在控件内部查找合适的输入域。
        // 如果找不到，则创建一个 input:hidden 。
		return this.inputNode || (this.inputNode = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(this.elem.tagName) ? this.elem : Dom.find("input,select,textarea", this.elem) || Dom.append(this.elem, '<input type="hidden" name="' + Dom.getAttr(this.elem, "name") + '">'));
	},

	/**
	 * 设置当前输入域的状态, 并改变控件的样式。
     * @param {String} name 状态名。
     * @param {Boolean} value=false 要设置的状态值。
	 * @protected virtual
	 */
	state: function (name, value) {
		Dom.toggleClass(this.elem, this.cssClass + '-' + name, value);
	},
	
	/**
	 * 获取当前控件所在的表单。
	 * @return {Dom} 返回当前控件所在的表单的 Dom 对象。
	 */
	form: function () {
		return this.input().form;
	},

	getValue: function () {
		return Dom.getText(this.input());
	},

	setValue: function (value) {
		Dom.setText(this.input(), value);
		return this;
	},

	getAttr: function (name, type) {
		return Dom.getAttr(this.input(), name, type);
	},

	setAttr: function (name, value) {

	    // 一些状态属性需执行 state() 
        // 几个特殊属性需要对 input() 操作。
	    if (/^(disabled|readonly|checked|selected|actived|hover)$/i.test(name)) {
	        value = value !== false;
	        this.state(name.toLowerCase(), value);
	    }

	    Dom.setAttr(this.input(), name, value);
	    return this;
	}
	
};
/*********************************************************
 * dom/pin.js
 ********************************************************//**
 * @author xuld 
 */

//#include dom/base.js

Dom.pin = (function(){

	var aligners = {
			
		xc: function (opt) {
			opt.x = opt.tp.x + (opt.ts.x - opt.s.x) / 2 + opt.ox;
		},
			
		ll: function(opt, r){
			opt.x = opt.tp.x - opt.s.x - opt.ox;
				
			if(r > 0 && opt.x <= opt.dp.x) {
				aligners.rr(opt, --r);
			}
		},
			
		rr: function(opt, r){
			opt.x = opt.tp.x + opt.ts.x + opt.ox;
				
			if(r > 0 && opt.x + opt.s.x >= opt.dp.x + opt.ds.x) {
				aligners.ll(opt, --r);
			}
		},
			
		lr: function (opt, r) {
			opt.x = opt.tp.x + opt.ox;
				
			if(r > 0 && opt.x + opt.s.x >= opt.dp.x + opt.ds.x) {
				aligners.rl(opt, --r);
			}
		},
			
		rl: function (opt, r) {
			opt.x = opt.tp.x + opt.ts.x - opt.s.x - opt.ox;
				
			if(r > 0 && opt.x <= opt.dp.x) {
				aligners.lr(opt, --r);
			}
		},
			
		yc: function (opt) {
			opt.y = opt.tp.y + (opt.ts.y - opt.s.y) / 2 + opt.oy;
		},
			
		tt: function(opt, r){
			opt.y = opt.tp.y - opt.s.y - opt.oy;
				
			if(r > 0 && opt.y <= opt.dp.y) {
				aligners.bb(opt, --r);
			}
		},
			
		bb: function(opt, r){
			opt.y = opt.tp.y + opt.ts.y + opt.oy;
				
			if(r > 0 && opt.y + opt.s.y >= opt.dp.y + opt.ds.y) {
				aligners.tt(opt, --r);
			}
		},
			
		tb: function (opt, r) {
			opt.y = opt.tp.y + opt.oy;
				
			if(r > 0 && opt.y + opt.s.y >= opt.dp.y + opt.ds.y) {
				aligners.bt(opt, --r);
			}
		},
			
		bt: function (opt, r) {
			opt.y = opt.tp.y + opt.ts.y - opt.s.y - opt.oy;
				
			if(r > 0 && opt.y <= opt.dp.y) {
				aligners.tb(opt, --r);
			}
		}

	};
	
	/*
	 *      tl        tr
	 *      ------------
	 *   lt |          | rt
	 *      |          |
	 *      |    cc    | 
	 *      |          |
	 *   lb |          | rb
	 *      ------------
	 *      bl        br
	 */
	
	return function (elem, target, position, offsetX, offsetY, enableReset) {
					
		//assert(position, "Dom#pin(ctrl, position,  offsetX, offsetY): {position} 格式不正确。正确的格式如 lt", position);
			
		target = Dom.find(target);

		var opt = {
			s: Dom.getSize(elem),
			ts: Dom.getSize(target),
			tp: Dom.getPosition(target),
			ds: Dom.getSize(document),
			dp: Dom.getPosition(document),
			ox: offsetX || 0,
			oy: offsetY || 0
		}, r = enableReset === false ? 0 : 2, x, y;

		if (position.length <= 1) {
			if (position === 'r') {
				x = 'rr';
				y = 'tb';
			} else {
				x = 'lr';
				y = 'bb';
			}
		} else {
			x = position.substr(0, 2);
			y = position.substr(3);
		}

		//assert(aligners[x] && aligners[y], "Dom#pin(ctrl, position,  offsetX, offsetY): {position} 格式不正确。正确的格式如 lt", position);

		aligners[x](opt, r);
		aligners[y](opt, r);

		Dom.setPosition(elem, opt);

	};
		
})();

/**
 * 为控件提供按控件定位的方法。
 * @class Dom
 */
Dom.implement({

	/**
	 * 基于某个控件，设置当前控件的位置。改函数让控件显示都目标的右侧。
	 * @param {Dom} dom 目标的控件。
	 * @param {String} align 设置的位置。如 ll-bb 。完整的说明见备注。
	 * @param {Number} offsetX=0 偏移的X大小。
	 * @param {Number} offsetY=0 偏移的y大小。
	 * @param {Boolean} enableReset=true 如果元素超出屏幕范围，是否自动更新节点位置。
	 */
	pin: function () {

	}
	
});

/*********************************************************
 * utils/deferrable.js
 ********************************************************//**
 * @author xuld
 */

//#include core/class.js

/**
 * 用于异步执行任务时保证任务是串行的。
 * @class Deferrable
 */
var Deferrable = Class({

	/**
	 * 让 *deferrable* 等待当前任务完成后继续执行。
	 * @param {Deferrable} deferrable 需要等待的 Deferrable 对象。
	 * @param {Object} args 执行 *deferrable* 时使用的参数。
	 */
	chain: function (deferrable, args) {
		var lastTask = [deferrable, args];

		if (this._firstTask) {
			this._lastTask[2] = lastTask;
		} else {
			this._firstTask = lastTask;
		}
		this._lastTask = lastTask;
	},

	/**
	 * 通知当前对象任务已经完成，并继续执行下一个任务。
	 * @protected
	 * @return this
	 */
	progress: function () {

		var firstTask = this._firstTask;
		this.isRunning = false;

		if (firstTask) {
			this._firstTask = firstTask[2];

			firstTask[0].run(firstTask[1]);
		}

		return this;

	},

	/**
	 * 检查当前的任务执行状态，防止任务同时执行。
	 * @param {Object} args 即将需要执行时使用的参数。
	 * @param {String} link="wait" 如果当前任务正在执行后的操作。
	 * 
	 * - wait: 等待上个任务完成。
	 * - ignore: 忽略新的任务。
	 * - stop: 正常中断上个任务，上个操作的回调被立即执行，然后执行当前任务。
	 * - abort: 强制停止上个任务，上个操作的回调被忽略，然后执行当前任务。
	 * - replace: 替换上个任务为新的任务，上个任务的回调将被复制。
	 * @return {Boolean} 返回一个值，指示是否可以执行新的操作。
	 * @protected
	 */
	defer: function (args, link) {

		var isRunning = this.isRunning;
		this.isRunning = true;

		if (!isRunning)
			return false;

		switch (link) {
			case undefined:
				break;
			case "abort":
			case "stop":
			case "skip":
				this[link]();
				this.isRunning = true;
				return false;
			case "replace":
				this.init(this.options = Object.extend(this.options, args));

				// fall through
			case "ignore":
				return true;
			default:
				////assert(link === "wait", "Deferred#defer(args, link): 成员 {link} 必须是 wait、abort、stop、ignore、replace 之一。", link);
		}

		this.chain(this, args);
		return true;
	},

	/**
	 * 让当前任务等待指定的 *deferred* 全部执行完毕后执行。
	 * @param {Deferrable} deferrable 需要预先执行的 Deferrable 对象。
	 * @return this
	 */
	wait: function (deferred) {
		if (this.isRunning) {
			this.stop();
		}

		this.defer = deferred.defer.bind(deferred);
		this.progress = deferred.progress.bind(deferred);
		return this;
	},

	/**
	 * 定义当前任务执行完成后的回调函数。
	 * @param {Deferrable} callback 需要等待执行的回调函数。
	 * @param {Object} args 执行 *callback* 时使用的参数。
	 */
	then: function (callback, args) {
		if (this.isRunning) {
			this.chain({
				owner: this,
				run: function (args) {
					if (callback.call(this.owner, args) !== false)
						this.owner.progress();
				}
			}, args);
		} else {
			callback.call(this, args);
		}
		return this;
	},

	/**
	 * 让当前任务推迟指定时间后执行。
	 * @param {Integer} duration 等待的毫秒数。
	 * @return this
	 */
	delay: function (duration) {
		return this.run({ duration: duration });
	},

	/**
	 * 当被子类重写时，用于暂停正在执行的任务。
	 * @protected virtual
	 * @method
	 */
	pause: Function.empty,

	/**
	 * 中止然后跳过正在执行的任务。
	 * @return this
	 */
	skip: function () {
		this.pause();
		this.progress();
		return this;
	},

	/**
	 * 强制中止正在执行的任务。
	 * @return this
	 */
	abort: function () {
		this.pause();
		this._firstTask = this._lastTask = null;
		this.isRunning = false;
		return this;
	},

	/**
	 * 正常中止正在执行的任务。
	 * @return this
	 * @virtual
	 */
	stop: function () {
		return this.abort();
	}

});
/*********************************************************
 * fx/base.js
 ********************************************************//**
 * @fileOverview 提供底层的 特效算法支持。
 * @author xuld
 */

//#include utils/deferrable.js

/**
 * 特效算法基类。
 * @class Fx
 * @extends Deferrable
 * @abstract
 */
var Fx = (function() {
	
	/// #region interval
	
	var cache = {};
	
	/**
	 * 定时执行的函数。
	 */
	function interval(){
		var i = this.length;
		while(--i >= 0)
			this[i].step();
	}
	
	/// #endregion
		
	return Deferrable.extend({

		/**
		 * 当前 FX 对象的默认配置。
		 */
		options: {

			/**
			 * 特效执行毫秒数。
			 * @type {Number}
			 */
			duration: 300,

			/**
			 * 每秒的运行帧次。
			 * @type {Number}
			 */
			fps: 50,

			/**
			 * 用于实现渐变曲线的计算函数。函数的参数为：
			 *
			 * - @param {Object} p 转换前的数值，0-1 之间。
			 *
			 * 返回值是一个数字，表示转换后的值，0-1 之间。
			 * @field
			 * @type Function
			 * @remark
			 */
			transition: function(p) {
				return -(Math.cos(Math.PI * p) - 1) / 2;
			}

		},
		
		/**
		 * 当被子类重写时，实现生成当前变化所进行的初始状态。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @return {Base} this
		 * @protected virtual
		 */
		init: Function.empty,
		
		/**
		 * 根据指定变化量设置值。
		 * @param {Number} delta 变化量。 0 - 1 。
		 * @protected abstract
		 */
		set: Function.empty,
		
		/**
		 * 进入变换的下步。
		 * @protected
		 */
		step: function() {
			var me = this,
				time = Date.now() - me.time,
				options = me.options;
			if (time < options.duration) {
				me.set(options.transition(time / options.duration));
			}  else {
				me.end(false);
			}
		},
		
		/**
		 * 开始运行特效。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [onComplete] 停止回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
		 * @return {Base} this
		 */
		run: function (options, link) {
			var me = this, defaultOptions, duration;
			if (!me.defer(options, link)) {

				defaultOptions = me.options;

				// options
				me.options = options = Object.extend({
					transition: defaultOptions.transition,
					fps: defaultOptions.fps
				}, options);

				// duration
				duration = options.duration;
				//assert(duration == undefined || duration === 0 || +duration, "Fx#run(options, link): {duration} 必须是数字。如果需要使用默认的时间，使用 -1 。",  duration);
				options.duration = duration !== -1 && duration != undefined ? duration < 0 ? -defaultOptions.duration / duration : duration : defaultOptions.duration;

				// start
				if (options.start && options.start.call(options.elem, options, me) === false) {
					me.progress();
				} else {
					
					me.init(options);
					me.set(0);
					me.time = 0;
					me.resume();
				}
			}

			return me;
		},

		/**
		 * 由应用程序通知当前 Fx 对象特效执行完。
		 * @param {Boolean} isAbort 如果是强制中止则为 true, 否则是 false 。
		 * @protected
		 */
		end: function(isAbort) {
			var me = this;
			me.pause();
			me.set(1);
			try {

				// 调用回调函数。
				if (me.options.complete) {
					me.options.complete.call(me.options.elem, isAbort, me);
				}
			} finally {

				// 删除配置对象。恢复默认的配置对象。
				delete me.options;
				me.progress();
			}
			return me;
		},
		
		/**
		 * 中断当前效果。
		 * @protected override
		 * @return this
		 */
		stop: function() {
			this.abort();
			this.end(true);
			return this;
		},
		
		/**
		 * 暂停当前效果。
		 * @protected override
		 */
		pause: function() {
			var me = this, fps, intervals;
			if (me.timer) {
				me.time = Date.now() - me.time;
				fps = me.options.fps;
				intervals = cache[fps];
				intervals.remove(me);
				if (intervals.length === 0) {
					clearInterval(me.timer);
					delete cache[fps];
				}
				me.timer = 0;
			}
		},
		
		/**
		 * 恢复当前效果。
		 */
		resume: function() {
			var me = this, fps, intervals;
			if (!me.timer) {
				me.time = Date.now() - me.time;
				fps = me.options.fps;
				intervals = cache[fps];
				if (intervals) {
					intervals.push(me);
					me.timer = intervals[0].timer;
				} else {
					me.timer = setInterval(interval.bind(cache[fps] = [me]), Math.round(1000 / fps ));
				}
			}
			return me;
		}
		
	});
	

})();
/*********************************************************
 * fx/tween.js
 ********************************************************//**
 * @author xuld
 */

//#include fx/base.js
//#include dom/base.js

/**
 * @namespace Fx
 */
Object.extend(Fx, {
	
	/**
	 * 用于特定 css 补间动画的引擎。 
	 */
	tweeners: {},
	
	/**
	 * 默认的补间动画的引擎。 
	 */
	defaultTweeners: [],
	
	/**
	 * 用于数字的动画引擎。
	 */
	numberTweener: {
	    get: Dom.styleNumber,
				
		/**
		 * 常用计算。
		 * @param {Object} from 开始。
		 * @param {Object} to 结束。
		 * @param {Object} delta 变化。
		 */
		compute: function(from, to, delta){
			return (to - from) * delta + from;
		},
		
		parse: function(value){
			return typeof value == "number" ? value : parseFloat(value);
		},
		
		set: function(elem, name, value){
			elem.style[name] = value;
		}
	},

	/**
	 * 补间动画
	 * @class Fx.Tween
	 * @extends Fx
	 */
	Tween: Fx.extend({
		
		/**
		 * 初始化当前特效。
		 */
		constructor: function(){
			
		},
		
		/**
		 * 根据指定变化量设置值。
		 * @param {Number} delta 变化量。 0 - 1 。
		 * @protected override
		 */
		set: function(delta){
			var options = this.options,
				params = options.params,
				elem = options.elem,
				tweener,
				key,
				value;

			// 对当前每个需要执行的特效进行重新计算并赋值。
			for (key in params) {
				value = params[key];
				tweener = value.tweener;
				tweener.set(elem, key, tweener.compute(value.from, value.to, delta));
			}
		},
		
		/**
		 * 生成当前变化所进行的初始状态。
		 * @param {Object} options 开始。
		 * @protected override
		 */
		init: function (options) {
				
			// 对每个设置属性
			var key,
				tweener,
				part,
				value,
				parsed,
				i,
				// 生成新的 tween 对象。
				params = {};
			
			for (key in options.params) {

				// value
				value = options.params[key];

				// 如果 value 是字符串，判断 += -= 或 a-b
				if (typeof value === 'string' && (part = /^([+-]=|(.+?)-)(.*)$/.exec(value))) {
					value = part[3];
				}

				// 找到用于变化指定属性的解析器。
				tweener = Fx.tweeners[key = Dom.camelCase(key)];
				
				// 已经编译过，直接使用， 否则找到合适的解析器。
				if (!tweener) {
					
					// 如果是纯数字属性，使用 numberParser 。
					if(key in Dom.styleNumbers) {
						tweener = Fx.numberTweener;
					} else {
						
						i = Fx.defaultTweeners.length;
						
						// 尝试使用每个转换器
						while (i-- > 0) {
							
							// 获取转换器
							parsed = Fx.defaultTweeners[i].parse(value, key);
							
							// 如果转换后结果合格，证明这个转换器符合此属性。
							if (parsed || parsed === 0) {
								tweener = Fx.defaultTweeners[i];
								break;
							}
						}

						// 找不到合适的解析器。
						if (!tweener) {
							continue;
						}
						
					}

					// 缓存 tweeners，下次直接使用。
					Fx.tweeners[key] = tweener;
				}
				
				// 如果有特殊功能。 ( += -= a-b)
				if(part){
					parsed = part[2];
					i = parsed ? tweener.parse(parsed) : tweener.get(options.elem, key);
					parsed = parsed ? tweener.parse(value) : (i + parseFloat(part[1] === '+=' ? value : '-' + value));
				} else {
					parsed = tweener.parse(value);
					i = tweener.get(options.elem, key);
				}
				
				params[key] = {
					tweener: tweener,
					from: i,
					to: parsed		
				};
				
				//assert(i !== null && parsed !== null, "Fx.Tween#init(options): 无法正确获取属性 {key} 的值({from} {to})。", key, i, parsed);
				
			}

			options.params = params;
		}
	
	}),
	
	createTweener: function(tweener){
		return Object.extendIf(tweener, Fx.numberTweener);
	}
	
});

Object.each(Dom.styleHooks, function (value, key) {
	Fx.tweeners[key] = this;
}, Fx.createTweener({
	set: function (elem, name, value) {
	    Dom.styleHooks[name].set(elem, value);
	}
}));

Fx.tweeners.scrollTop = Fx.createTweener({
	set: function (elem, name, value) {
	    Dom.setScroll(elem, { y: value });
	},
	get: function (elem) {
	    return Dom.getScroll(elem).y;
	}
});

Fx.tweeners.scrollLeft = Fx.createTweener({
	set: function (elem, name, value) {
	    Dom.setScroll(elem, { x: value });
	},
	get: function (elem) {
	    return Dom.getScroll(elem).x;
	}
});

Fx.defaultTweeners.push(Fx.createTweener({

	set: navigator.isIE678 ? function(elem, name, value) {
		try {
			
			// ie 对某些负属性内容报错
			elem.style[name] = value;
		}catch(e){}
	} : function (elem, name, value) {
		
		elem.style[name] = value + 'px';
	}

}));
/*********************************************************
 * fx/animate.js
 ********************************************************//**
 * @author xuld
 */

//#include fx/tween.js

(function () {

    var opacity0 = {
        opacity: 0
    },

        displayEffects = Fx.displayEffects = {
            opacity: function (options, elem) {
                return opacity0;
            }
        },

		toggle = Dom.prototype.toggle,

		shift = Array.prototype.shift,

		height = 'height marginTop paddingTop marginBottom paddingBottom';

    function fixProp(options, elem, prop) {
        options.orignal[prop] = elem.style[prop];
        elem.style[prop] = Dom.styleNumber(elem, prop) + 'px';
    }

    Object.each({
        all: height + ' opacity width',
        height: height,
        width: 'width marginLeft paddingLeft marginRight paddingRight'
    }, function (value, key) {
        value = Object.map(value, this, {});

        displayEffects[key] = function (options, elem, isShow) {

            // 修复 overflow 。
            options.orignal.overflow = elem.style.overflow;
            elem.style.overflow = 'hidden';

            // inline 元素不支持 修改 width 。
            if (Dom.styleString(elem, 'display') === 'inline') {
                options.orignal.display = elem.style.display;
                elem.style.display = 'inline-block';
            }

            // 如果是 width, 固定 height 。
            if (key === 'height') {
                fixProp(options, elem, 'width');
            } else if (key === 'width') {
                fixProp(options, elem, 'height');
            }

            return value;
        };
    }, function () {
        return 0;
    });

    Object.map('Left Right Top Bottom', function (key, index) {
        displayEffects[key.toLowerCase()] = function (options, elem, isShow) {

            // 将父元素的 overflow 设为 hidden 。
            elem.parentNode.style.overflow = 'hidden';

            var params = {},
				fromValue,
				toValue,
				key2,
				delta;

            if (index <= 1) {
                key2 = index === 0 ? 'marginRight' : 'marginLeft';
                fromValue = -elem.offsetWidth - Dom.styleNumber(elem, key2);
                toValue = Dom.styleNumber(elem, key);
                params[key] = isShow ? (fromValue + '-' + toValue) : (toValue + '-' + fromValue);

                fixProp(options, elem, 'width');
                delta = toValue - fromValue;
                toValue = Dom.styleNumber(elem, key2);
                fromValue = toValue + delta;
                params[key2] = isShow ? (fromValue + '-' + toValue) : (toValue + '-' + fromValue);

            } else {
                key2 = index === 2 ? 'marginBottom' : 'marginTop';
                fromValue = -elem.offsetHeight - Dom.styleNumber(elem, key2);
                toValue = Dom.styleNumber(elem, key);
                params[key] = isShow ? (fromValue + '-' + toValue) : (toValue + '-' + fromValue);
            }

            return params;

        };
        key = 'margin' + key;

    });

    /**
	 * 初始化 show/hide 的参数。
	 */
    function initArgs(args) {

        // [elem, 300]
        // [elem, 300, function(){}]
        // [elem, 300, function(){}, 'wait']
        // [elem, {}]
        // [elem, [opacity, 300], {}]

    	var options = args[1] && typeof args[1] === 'object' ? args[1] : {
            duration: args[1],
            callback: args[2],
            link: args[3]
        }, userArgs = args.args;

        // 允许通过 args 字段来定义默认参数。
        if (userArgs != undefined) {
            if (typeof userArgs === 'object') {
                Object.extend(options, userArgs);
            } else {
                options.duration = userArgs;
            }
        }

        // 默认为 opacity 渐变。
        if (!options.effect) {
            options.effect = 'opacity';
        } else if (options.duration === undefined) {

            // 如果指定了渐变方式又没指定时间，覆盖为默认大小。
            options.duration = -1;
        }

        options.callback = options.callback || Function.empty;

        //assert(Fx.displayEffects[options.effect], "Dom#toggle(effect, duration, callback, link): 不支持 {effect} 。", args.effect);


        return options;

    }

    Dom.tween = function (elem) {
        var data = Dom.data(elem);
        return data.$tween || (data.$tween = new Fx.Tween());
    };

    /**
     * 变化到某值。
     * @param {Object} [params] 变化的名字或变化的末值或变化的初值。
     * @param {Number} duration=-1 变化的时间。
     * @param {Function} [oncomplete] 停止回调。
     * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 rerun 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
     * @return this
     */
    Dom.animate = function (elem, params, duration, callback, link) {

        //assert.notNull(params, "Dom#animate(params, duration, oncomplete, link): {params} ~", params);

        if (params.params) {
            link = params.link;
        } else {
            params = {
                params: params,
                duration: duration,
                complete: callback
            };
        }

        params.elem = elem;

        //assert(!params.duration || typeof params.duration === 'number', "Dom#animate(params, duration, callback, link): {duration} 必须是数字。如果需要制定为默认时间，使用 -1 。", params.duration);
        //assert(!params.complete || typeof params.complete === 'function', "Dom#animate(params, duration, callback, link): {callback} 必须是函数", params.complete);

        Dom.tween(elem).run(params, link);
    };

    /**
     * 获取一个标签的默认 display 属性。
     * @param {Element} elem 元素。
     */
    Dom.defaultDisplay = function (elem) {
        var displays = Dom.displays || (Dom.displays = {}),
            tagName = elem.tagName,
            display = displays[tagName],
            iframe,
            iframeDoc;

        if (!display) {

            elem = document.createElement(tagName);
            document.body.appendChild(elem);
            display = Dom.currentStyle(elem, 'display');
            document.body.removeChild(elem);

            // 如果简单的测试方式失败。使用 IFrame 测试。
            if (display === "none" || display === "") {
                iframe = document.body.appendChild(Dom.emptyIframe || (Dom.emptyIframe = Object.extend(document.createElement("iframe"), {
                    frameBorder: 0,
                    width: 0,
                    height: 0
                })));

                // Create a cacheable copy of the iframe document on first call.
                // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
                // document to it; WebKit & Firefox won't allow reusing the iframe document.
                iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
                iframeDoc.write("<!doctype html><html><body>");
                iframeDoc.close();

                elem = iframeDoc.body.appendChild(iframeDoc.createElement(tagName));
                display = Dom.currentStyle(elem, 'display');
                document.body.removeChild(iframe);
            }

            displays[tagName] = display;
        }

        return display;
    };

    /**
     * 显示当前元素。
     * @param {String} [params] 显示时使用的特效。如果为 null，则表示无特效。
     * @param {Number} duration=300 特效持续的毫秒数。如果为 null，则表示无特效。
     * @param {Function} [callback] 特效执行完之后的回调。
     * @param {String} link='wait' 如果正在执行其它特效时的处理方式。
     *
     * - "**wait**"(默认): 等待上个效果执行完成。
     * - "**ignore**": 忽略新的效果。
     * - "**stop**": 正常中止上一个效果，然后执行新的效果。
     * - "**abort**": 强制中止上一个效果，然后执行新的效果。
     * - "**replace**": 将老的特效直接过渡为新的特效。
     * @return this
     */
    Dom.show = function (elem) {
        var args = arguments;
        
        // 加速空参数的 show 调用。
        if (args.length === 1) {

            // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
            elem.style.display = '';

            // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
            if (Dom.currentStyle(elem, 'display') === 'none')
                elem.style.display = elem.style.defaultDisplay || Dom.defaultDisplay(elem);

        } else {

            args = initArgs(args);

            // 如果 duration === null，则使用同步方式显示。
            if (args.duration == null) {
                Dom.show(elem);
                args.callback.call(elem, false, false);
            } else {
                Dom.tween(elem).run({
                    elem: elem,
                    duration: args.duration,
                    start: function (options, fx) {
                    	
                        var elem = this,
                            t,
                            params,
                            param;

                        // 如果元素本来就是显示状态，则不执行后续操作。
                        if (!Dom.isHidden(elem)) {
                        	args.callback.call(elem, true, true);
                            return false;
                        }

                        // 首先显示元素。
                        Dom.show(elem);

                        // 保存原有的值。
                        options.orignal = {};

                        // 新建一个新的 params 。
                        options.params = params = {};

                        // 获取指定特效实际用于展示的css字段。
                        t = Fx.displayEffects[args.effect](options, elem, true);

                        // 保存原有的css值。
                        // 用于在hide的时候可以正常恢复。
                        for (param in t) {
                            options.orignal[param] = elem.style[param];
                        }
		                       
		                // IE6-8 仅支持 filter 设置。 
		            	if(navigator.isIE678 && ('opacity' in t)) {
		            		options.orignal.filter = elem.style.filter;
		            	}

                        // 因为当前是显示元素，因此将值为 0 的项修复为当前值。
                        for (param in t) {
                            if (t[param] === 0) {

                                // 设置变化的目标值。
                                params[param] = Dom.styleNumber(elem, param);

                                // 设置变化的初始值。
                                elem.style[param] = 0;
                            } else {
                                params[param] = t[param];
                            }
                        }
                    },
                    complete: function (isAbort, fx) {
                    	
                        // 拷贝回默认值。
                        Object.extend(this.style, fx.options.orignal);

                        args.callback.call(this, false, isAbort);
                    }
                }, args.link);
            }

        }

    };

    /**
     * 隐藏当前元素。
     * @param {String} effect='opacity' 隐藏时使用的特效。如果为 null，则表示无特效。
     * @param {Number} duration=300 特效持续的毫秒数。如果为 null，则表示无特效。
     * @param {Function} [callback] 特效执行完之后的回调。
     * @param {String} link='wait' 如果正在执行其它特效时的处理方式。
     *
     * - "**wait**"(默认): 等待上个效果执行完成。
     * - "**ignore**": 忽略新的效果。
     * - "**stop**": 正常中止上一个效果，然后执行新的效果。
     * - "**abort**": 强制中止上一个效果，然后执行新的效果。
     * - "**replace**": 将老的特效直接过渡为新的特效。
     * @return this
     */
    Dom.hide = function (elem) {

        var args = arguments;

        // 加速空参数的 show 调用。
        if (args.length === 1) {

            // 如果已经定义了 defaultDisplay， 直接设置为 none 即可。
            if (elem.style.defaultDisplay) {
                elem.style.display = 'none';
            } else {
                var currentDisplay = Dom.styleString(elem, 'display');
                if (currentDisplay !== 'none') {
                    elem.style.defaultDisplay = currentDisplay;
                    elem.style.display = 'none';
                }
            }
        } else {

            args = initArgs(args);

            // 如果 duration === null，则使用同步方式显示。
            if (args.duration === null) {
                Dom.hide(elem);
                args.callback.call(elem, false, false);
            } else {
                Dom.tween(elem).run({
                    elem: elem,
                    duration: args.duration,
                    start: function (options, fx) {

                        var elem = this,
                            params,
                            param;

                        // 如果元素本来就是隐藏状态，则不执行后续操作。
                        if (Dom.isHidden(elem)) {
                        	args.callback.call(elem, false, true);
                            return false;
                        }

                        // 保存原有的值。
                        options.orignal = {};

                        // 获取指定特效实际用于展示的css字段。
                        options.params = params = Fx.displayEffects[args.effect](options, elem, false);
						
                        // 保存原有的css值。
                        // 用于在show的时候可以正常恢复。
                        for (param in params) {
                            options.orignal[param] = elem.style[param];
                        }
		                       
		                // IE6-8 仅支持 filter 设置。 
		            	if(navigator.isIE678 && ('opacity' in params)) {
		            		delete options.orignal.opacity;
		            		options.orignal.filter = elem.style.filter;
		            	}

                    },
                    complete: function (isAbort, fx) {

                        var elem = this;

                        // 最后显示元素。
                        Dom.hide(elem);

                        // 恢复所有属性的默认值。
                        Object.extend(elem.style, fx.options.orignal);

                        // callback
                        args.callback.call(elem, false, isAbort);
                    }
                }, args.link);
            }
        }

    };

    Dom.toggle = function (elem) {

        Dom.tween(elem).then(function (args) {
            Dom[Dom.isHidden(elem) ? 'show' : 'hide'].apply(Dom, args);
            return false;
        }, arguments);

    };

    /**
	 * @class Dom
	 */
    Dom.implement({

        animate: function () {
        	return this.iterate(Dom.animate, arguments);
        },

        show: function () {
        	return this.iterate(Dom.show, arguments);
        },

        hide: function () {
        	return this.iterate(Dom.hide, arguments);
        },

        toggle: function () {
        	return this.iterate(Dom.toggle, arguments);
        }

    });

})();
/*********************************************************
 * ui/core/idropdownowner.js
 ********************************************************//**
 * @author xuld
 */

//#include dom/base.js
//#include dom/pin.js
//#include ui/core/base.js
//#include fx/animate.js

/**
 * 所有支持下拉菜单的组件实现的接口。
 * @interface IDropDownOwner
 */
var IDropDownOwner = {

	/**
	 * 获取或设置当前实际的下拉菜单。
	 * @protected
	 * @type {Dom}
	 */
	dropDown: null,

	dropDownNode: null,

	/**
	 * 下拉菜单的宽度。
	 * @config {String}
	 * @defaultValue 'auto'
	 * @return 如果值为 -1, 则和下拉菜单目标节点有同样的宽度。如果值为 'auto'， 表示根据内容自动决定。
	 */
	dropDownWidth: -1,

	///**
	// * 下拉菜单的最小宽度。
	// * @config {Integer}
	// * @defaultValue 100
	// * @return 如果值为 Infinity, 则表示不限制最小宽度。
	// * @remark 也可以通过 css 的 min-width 属性设置此值。
	// */
	//dropDownMinWidth: 100,

	/**
	 * 当下拉菜单被显示时执行。
     * @protected virtail
	 */
	onDropDownShow: function () {
		this.trigger('dropdownshow');
	},

	/**
	 * 当下拉菜单被隐藏时执行。
     * @protected virtail
	 */
	onDropDownHide: function () {
		this.trigger('dropdownhide');
	},

	attach: function (parentNode, refNode) {
		var dropDown = this.dropDownNode;
		if (dropDown && !Dom.contains(document.body, dropDown)) {
			Dom.render(dropDown, parentNode, refNode);
		}

		Dom.render(this.elem, parentNode, refNode);
	},

	detach: function () {
		if (this.dropDownNode) {
			Dom.remove(this.dropDownNode);
		}

		Dom.remove(this.elem);
	},

	/**
	 * 设置当前控件的下拉菜单。
     * @param {Dom} dom 要设置的下拉菜单节点。
	 * @return {Dom} 
     * @protected virtual
	 */
	setDropDown: function (dom) {

		if (dom) {

			this.dropDown = dom;

			// 修正下拉菜单为 Dom 对象。
			this.dropDownNode = dom = dom.elem || Dom.find(dom);

			// 初始化并保存下拉菜单。
			Dom.addClass(dom, 'x-dropdown');
			Dom.hide(dom);

			// 如果下拉菜单未添加到 DOM 树，则添加到当前节点后。

			if (!Dom.contains(document.body, dom)) {

				// 添加下拉菜单到 DOM 树。
				if (this.elem.parentNode) {
					Dom.after(this.elem, dom);
				} else {
					Dom.append(this.elem, dom);
				}
			}

			// IE6/7 无法自动在父节点无 z-index 时处理 z-index 。
			if (navigator.isIE67 && Dom.getStyle(dom = Dom.parent(dom), 'zIndex') === 0) {
				Dom.setStyle(dom, 'zIndex', 1);
			}

			// dom = null 表示清空下拉菜单。
		} else if (dom = this.dropDownNode) {
			Dom.remove(dom);
			this.dropDown = this.dropDownNode = null;
		}

		return this;
	},

	/**
	 * 获取当前控件的下拉菜单。
	 * @return {Dom} 
     * @protected virtual
	 */
	getDropDown: function () {
		return this.dropDown;
	},

	/**
     * 判断当前下拉菜单是否被隐藏。
     * @return {Boolean} 如果下拉菜单已经被隐藏，则返回 true。
     * @protected virtual
     */
	isDropDownHidden: function () {
		return this.dropDownNode && Dom.isHidden(this.dropDownNode);
	},

	/**
     * 切换下拉菜单的显示状态。
     * @return this
     */
	toggleDropDown: function (e) {

		// 如果菜单已经隐藏，则使用 showDropDown 显示，否则，强制关闭菜单。
		return this.isDropDownHidden() ? this.showDropDown(e) : this.hideDropDown();
	},

	/**
     * 显示下拉菜单。
     * @return this
     */
	showDropDown: function (e) {

		var me = this;

		// 如果是因为 DOM 事件而切换菜单，则测试是否为 disabled 状态。
		if (!e || !Dom.getAttr(me.elem, 'disabled') && !Dom.getAttr(me.elem, 'readonly')) {

			// 如果下拉菜单被隐藏，则先重设大小、定位。
			if (me.isDropDownHidden()) {
				Dom.show(me.dropDownNode);
			}

			me.onDropDownShow();

			// 重新修改宽度。

			// 重新设置位置。
			if (!me.isDropDownHidden()) {
				var dropDown = me.dropDownNode,
					dropDownWidth = me.dropDownWidth;

				if (dropDownWidth < 0) {

					// 在当前目标元素的宽、下拉菜单的 min-width 属性、下拉菜单自身的宽度中找一个最大值。
					dropDownWidth = Math.max(Dom.getSize(me.elem).x, Dom.styleNumber(dropDown, 'min-width'), Dom.getScrollSize(dropDown).x);

				}

				if (dropDownWidth !== 'auto') {
					Dom.setSize(dropDown, { x: dropDownWidth });
				}

				// 设置 mouseup 后自动隐藏菜单。
				Dom.on(document, 'mouseup', me.hideDropDown, me);

				Dom.pin(dropDown, me.elem, 'b', 0, -1);
			}

		}

		return this;
	},

	/**
     * 隐藏下拉菜单。
     * @return this
     */
	hideDropDown: function (e) {

		var dropDown = this.dropDownNode;

		// 仅在本来已显示的时候操作。
		if (dropDown && !this.isDropDownHidden()) {

			// 如果是来自事件的关闭，则检测是否需要关闭菜单。
			if (e) {
				e = e.target;

				// 如果事件源是来自下拉菜单自身，则不操作。
				if (dropDown == e || this.elem === e || Dom.contains(dropDown, e) || Dom.contains(this.elem, e))
					return this;
			}

			Dom.hide(dropDown);

			// 删除 mouseup 回调。
			Dom.un(document, 'mouseup', this.hideDropDown);

		}

		this.onDropDownHide();

		return this;
	}

};/*********************************************************
 * ui/suggest/picker.js
 ********************************************************//**
 * @author  xuld
 */

//#include ui/button/button.css
//#include ui/button/menubutton.css
//#include ui/suggest/picker.css
//#include ui/form/textbox.css
//#include ui/core/base.js
//#include ui/core/iinput.js
//#include ui/core/idropdownowner.js

/**
 * 表示一个数据选择器。
 * @abstract class
 * @extends Control
 */
var Picker = Control.extend(IInput).implement(IDropDownOwner).implement({

    /**
	 * 当前控件是否为列表形式。如果列表模式则优先考虑使用下拉菜单。
     * @config {Boolean}
	 */
	listMode: false,

    /**
	 * 当前控件的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected virtual
	 */
	tpl: '<span class="x-picker">\
			<input type="text" class="x-textbox"/>\
		</span>',

    /**
	 * 当前控件下拉按钮的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected virtual
	 */
    menuButtonTpl: '<button class="x-button" type="button"><span class="x-menubutton-arrow"></span></button>',

    /**
	 * 获取当前控件的按钮部分。
	 */
    button: function () {
    	return Dom.find('button', this.elem);
    },

    /**
	 * 将当前文本的值同步到下拉菜单。
	 * @protected virtual
	 */
    updateDropDown: Function.empty,

    /**
	 * 当下拉菜单被显示时执行。
     * @protected override
	 */
    onDropDownShow: function () {
        // 默认选择当前值。
        this.updateDropDown();
        this.state('actived', true);
        IDropDownOwner.onDropDownShow.apply(this, arguments);
    },

    /**
	 * 当下拉菜单被隐藏时执行。
     * @protected override
	 */
    onDropDownHide: function () {
        this.state('actived', false);
        IDropDownOwner.onDropDownHide.apply(this, arguments);
    },

    /**
	 * 设置当前输入域的状态, 并改变控件的样式。
     * @param {String} name 状态名。常用的状态如： disabled、readonly、checked、selected、actived 。
     * @param {Boolean} value=false 要设置的状态值。
	 * @protected override
	 */
    state: function (name, value) {
        value = value !== false;
        if (name == "disabled" || name == "readonly") {

            // 为按钮增加 disabled 样式。
        	Dom.query('.x-button,button', this.elem).forEach(function (elem) {
        		Dom.setAttr(elem, "disabled", value);
        		Dom.toggleClass(elem, "x-button-disabled", value);
        	});

        	// 为文本框增加设置样式。
            var input = this.input();
            Dom.setAttr(input, name, value);
            Dom.toggleClass(input, "x-textboui-" + name, value);

        } else if (name == "actived") {
        	Dom.query('.x-button,button', this.elem).iterate(Dom.toggleClass, ["x-button-actived", value]);
        } else {
            IInput.state.call(this, name, value);
        }

    },

    /**
     * 创建当前组件的下拉菜单。
     * @param {Dom} existDom=null 已存在的 DOM 节点。
     * @return {Dom} 返回新创建的下拉菜单对象。
     * @protected virtual
     */
    createDropDown: function (existDom) {
        return existDom;
    },

    /**
	 * @protected
	 * @override
	 */
    init: function (options) {
    	var me = this, elem = me.elem;

        // 如果是 <input> 或 <a> 直接替换为 x-picker
    	if (!Dom.first(elem) && !Dom.hasClass(elem, 'x-picker')) {

            // 创建 x-picker 组件。
    		me.elem = Dom.parseNode('<span class="x-picker x-' + me.cssClass + '"></span>');

            // 替换当前节点。
            if (elem.parentNode) {
            	elem.parentNode.replaceChild(me.elem, elem);
            }

            // 插入原始 <input> 节点。
            Dom.prepend(me.elem, elem);

        }

        // 如果没有下拉菜单按钮，添加之。
        if (!me.button()) {
        	Dom.append(me.elem, String.format(me.menuButtonTpl, me));
        }

        // 列表形式，则无法手动更改值，必须强制使用 listMode 。
        if ('listMode' in options) {
            me.listMode = options.listMode;
        } else if (Dom.first(me.elem).tagName !== 'INPUT') {
            me.listMode = true;
        }
		

        // 初始化菜单。
        me.setDropDown(me.createDropDown(Dom.next(me.elem, '.x-dropdown')));

        // 设置菜单显示的事件。
        Dom.on(me.listMode ? me.elem : me.button(), 'click', me.toggleDropDown, me);
        
        if(me.listMode && me.input().tagName === 'INPUT'){
        	Dom.on(me.elem, 'keyup', function(){
        		this.updateDropDown();
        	}, this);
        }

    },
    
    setValue: function (value) {
    	IInput.setValue.call(this, value);
    	this.updateDropDown();
    	return this;
    }

});
/*********************************************************
 * ui/form/searchtextbox.js
 ********************************************************//**
 * @author xuld
 */

//#include ui/form/textbox.css
//#include ui/form/searchtextbox.css
//#include ui/suggest/picker.js

var SearchTextBox = Picker.extend({
	
	cssClass: 'x-searchtextbox',
	
	tpl: '<span class="x-picker">\
				<input type="text" class="x-textbox {cssClass}"/>\
			</span>',
		
	menuButtonTpl: '<button type="button" class="{cssClass}-search"></button>',
	
	onKeyDown: function(e){
		if(e.keyCode === 10 || e.keyCode === 13){
		    this.search();
		}
	},

	search: function () {

	    var text = this.getValue();
	    if (text) {
	        this.onSearch(text);
	        this.trigger('search', text);
	    }


	},
	
	onSearch: Function.empty,
	
	init: function(){
		
		// 如果是 <input> 或 <a> 直接替换为 x-picker
		if (!Dom.first(this.elem) && !Dom.hasClass(this.elem, 'x-picker')) {
			var elem = this.elem;
			
			// 创建 x-picker 组件。
			this.elem = Dom.parseNode('<span class="x-picker"></span>');
			
			// 替换当前节点。
			if(elem.parentNode){
				elem.parentNode.replaceChild(this.elem, elem);
			}
			
			// 插入原始 <input> 节点。
			Dom.prepend(this.elem, elem);
		}
		
		// 如果没有下拉菜单按钮，添加之。
		if(!this.button()) {
			Dom.append(this.elem, String.format(this.menuButtonTpl, this));
		}
		
		var textBox = this.input();
		Dom.on(textBox, 'focus', textBox.select, textBox);
		
		Dom.on(this.button(), 'click', this.search, this);
		Dom.on(textBox, 'keydown', this.onKeyDown, this);
		
		if(navigator.isIE6){
			Dom.on(textBox, 'keypress', this.onKeyDown, this);
		}
	}
});




/*********************************************************
 * ui/nav/scrolltotop.js
 ********************************************************//**
 * @author xuld
 */

//#include fx/animate.js
//#include ui/core/base.js

var ScrollToTop = Control.extend({

    tpl: '<a href="#" class="x-scrolltotop" title="返回顶部">返回顶部</a>',

    showDuration: -1,

    scrollDuration: -1,

    minScroll: 130,

    onClick: function (e) {
    	e.preventDefault();
    	Dom.animate(document, { scrollTop: 0 }, this.scrollDuration);
    },

    init: function (options) {
        
        Dom.on(document, 'scroll', function () {
        	if (Dom.getScroll(document).y > this.minScroll) {
        		Dom.show(this.elem, this.showDuration);
            } else {
        		Dom.hide(this.elem, this.showDuration);
            }
        }, this);
        Dom.on(this.elem, 'click', this.onClick, this);
		
        Dom.render(this.elem);
    }

});
