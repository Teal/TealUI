// /**
//  * @fileOverview 经典 ASP 语法的模板引擎。
//  * @author xuld@vip.qq.com
//  */

// /**
//  * 存储所有模板编译缓存。
//  */
// var _cache: { [key: string]: ((data: any) => string) } = { __proto__: null };

// /**
//  * 设置代码段的开始标记。
//  */
// export var tplStart = "<%";

// /**
//  * 设置代码段的结束标记。
//  */
// export var tplEnd = "%>";

// /**
//  * 编译指定的模板。
//  * @param tplSource 要编译的模板文本。
//  * @param cacheKey 表示当前模板的缓存键，相同缓存键的模板可避免被重复编译以提高解析速度。
//  * @example AspTpl.compile("<%if($data === 1) { %>OK<% } %>", 1) // function($data){ ... }
//  * @desc
//  * #### 模板语法介绍
//  * 模板中可以直接书写普通文本，并通过 `<%` 和 `%>` 插入 JavaScript 代码段，如：
//  * ```
//  * hello <%if (a > 0) %> world <% } %>
//  * ```
//  * 其中 `<%if (a > 0) %>` 和 `<% } %>` 是模板内部使用的逻辑表达式，用于控制模板的输出内容。
//  *
//  * 如果需要将代码段的返回值放入模板，需要使用 `<%= ... %>` 语法，如：
//  * hello <%= true ? " world" : "" %>
//  *
//  */
// export function compile(tplSource: string, cacheKey?: string) {
//     const func = _cache[cacheKey = cacheKey || tplSource];
//     if (func) return func;

//     // 存储已编译的代码段。
//     let compiledCode = 'var $output="";with($data||{}){\n';

//     // 下一个 <% 的开始位置。
//     let blockStart = 0;

//     // 上一个 %> 的结束位置。
//     let blockEnd = 0;

//     // 每次处理一个 <% 的部分。
//     while ((blockStart = tplSource.indexOf(tplStart, blockStart)) >= 0) {

//         // 处理 <% 之前的内容。
//         compiledCode += getSourceAsPlainText(blockEnd, blockStart);

//         // 从  blockStart 处搜索 %>
//         blockEnd = tplSource.indexOf(tplEnd, blockStart + 2);
//         if (blockEnd == -1) {
//             blockEnd = tplSource.length;
//         }

//         // 处理 <%%> 之间的内容。
//         let commandText = getSource(blockStart + tplStart.length, blockEnd);
//         if (/^=/.test(commandText)) {
//             commandText = "$output +" + commandText;
//         }
//         compiledCode += commandText + '\n';

//         // 更新下一次开始查找的位置。
//         blockStart = blockEnd += tplEnd.length;

//     }

//     // 处理最后一个 } 之后的内容。
//     compiledCode += getSourceAsPlainText(blockEnd, tplSource.length) + '};return $output';

//     try {
//         return _cache[cacheKey] = new Function("$data", compiledCode) as ((data: any) => string);
//     } catch (e) {
//         throw new SyntaxError('模板编译错误：' + e.message + '\r\n源码：' + compiledCode);
//     }

//     // 获取模板指定部分并解析为字符串。
//     function getSourceAsPlainText(start: number, end: number) {
//         return '$output+="' + getSource(start, end).replace(/[\r\n\"\\]/g, specialChar => ({
//             '"': '\\"',
//             '\n': '\\n',
//             '\r': '\\r',
//             '\\': '\\\\'
//         })[specialChar]) + '"\n';
//     }

//     // 获取模板指定部分。
//     function getSource(start: number, end: number) {
//         return tplSource.substring(start, end);
//     }

// }

// /**
//  * 使用指定的数据解析模板，并返回生成的内容。
//  * @param tplSource 要解析的模板文本。
//  * @param data 传递给模板的数据对象。在模板中使用 $data 变量接收此参数。
//  * @param cacheKey = tplSource 表示当前模板的键，主要用于缓存。
//  * @returns 返回解析后的模板内容。 
//  * @example AspTpl.parse("<%if(this === 1) { %>OK<% } %>", 1) // "OK"
//  */
// export default function parse(tplSource: string, data: any, cacheKey?: string) {
//     return compile(tplSource, cacheKey).call(data, data);
// }
