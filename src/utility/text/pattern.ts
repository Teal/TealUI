/**
 * @fileOverview 模式
 * @author xuld@vip.qq.com
 */

/**
 * 表示一个模式，如通配符、正则表达式、函数或以上模式组成的数组。
 * @remark
 * 模式可以用来匹配和替换路径。模式具体可以是以下任意一种形式：
 * - **通配符**：语法同 [`.gitignore`](https://git-scm.com/docs/gitignore)。可以使用以下通配符：
 *    - `**`:匹配任意个字符。
 *    - `*`: 匹配任意个 `/` 以外的字符。
 *    - `?`: 匹配一个 `/` 以外的字符。
 *    - `/`: 匹配路径分隔符。以 `/` 开头表示必须匹配根目录。以 `/` 结尾表示必须匹配目录。
 *    - `\`: 表示转义字符。
 *    - `[...]`: 匹配括号中的任一个字符。
 *    - 前缀的 `#`: 表示注释。
 *    - 前缀的 `!`: 表示对上一个匹配项添加例外。注意如果匹配了父文件夹，出于性能考虑，无法为其中的子文件添加例外。
 * - **正则表达式**：如 `/^.*\.jpg/i`。
 * - **函数**：函数接收一个参数 *path* 表示要测试的路径，如果匹配函数应返回 true，否则返回 false。函数原型为：`(path: string) => boolean`，如 `function(path) { return path.startsWith("abc/"); }`。
 * - **数组**：其它模式的组合，如果匹配数组中的任一模式，则表示匹配整个模式。
 */
export type Pattern = string | RegExp | ((name: string) => boolean) | Array<string | RegExp | ((name: string) => boolean)>;

/**
 * 表示一个已编译的匹配函数。
 */
export interface CompiledPattern {

    /**
     * 测试指定的路径是否匹配。
     * @param path 要测试的路径。路径应使用 `/` 作为分隔符，且不能以 `/` 开头。
     * @returns 如果匹配则返回 true，否则返回 false。
     */
    (path: string): boolean;

    /**
     * 测试指定的路径是否匹配，并替换为新路径。
     * @param path 要测试的路径。路径应使用 `/` 作为分隔符，且不能以 `/` 开头。
     * @param target 要替换的目标路径。其中 '$0', '$1'... 会被替换为捕获的内容。
     * @returns 如果匹配则返回 *target*，其中 '$0', '$1'... 会被替换为捕获的内容，否则返回 null。
     */
    (path: string, target: string): string;

    /**
     * 当前匹配器的内部参数列表。
     */
    _args?: any[];

}

/**
 * 编译指定的模式列表并返回一个匹配函数。
 * @param patterns 要编译的模式列表。
 * @returns 返回已编译的匹配函数。
 * @example compilePatterns("*.ts")("a.ts") // 返回 true
 * @example compilePatterns("*.ts")("a.ts", "$1.js") // 返回 "a.js"
 */
export function compilePatterns(patterns: Pattern[]) {
    let filterFuncBody = [];
    let args = [];

    // 解析每个筛选器。
    for (let i = 0; i < patterns.length; i++) {
        let pattern = patterns[i];

        // "*.sources*"
        if (typeof pattern === "string") {

            // 忽略空行。
            pattern = (pattern as string).trim();
            if (!pattern) continue;

            switch ((pattern as string).charCodeAt(0)) {

                // 忽略 # 开头的行。
                case 35/*#*/:
                    continue;

                // ! 为上一个匹配项增加例外。
                case 33/*!*/:
                    if (filterFuncBody.length) {
                        filterFuncBody[filterFuncBody.length - 1] = filterFuncBody[filterFuncBody.length - 1].replace(/if\((.*)\)return/, `if(($1)&&!A[${args.length}].test(path))return`);
                        args[args.length] = toRegExp((pattern as string).replace(/^!\s*/, ""));
                    }
                    continue;

                // 编码普通通配符。
                default:
                    pattern = toRegExp(pattern as string);
                    break;
            }
        }

        // /.../
        if (pattern instanceof RegExp) {
            filterFuncBody.push(`if(target!=null?T=A[${args.length}].exec(path):A[${args.length}].test(path))return target==null||(L=path.substring(0,T.index),R=target.replace(/\\\$(\\d+)/g,function(_,i){return T[i]==null?_:T[i]}),L.length&&L.charCodeAt(L.length-1)!==47&&R.charCodeAt(0)!==47?L+"/"+R:L+R);`);
            args[args.length] = pattern;
            continue;
        }

        // function(){ ... }
        if (typeof pattern === "function") {
            filterFuncBody.push(`if(A[${args.length}].call(this,path))return target==null||target.replace(/\$0/g,path);`);
            args[args.length] = pattern;
            continue;
        }

        // 数组：串联继续解析。
        if (Array.isArray(pattern)) {
            patterns = patterns.concat(pattern);
            continue;
        }

    }

    // 编译函数。
    let result = new Function("path", "target", `var A=arguments.callee._args,T,L,R;${filterFuncBody.join("")}return target==null?false:null;`) as CompiledPattern;
    result._args = args;
    return result;

    /**
     * 将指定的模式字符串转为等效的正则表达式。
     * @param pattern 要转换的模式字符串。
     * @return 返回已编译的正则表达式。
     */
    function toRegExp(pattern: string) {
        let prefix = "(?:^|\\/)";
        let postfix = "(?:\\/|$)";
        pattern = pattern.replace(/\\.?|\*\*\/?|\[.+\]|[-+.^$|{}()\[\]\?\*\/]/g, (all: string, index: number) => {
            switch (all.charCodeAt(0)) {
                case 47/*/*/:
                    // 前缀 / 表示当前路径必须匹配跟路径。
                    if (index === 0) {
                        prefix = "";
                        return "^";
                    }
                    // 后缀 / 表示当前路径必须匹配文件夹。
                    if (index === pattern.length - 1) {
                        postfix = "";
                        return "\\/";
                    }
                    // 普通字符。
                    return "\\" + all;
                case 42/***/:
                    return all.length > 2 ? "((?:.*\/)?)" : all.length > 1 ? "(.*)" : "([^/]*)";
                case 63/*?*/:
                    return "([^/])";
                case 92/*\*/:
                    return all.length > 1 ? escapeRegExp(all.charAt(1)) : " ";
                case 91/*[*/:
                    return all.length > 2 ? '[' + escapeRegExp(all.substring(1, all.length - 1)) + ']' : "\\" + all;
                default:
                    return "\\" + all;
            }
        });
        return new RegExp(prefix + pattern + postfix, "i");
    }

    /**
     * 编码模式里的正则表达式特殊字符。
     * @param pattern 要编码的模式字符串。
     * @return 返回已编码的模式字符串。
     */
    function escapeRegExp(pattern) {
        return pattern.replace(/[-+.^$|{}()\[\]\?\*\/\\]/g, "\\$&");
    }

}
