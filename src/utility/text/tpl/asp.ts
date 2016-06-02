// #todo


// #region Tpl

/**
 * 表示一个 JavaScript 模板解析器。
 */
var Tpl = {

    _compiled: {},

    /**
     * 编译指定的模板。
     * @param {String} tplSource 要编译的模板文本。
     * @param {String} [cacheKey = @tplSource] 表示当前模板的缓存键，相同缓存键的模板可避免被重复编译以提高解析速度。
	 * @example Tpl.compile("#if $data === 1#OK#}#", 1) // function($data){ ... }
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
     * @param {String} [cacheKey = tplSource] 表示当前模板的键，主要用于缓存。
     * @returns {String} 返回解析后的模板内容。 
     * @example Tpl.parse("{if $data === 1}OK{/if}", 1) // "OK"
     * @remark 
     * #### 模板语法介绍
     * 
     * 在模板中，可以直接书写最终生成的文本内容，并通过 { 和 } 在文本中插入逻辑代码。
     * 如：
     *      hello {if a > 0} world {/if}
     * 其中 {if a > 0} 和 {end} 是模板内部使用的逻辑表达式，用于控制模板的输出内容。
     * 
     * ##### 常量
     * 模板内任意字符串都会原样输出，模板引擎只解析 {} 内的数据。模板内使用 {{ 代替 { 本身，使用 }} 代替 } 本身。
     * 
     * ##### if 语句
     * 
     *      {if 表达式} 
     *          这里是 if 成功输出的文本 
     *      {else if 表达式}
     *          这里是 else if 成功输出的文本 
     *      {else}
     *          这里是 else 成功输出的文本 
     *      {/if}
     * 
     * ##### for 语句
     *      {for(var key in obj)}
     *          {循环输出的内容}
     *      {end}
     * 
     * 
     *      {for(var i = 0; i < arr.length; i++)}
     *          {循环输出的内容}
     *      {/for}
     * 
     * ##### while 语句
     *      {while 表达式}
     *          {循环输出的内容}
     *      {/while}
     * 
     * ##### continue/break 语句
     * 在循环时可使用此类语句终止循环。
     *      {continue}
     * 
     * 
     *      {break}
     * 
     * ##### function 语句
     *      {function fn(a, b)}
     *          {函数主体}
     *      {/function}
     * 
     * ##### var 语句
     *      {var a = 1, b = 2}
     * 
     * ##### void 语句
     * `void` 语句用于执行代码，但不会在模板字符串内添加任何内容。
     * 
     *      {void alert("alert")}
     * 
     * ##### foreach 语句
     *    为了简化循环操作，模板引擎提供了快速遍历类数组和对象的方式。
     * 
     *      {foreach item in obj}
     *          {循环输出的内容}
     *      {/foreach}
     * 
     * 
     *      {foreach item, index in obj}
     *          {循环输出的内容}
     *      {/foreach}
     * 
     *    foreach 语句同时支持类数组和对象，item 都表示遍历的值，index 表示数组索引或对象键。
     *    在 foreach 语句中，可以使用 $target 获取当前遍历的对象，使用 $key 获取循环变量值。
     *    存在嵌套 foreach 时，它们分别表示最近的循环对应的值，如需跨语句，可使用变量保存。
     *    在 foreach 语句中，可以使用 {break} 和 {continue} 控制流程。
     *      {foreach item in obj}
     *          {if $key == 0}
     *              {continue}
     *          {/if}
     *          {foreach item2 in item}
     *              {item2}
     *          {/foreach}
     *      {/foreach}
     * 
     * ##### 内置宏变量
     * 在模板内部可以直接使用一些内置宏变量。
     * 
     * - `$data`: 被解析的数据。
     * - `$key`: foreach 语句中获取最近的循环索引或键。
     * - `$target`: foreach 语句中获取最近的循环对象。
     * 
     */
    parse: function (tplSource, data, scope, cacheKey) {
        return Tpl.compile(tplSource, cacheKey).call(scope, data);
    },

    _compileCore: function (tplSource) {

        // 存储已编译的代码段。
        var compiledCode = 'var $output="";with($data||{}){\n',

            // 下一个 { 的开始位置。
            blockStart = -2,

            // 上一个 } 的结束位置。
            blockEnd = -2;

        // 获取模板指定部分。
        function getSource(start, end) {
            return tplSource.substring(start, end);
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

        // 每次处理一个 <% 的部分。
        while ((blockStart = tplSource.indexOf('<%', blockStart + 2)) >= 0) {

            // 处理 <% 之前的内容。
            compiledCode += getSourceAsPlainText(blockEnd + 2, blockStart);

            // 从  blockStart 处搜索 %>
            blockEnd = tplSource.indexOf('%>', blockStart + 2);
            if (blockEnd == -1) {
                blockEnd = tplSource.length;
            }

            // 处理 <%%> 之间的内容。
            commandText = getSource(blockStart + 2, blockEnd);
            if (/^=/.test(commandText)) {
                commandText = "$output +" + commandText;
            }
            compiledCode += commandText + '\n';

            // 更新下一次开始查找的位置。
            blockStart = blockEnd + 2;

        }

        // 处理最后一个 } 之后的内容。
        compiledCode += getSourceAsPlainText(blockEnd + 2, tplSource.length) + '};return $output';

        try {
            return new Function("$data", compiledCode);
        } catch (e) {
            throw new SyntaxError('模板编译错误：' + e.message + '\r\n源码：' + compiledCode);
        }

    }

};

// #endregion
