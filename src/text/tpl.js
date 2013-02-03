/**
 * @author xuld
 */

include("core/class.js");


/**
 * @class Tpl
 * @example Tpl.parse("{if a}OK{end}", {a:1}); //=> OK
 * 模板解析字符串语法:
 * 模板字符串由静态数据和解析单元组成。
 * 普通的内容叫静态的数据，解析前后，静态数据不变。
 * 解析单元由 { 开始， } 结束。解析单元可以是:
 * 1. Javascript 变量名: 这些变量名来自 Tpl.parse 的第2个参数， 比如第二个参数是 {a:[1]} ，那 {a[0]}将返回 1 。
 * 2. if/for/end/else/eval 语句，这5个是内置支持的语法。
 * 2.1 if: {if a} 或  {if(a)} 用来判断一个变量，支持全部Javascript表达式，如 {if a==1} 。语句 {if} 必须使用 {end} 关闭。
 * 2.2 else 等价于 Javascript 的 else， else后可同时有 if语句，比如: {else if a}
 * 2.3 for: {for a in data} for用来遍历对象或数组。  语句 {for} 必须使用 {end} 关闭。
 * 2.4 eval: eval 后可以跟任何 Javascript 代码。 比如 {eval nativeFn(1)}
 * 2.5 其它数据，将被处理为静态数据。
 * 3 如果需要在模板内输出 { 或 }，使用 {{} 和 {}} 。 或者使用 \{ 和 \}
 * 4 特殊变量，模板解析过程中将生成4个特殊变量，这些变量将可以方便操作模板
 * 4.1 $output 模板最后将编译成函数，这个函数返回最后的内容， $output表示这个函数的组成代码。
 * 4.2 $data 表示  Tpl.parse 的第2个参数。
 * 4.3 $index 在 for 循环中，表示当前循环的次号。
 * 4.4 $value 在 for 循环中，表示当前被循环的目标。
 */
