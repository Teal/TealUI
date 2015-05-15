/**
 * @fileOverview 简单但完整的模板引擎。
 */

// 为了支持 foreach 模板使用的 Object.each 函数。
// #require ../utility/base.js

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
 * 6. foreach 语句
 *    为了简化循环操作，模板引擎提供了以相同方式遍历类数组和对象的流程语句。
 *    其写法和 for 语句类似，和 for 语句最大的区别是 foreach 语句没有小括号。
 *      {foreach item in obj}
 *          {循环输出的内容}
 *      {end}
 *    for each 语句同时支持类数组和对象，item 都表示遍历的值， $key 表示数组索引或对象键。
 *    在 for each 语句中，可以使用 $target 获取当前遍历的对象，使用 $key 获取循环变量值。
 *    存在嵌套 for each 时，它们分别表示最近的值，如需跨语句，可使用变量保存。
 *    在 for each 语句中，可以使用 {break} 和 {continue} 控制流程。
 *      {foreach item in obj}
 *          {if $key == 0}
 *              {continue}
 *          {end}
 *          {foreach item2 in item}
 *              {item2}
 *          {end}
 *      {end}
 * 
 * 在模板内如果需要插入 { 和 } 本身，分别写成 {{ 和 }}。
 * 在模板内使用 $data 表示传递给 Tpl.parse 的第2个参数。
 * 
 */
var Tpl = {

    _compiled: {},

    /**
     * 编译指定的模板。
     * @param {String} tplSource 要编译的模板文本。
     * @param {String?} cacheKey = tplSource 表示当前模板的缓存键，相同缓存键的模板可避免被重复编译以提高解析速度。
     */
    compile: function (tplSource, cacheKey) {
        cacheKey = cacheKey || tplSource;
        return Tpl._compiled[cacheKey] || (Tpl._compiled[cacheKey] = Tpl._compileCore(tplSource));
    },

    /**
     * 使用指定的数据解析模板，并返回生成的内容。
     * @param {String} tplSource 要解析的模板文本。
     * @param {Object} data 传递给模板的数据对象。在模板中使用 $data 变量接收此参数。
     * @param {Object} scope 模板中 this 的指向。
     * @param {String?} cacheKey = tplSource 表示当前模板的键，主要用于缓存。
     * @return {String} 返回解析后的模板内容。 
     */
    parse: function (tplSource, data, scope, cacheKey) {
        return Tpl.compile(tplSource, cacheKey).call(scope, data);
    },

    _compileCore: function (tplSource) {

        // 存储已编译的代码段。
        var compiledCode = 'var $output=""\n',

            // 下一个 { 的开始位置。
            blockStart = -1,

            // 上一个 } 的结束位置。
            blockEnd = -1,

            // 存储所有代码语句块。
            commandsStack = [],

            // 纯文本各部分。
            commandText,

            // 标准命令。
            commandMatch,

            // 标准命令。
            commandName;

        // 获取模板指定部分。
        function getSource(start, end) {
            return tplSource.substring(start, end).replace(/([{}])\1/g, '$1');
        }

        // 获取模板指定部分并解析为字符串。
        function getSourceAsPlainText(start, end) {
            return '$output+="' + getSource(start, end).replace(/[\r\n\"\\]/g, function (specialChar) {
                return ({
                    '"': '\\"',
                    '\n': '\\n',
                    '\r': '\\r',
                    '\\': '\\\\'
                })[specialChar];
            }) + '"\n';
        }

        // 每次处理一个 {} 的部分。
        while ((blockStart = tplSource.indexOf('{', blockStart + 1)) >= 0) {

            // 忽略 {{。
            if (tplSource[blockStart + 1] === '{') {
                blockStart++;
                continue;
            }

            // 处理 { 之前的内容。
            compiledCode += getSourceAsPlainText(blockEnd + 1, blockStart);

            // 从  blockStart 处搜索 }
            blockEnd = blockStart;

            // 搜索 }。
            while (true) {
                blockEnd = tplSource.indexOf('}', blockEnd + 1);

                // 处理不存在 } 的情况。
                if (blockEnd == -1) {
                    throw new SyntaxError("缺少 “}”\r\n在“", tplSource.substr(blockStart) + "”范围");
                }

                // 忽略 }}。
                if (tplSource[blockEnd + 1] !== '}') {
                    break;
                }

                blockEnd++;
            }

            // 处理 {} 之间的内容。
            commandText = getSource(blockStart + 1, blockEnd);

            commandMatch = /^\s*(\/?)(\w+)\b/.exec(commandText) || [];

            if (commandMatch[1]) {
                if (!commandsStack.length || commandsStack[commandsStack.length - 1] !== commandMatch[2]) {
                    throw new SyntaxError("模板编译错误：发现多余的" + commandText + "\r\n在“" + tplSource.substring(blockStart - 20, blockStart) + "”附近");
                }
                compiledCode += commandsStack.pop() === 'foreach' ? '},this)\n' : '}\n';
            } else {

                switch (commandName = commandMatch[2]) {
                    case 'foreach':
                        commandMatch = /^\s*foreach\s*(var)?\s*([\w$]+)(\s*,\s*([\w$]+))?\s+in\s+(.*)$/.exec(commandText);
                        if (!commandMatch) {
                            throw new SyntaxError("模板编译错误：foreach 格式不合法，应为 foreach item in object：\r\n在“" + commandText + "”附近");
                        }
                        compiledCode += 'Object.each(' + commandMatch[5] + ',function(' + commandMatch[2] + ',' + (commandMatch[4] || '$key') + ',$target){\n';
                        commandsStack.push(commandName);
                        break;
                    case 'if':
                    case 'for':
                    case 'while':
                    case 'switch':
                    case 'with':
                        // 追加括号。
                        commandText = commandName + '(' + commandText.substr(commandMatch[0].length) + ')';

                        // 不需要 break 。
                    case 'function':
                        compiledCode += commandText + '{\n';
                        commandsStack.push(commandName);
                        break;
                    case 'else':
                        commandMatch = /^\s*else\s+if\b(.*)/.exec(commandText);
                        compiledCode += commandMatch ? '}else if(' + commandMatch[1] + ') {\n' : '}else{\n';
                        break;
                    case 'var':
                    case 'void':
                    case 'case':
                        compiledCode += commandText + '\n';
                        break;
                    case 'break':
                    case 'continue':
                        compiledCode += commandsStack[commandsStack.length - 1] === 'foreach' ? commandName.length === 5 ? 'return false\n' : 'return\n' : (commandText + '\n');
                        break;
                    default:
                        compiledCode += (/;\s*$/.test(commandText) ? commandText : ('$output+=' + commandText)) + '\n';
                }

            }

            // 更新下一次开始查找的位置。
            blockStart = blockEnd;

        }

        if (commandsStack.length) {
            throw new SyntaxError('模板编译错误：缺少 {/' + commandsStack[commandsStack.length - 1] + '}\r\n源码：' + compiledCode);
        }

        // 处理最后一个 } 之后的内容。
        compiledCode += getSourceAsPlainText(blockEnd + 1, tplSource.length) + 'return $output';

        try {
            return new Function("$data", compiledCode);
        } catch (e) {
            throw new SyntaxError('模板编译错误：' + e.message + '\r\n源码：' + compiledCode);
        }

    }

};
