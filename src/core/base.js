/**
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