var Tpl = Class({

	/**
	 * 把一个模板编译为函数。
	 * @param {String} tpl 表示模板的字符串。
	 * @param {Boolean} strictMode 严格模式，不支持省略.前面的对象。
	 * @return {Function} 返回的函数。
	 */
	constructor: function (tpl, strictMode) {
		tpl = this.build(this.lexer(tpl), strictMode);
		this.parser = new Function("_", tpl);
	},

	/**
	 * 对一个模板进行词法解析。返回拆分的数据单元。
	 * @param {String} tpl 表示模板的字符串。
	 * @return {Array} 返回解析后的数据单元。
	 */
	lexer: function (tpl) {

		/**
		 * [字符串1, 代码块1, 字符串2, 代码块2, ...]
		 */
		var output = [],

			// 块的开始位置。
			blockStart = -1,

			// 块的结束位置。
			blockEnd = -1;

		while ((blockStart = tpl.indexOf('{', blockStart + 1)) >= 0) {

			// 如果 { 后面是 { , 忽略之。
			if (tpl.charAt(blockStart + 1) === '{') {
				blockStart++;
				continue;
			}

			// 放入第一个数据区块。
			output.push(tpl.substring(blockEnd + 1, blockStart));

			// 从  blockStart 处搜索 }
			blockEnd = blockStart;

			// 搜索 } 字符，如果找到的字符尾随一个 } 则跳过。
			do {
				blockEnd = tpl.indexOf('}', blockEnd + 1);

				if (tpl.charAt(blockEnd + 1) !== '}' || tpl.charAt(blockEnd + 2) === '}') {
					break;
				}

				blockEnd++;
			} while (true);

			if (blockEnd == -1) {
				this.throwError("缺少 '}'", tpl.substr(blockStart));
			} else {
				output.push(tpl.substring(blockStart + 1, blockStart = blockEnd).trim());
			}

		}

		// 剩余的部分。
		output.push(tpl.substring(blockEnd + 1, tpl.length));

		return output;
	},

	/**
	 * 将词法解析器的结果编译成函数源码。
	 */
	build: function (lexerOutput, strictMode) {

		var output = "var __OUTPUT__=\"\",__INDEX__,__KEY__,__TARGET__,__TMP__;" + (strictMode ? '{' : 'with(_){');

		for (var i = 0, len = lexerOutput.length, source, isString = true; i < len; i++) {
			source = lexerOutput[i].replace(/([\{\}]){2}/g, "$1");

			if (isString) {
				output += "__OUTPUT__+=\"" + source.replace(/[\"\\\n\r]/g, Tpl.replaceSpecialChars) + "\";";
			} else {
				output += this.parseMacro(source);
			}

			isString = !isString;
		}

		output += "};return __OUTPUT__";

		return output;
	},

	render: function (data, scope) {
		return this.parser.call(scope, data);
	},

	parseMacro: function (macro) {
		var command = (macro.match(/^\w+\b/) || [''])[0],
			params = macro.substr(command.length);

		switch (command) {
			case "end":
				return "}";
			case 'if':
			case 'while':
				if (!params)
					this.throwError("'" + command + "' 语句缺少条件, '" + command + "' 语句的格式为 {" + command + " condition}", macro);
				macro = command + "(Array.isArray(__TMP__=" + params + ")?__TMP__.length:__TMP__){";
				break;
			case 'for':
				if (command = /^\s*(var\s+)?([\w$]+)\s+in\s+/.exec(params)) {
					macro = "__INDEX__=0;__TARGET__=" + params.substr(command[0].length) + ";for(__KEY__ in __TARGET__){if(!__TARGET__.hasOwnProperty(__KEY__))continue;__INDEX__++;var " + command[2] + "=__TARGET__[__KEY__];";
				} else if (/^\(/.test(params)) {
					return macro + "{";
				} else {
					this.throwError("'for' 语法错误， 'for' 语句的格式为 {for var_name in obj}", macro);
				}
				break;
			case 'else':
				return '}else ' + (/^\s*if\b/.exec(params) ? this.parseMacro(params.trim()) : '{');
			case 'var':
				macro += ';';
				break;
			case 'function':
				macro += '{';
				break;
			case 'break':
			case 'continue':
				break;
			case 'eval':
				macro = params + ";";
				break;
			default:
				macro = '__TMP__=' + macro + ';if(__TMP__!=undefined)__OUTPUT__+=__TMP__;';
				break;
		}

		return macro.replace(/@(\w+)\b/g, Tpl.replaceConsts);
	},

	throwError: function (message, tpl) {
		throw new SyntaxError("Tpl#constructor: " + message + "。 (在 '" + tpl + "' 附近)");
	}

});

Object.extend(Tpl, {

	instances: {},

	/**
	 * 使用指定的数据解析模板，并返回生成的内容。
	 * @param {String} tpl 表示模板的字符串。
	 * @param {Object} data 数据。
	 * @param {Object} scope 模板中 this 的指向。
	 * @return {String} 处理后的字符串。 
	 */
	parse: function (tpl, data, scope) {
		return (Tpl.instances[tpl] || (Tpl.instances[tpl] = new Tpl(tpl))).render(data, scope);
	},

	isLast: function (obj, index) {
		if (typeof obj.length === 'number')
			return index >= obj.length - 1;

		for (var p in obj) {
			indeui--;
		}

		return !index;
	},

	consts: {
		'data': '_',
		'target': '__TARGET__',
		'key': '__KEY__',
		'index': '__INDEX__',
		'first': '__INDEX__==0',
		'last': 'Tpl.isLast(__TARGET__,__INDEX__)',
		'odd': '__INDEX__%2===1',
		'even': '__INDEX__%2'
	},

	replaceConsts: function (_, consts) {
		return Tpl.consts[consts] || _;
	},

	specialChars: {
		'"': '\\"',
		'\n': '\\n',
		'\r': '\\r',
		'\\': '\\\\'
	},

	replaceSpecialChars: function (specialChar) {
		return Tpl.specialChars[specialChar] || specialChar;
	}

});


