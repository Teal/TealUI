/**
 * @fileOverview 简单但完整的模板引擎。
 */

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
