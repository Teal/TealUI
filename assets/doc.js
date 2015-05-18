/**
 * @fileOverview 本文件提供仅供文档演示的相关代码，不是组件的一部分。
 * @author xuld
 */

/**
 * 提供文档操作的相关 API。
 */
var Doc = Doc || {};

// #region 配置

/**
 * 全局配置。
 */
Doc.Configs = {

    /**
     * 当前项目的版本。
     */
    version: '3.0',

    /**
     * 当前项目的基础路径。
     */
    basePath: '../',

    /**
	 * 用于处理所有前端请求的服务地址。
	 */
    servicePath: 'http://localhost:5373/tools/customize/service/api.njs',

    /**
     * 所有可用文件夹。
     */
    folders: {

        /**
         * 存放开发系统文件的文件夹。
         */
        assets: {
            path: 'assets',
            pageName: '工具',
            pageTitle: '系统工具',
            pageDescription: '提供内部开发使用的工具'
        },

        /**
         * 存放开发系统文件的文件夹。
         */
        tools: {
            path: 'tools',
            pageName: '工具',
            pageTitle: '开发者工具',
            pageDescription: 'TealUI 提供了组件定制、代码压缩、合并等常用工具'
        },

        /**
         * 存放文档文件的文件夹。
         */
        docs: {
            path: 'docs',
            pageName: '文档',
            pageTitle: '如何开始',
            pageDescription: '快速上手组件'
        },

        /**
         * 存放文档文件的文件夹。
         */
        demos: {
            path: 'src',
            pageName: '组件',
            pageTitle: '组件列表',
            pageDescription: 'TealUI 提供了 200 多个常用组件，满足常用需求。每个组件依赖性小，多数可以独立使用。'
        },

        /**
         * 存放源文件的文件夹。
         */
        sources: {
            path: 'src',
            pageName: '源码',
            pageTitle: '源码',
            pageDescription: '浏览源码文件夹'
        }

    },

    /**
	 * 存放列表路径的地址。
	 */
    listsPath: 'assets/lists',

    /**
	 * 存放数据字段的 meta 节点。
	 */
    moduleInfo: 'module-info',

    /**
	 * 整个项目标配使用的编码。
	 */
    encoding: 'utf-8'

    ///**
    // * 组件访问历史最大值。
    // */
    //maxModuleHistory: 10,

    ///**
    // * 合法的状态值。
    // */
    //status: {
    //    'stable': '稳定版',
    //    'done': '已完成',
    //    'beta': '测试版',
    //    'todo': '计划中',
    //    'doing': '开发中',
    //    'deprecated': '已废弃'
    //},

    ///**
    // * 特性列表。
    // */
    //attributes: {
    //    'mobile': '移动端',
    //    'pc': 'PC 端',
    //    'ie8': '兼容IE8+',
    //    'ie6': '兼容IE6+'
    //}

};

// #endregion

// #region 模块解析

Doc.ModuleInfo = {

    /**
     * 获取当前页面指定的控件的信息。
     */
    parse: function (value) {
        var r = {};
        value = value.split(/,\s*/);
        for (var i = 0; i < value.length; i++) {
            var t = value[i],
			    s = t.indexOf('=');
            r[t.substr(0, s)] = t.substr(s + 1);
        }
        return r;
    },

    /**
     * 获取当前页面指定的控件的信息。
     */
    stringify: function (value) {
        var r = [];
        for (var key in value) {
            r.push(key + '=' + value[key]);
        }
        return r.join(', ');
    }

};

// #endregion

// #region 工具函数

/**
 * 提供底层工具函数。
 */
Doc.Utility = {

    /**
     * 格式化指定的字符串。
     * @param {String} formatString 要格式化的字符串。格式化的方式见备注。
     * @param {Object} ... 格式化参数。
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
    formatString: function (formatString) {
        var args = arguments;
        return formatString ? formatString.replace(/\{\{|\{(\w+)\}|\}\}/g, function (matched, argName) {
            return (argName ? (matched = +argName + 1) ? args[matched] : args[1][argName] : matched[0]) || '';
        }) : '';
    },

    /**
     * 删除公共的缩进部分。
     */
    removeLeadingWhiteSpaces: function (value) {
        value = value.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
        var space = /^\s+/.exec(value);
        if (space) {
            space = space[0];
            value = value.split(/[\r\n]/);
            for (var i = value.length - 1; i >= 0; i--) {
                value[i] = value[i].replace(space, "");
            }
            value = value.join('\r\n');
        }
        return value;
    },

    /**
     * 编码 HTML 特殊字符。
     * @param {String} value 要编码的字符串。
     * @return {String} 返回已编码的字符串。
     * @remark 此函数主要将 & < > ' " 分别编码成 &amp; &lt; &gt; &#39; &quot; 。
     */
    encodeHTML: (function () {

        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '\'': '&#39;',
            '\"': '&quot;'
        };

        function replaceMap(v) {
            return map[v];
        }

        return function (value) {
            return value.replace(/[&<>\'\"]/g, replaceMap);
        };
    })(),

    /**
     * 获取一个函数内的源码。
     */
    getFunctionSource: function (fn) {
        return Doc.Utils.removeLeadingWhiteSpaces(fn.toString().replace(/^function\s+[^(]*\s*\(.*?\)\s*\{[\r\n]*/, "").replace(/\s*\}\s*$/, "").replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
            return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
        }));
    }

};

// #endregion

// #region 代码高亮

/**
 * 代码高亮模块。
 */
Doc.SyntaxHighligher = (function () {
    // Copyright (C) 2012 xuld
    //
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    //
    //      http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.

    /**
     * @namespace SyntaxHighligher
     */
    var SH = {

        /**
         * 所有可用的刷子。
         */
        brushes: {
            none: function (sourceCode, position) {
                return [position, 'plain'];
            }
        },

        /**
         * 创建一个用于指定规则的语法刷子。
         * @param {Array} stylePatterns 匹配的正则列表，格式为：。
         * [[css样式名1, 正则1, 可选的头字符], [css样式名2, 正则2], ...]
         * 其中，可选的头字符是这个匹配格式的简化字符，如果源码以这个字符里的任何字符打头，表示自动匹配这个正则。
         * @return {Function} 返回一个刷子函数。刷子函数的输入为：
         *
         * - sourceCode {String} 要处理的源码。
         * - position {Number} 要开始处理的位置。
         *
         * 返回值为一个数组，格式为。
         * [位置1, 样式1, 位置2, 样式2, ..., 位置n-1, 样式n-1]
         *
         * 表示源码中， 位置n-1 到 位置n 之间应用样式n-1
         */
        createBrush: function (stylePatterns) {
            var shortcuts = {},
                tokenizer, stylePatternsStart = 0,
                stylePatternsEnd = stylePatterns.length;
            (function () {
                var allRegexs = [],
                    i, stylePattern, shortcutChars, c;
                for (i = 0; i < stylePatternsEnd; i++) {
                    stylePattern = stylePatterns[i];
                    if ((shortcutChars = stylePattern[2])) {
                        for (c = shortcutChars.length; --c >= 0;) {
                            shortcuts[shortcutChars.charAt(c)] = stylePattern;
                        }

                        if (i == stylePatternsStart) stylePatternsStart++;
                    }
                    allRegexs.push(stylePattern[1]);
                }
                allRegexs.push(/[\0-\uffff]/);
                tokenizer = combinePrefixPatterns(allRegexs);
            })();

            function decorate(sourceCode, position) {
                /** Even entries are positions in source in ascending order.  Odd enties
                 * are style markers (e.g., COMMENT) that run from that position until
                 * the end.
                 * @type {Array<number/string>}
                 */
                var decorations = [position, 'plain'],
                    tokens = sourceCode.match(tokenizer) || [],
                    pos = 0,
                    // index into sourceCode
                    styleCache = {},
                    ti = 0,
                    nTokens = tokens.length,
                    token, style, match, isEmbedded, stylePattern;

                while (ti < nTokens) {
                    token = tokens[ti++];

                    if (styleCache.hasOwnProperty(token)) {
                        style = styleCache[token];
                        isEmbedded = false;
                    } else {

                        // 测试 shortcuts。
                        stylePattern = shortcuts[token.charAt(0)];
                        if (stylePattern) {
                            match = token.match(stylePattern[1]);
                            style = stylePattern[0];
                        } else {
                            for (var i = stylePatternsStart; i < stylePatternsEnd; ++i) {
                                stylePattern = stylePatterns[i];
                                match = token.match(stylePattern[1]);
                                if (match) {
                                    style = stylePattern[0];
                                    break;
                                }
                            }

                            if (!match) { // make sure that we make progress
                                style = 'plain';
                            }
                        }

                        if (style in SH.brushes) {
                            if (style === 'none') {
                                style = SH.guessLanguage(match[1]);
                            }
                            style = SH.brushes[style];
                        }

                        isEmbedded = typeof style === 'function';

                        if (!isEmbedded) {
                            styleCache[token] = style;
                        }
                    }

                    if (isEmbedded) {
                        // Treat group 1 as an embedded block of source code.
                        var embeddedSource = match[1];
                        var embeddedSourceStart = token.indexOf(embeddedSource);
                        var embeddedSourceEnd = embeddedSourceStart + embeddedSource.length;
                        if (match[2]) {
                            // If embeddedSource can be blank, then it would match at the
                            // beginning which would cause us to infinitely recurse on the
                            // entire token, so we catch the right context in match[2].
                            embeddedSourceEnd = token.length - match[2].length;
                            embeddedSourceStart = embeddedSourceEnd - embeddedSource.length;
                        }

                        // Decorate the left of the embedded source
                        appendDecorations(position + pos, token.substring(0, embeddedSourceStart), decorate, decorations);
                        // Decorate the embedded source
                        appendDecorations(position + pos + embeddedSourceStart, embeddedSource, style, decorations);
                        // Decorate the right of the embedded section
                        appendDecorations(position + pos + embeddedSourceEnd, token.substring(embeddedSourceEnd), decorate, decorations);
                    } else {
                        decorations.push(position + pos, style);
                    }
                    pos += token.length;
                }


                removeEmptyAndNestedDecorations(decorations);
                return decorations;
            };

            return decorate;
        },

        /**
         * 根据源码猜测对应的刷子。
         * @param {String} sourceCode 需要高亮的源码。
         * @return {String} 返回一个语言名。
         */
        guessLanguage: function (sourceCode) {
            // Treat it as markup if the first non whitespace character is a < and
            // the last non-whitespace character is a >.
            return /^\s*</.test(sourceCode) ? 'html' : /\w\s*\{/.test(sourceCode) ? 'css' : /=|\w\s*\w|\w\(|\)\./.test(sourceCode) ? 'js' : 'default';
        },

        /**
         * 搜索用于处理指定语言的刷子。
         * @param {String} language 要查找的语言名。
         * @return {Function} 返回一个刷子，用于高亮指定的源码。
         */
        findBrush: function (language) {
            return SH.brushes[language] || SH.brushes.none;
        },

        /**
         * 注册一个语言的刷子。
         * @param {String} language 要注册的语言名。
         * @param {Array} stylePatterns 匹配的正则列表。见 {@link SyntaxHighligher.createBrush}
         * @return {Function} 返回一个刷子，用于高亮指定的源码。
         */
        register: function (language, stylePatterns) {
            language = language.split(' ');
            stylePatterns = SH.createBrush(stylePatterns);
            for (var i = 0; i < language.length; i++) {
                SH.brushes[language[i]] = stylePatterns;
            }
        }

    };

    // CAVEAT: this does not properly handle the case where a regular
    // expression immediately follows another since a regular expression may
    // have flags for case-sensitivity and the like.  Having regexp tokens
    // adjacent is not valid in any language I'm aware of, so I'm punting.
    // TODO: maybe style special characters inside a regexp as punctuation.

    /**
     * Given a group of {@link RegExp}s, returns a {@code RegExp} that globally
     * matches the union of the sets of strings matched by the input RegExp.
     * Since it matches globally, if the input strings have a start-of-input
     * anchor (/^.../), it is ignored for the purposes of unioning.
     * @param {Array.<RegExp>} regexs non multiline, non-global regexs.
     * @return {RegExp} a global regex.
     */
    function combinePrefixPatterns(regexs) {
        var capturedGroupIndex = 0;

        var needToFoldCase = false;
        var ignoreCase = false;
        for (var i = 0, n = regexs.length; i < n; ++i) {
            var regex = regexs[i];
            if (regex.ignoreCase) {
                ignoreCase = true;
            } else if (/[a-z]/i.test(regex.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ''))) {
                needToFoldCase = true;
                ignoreCase = false;
                break;
            }
        }

        function allowAnywhereFoldCaseAndRenumberGroups(regex) {
            // Split into character sets, escape sequences, punctuation strings
            // like ('(', '(?:', ')', '^'), and runs of characters that do not
            // include any of the above.
            var parts = regex.source.match(
            new RegExp('(?:' + '\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]' // a character set
            +
            '|\\\\u[A-Fa-f0-9]{4}' // a unicode escape
            +
            '|\\\\x[A-Fa-f0-9]{2}' // a hex escape
            +
            '|\\\\[0-9]+' // a back-reference or octal escape
            +
            '|\\\\[^ux0-9]' // other escape sequence
            +
            '|\\(\\?[:!=]' // start of a non-capturing group
            +
            '|[\\(\\)\\^]' // start/emd of a group, or line start
            +
            '|[^\\x5B\\x5C\\(\\)\\^]+' // run of other characters
            +
            ')', 'g'));
            var n = parts.length;

            // Maps captured group numbers to the number they will occupy in
            // the output or to -1 if that has not been determined, or to
            // undefined if they need not be capturing in the output.
            var capturedGroups = [];

            // Walk over and identify back references to build the capturedGroups
            // mapping.
            for (var i = 0, groupIndex = 0; i < n; ++i) {
                var p = parts[i];
                if (p === '(') {
                    // groups are 1-indexed, so max group index is count of '('
                    ++groupIndex;
                } else if ('\\' === p.charAt(0)) {
                    var decimalValue = +p.substring(1);
                    if (decimalValue && decimalValue <= groupIndex) {
                        capturedGroups[decimalValue] = -1;
                    }
                }
            }

            // Renumber groups and reduce capturing groups to non-capturing groups
            // where possible.
            for (var i = 1; i < capturedGroups.length; ++i) {
                if (-1 === capturedGroups[i]) {
                    capturedGroups[i] = ++capturedGroupIndex;
                }
            }
            for (var i = 0, groupIndex = 0; i < n; ++i) {
                var p = parts[i];
                if (p === '(') {
                    ++groupIndex;
                    if (capturedGroups[groupIndex] === undefined) {
                        parts[i] = '(?:';
                    }
                } else if ('\\' === p.charAt(0)) {
                    var decimalValue = +p.substring(1);
                    if (decimalValue && decimalValue <= groupIndex) {
                        parts[i] = '\\' + capturedGroups[groupIndex];
                    }
                }
            }

            // Remove any prefix anchors so that the output will match anywhere.
            // ^^ really does mean an anchored match though.
            for (var i = 0, groupIndex = 0; i < n; ++i) {
                if ('^' === parts[i] && '^' !== parts[i + 1]) {
                    parts[i] = '';
                }
            }

            // Expand letters to groups to handle mixing of case-sensitive and
            // case-insensitive patterns if necessary.
            if (regex.ignoreCase && needToFoldCase) {
                for (var i = 0; i < n; ++i) {
                    var p = parts[i];
                    var ch0 = p.charAt(0);
                    if (p.length >= 2 && ch0 === '[') {
                        parts[i] = caseFoldCharset(p);
                    } else if (ch0 !== '\\') {
                        // TODO: handle letters in numeric escapes.
                        parts[i] = p.replace(/[a-zA-Z]/g, function (ch) {
                            var cc = ch.charCodeAt(0);
                            return '[' + String.fromCharCode(cc & ~32, cc | 32) + ']';
                        });
                    }
                }
            }

            return parts.join('');
        }

        var rewritten = [];
        for (var i = 0, n = regexs.length; i < n; ++i) {
            var regex = regexs[i];
            if (regex.global || regex.multiline) {
                throw new Error('' + regex);
            }
            rewritten.push('(?:' + allowAnywhereFoldCaseAndRenumberGroups(regex) + ')');
        }

        return new RegExp(rewritten.join('|'), ignoreCase ? 'gi' : 'g');
    }

    function encodeEscape(charCode) {
        if (charCode < 0x20) {
            return (charCode < 0x10 ? '\\x0' : '\\x') + charCode.toString(16);
        }
        var ch = String.fromCharCode(charCode);
        if (ch === '\\' || ch === '-' || ch === '[' || ch === ']') {
            ch = '\\' + ch;
        }
        return ch;
    }

    var escapeCharToCodeUnit = {
        'b': 8,
        't': 9,
        'n': 0xa,
        'v': 0xb,
        'f': 0xc,
        'r': 0xd
    };

    function decodeEscape(charsetPart) {
        var cc0 = charsetPart.charCodeAt(0);
        if (cc0 !== 92 /* \\ */) {
            return cc0;
        }
        var c1 = charsetPart.charAt(1);
        cc0 = escapeCharToCodeUnit[c1];
        if (cc0) {
            return cc0;
        } else if ('0' <= c1 && c1 <= '7') {
            return parseInt(charsetPart.substring(1), 8);
        } else if (c1 === 'u' || c1 === 'x') {
            return parseInt(charsetPart.substring(2), 16);
        } else {
            return charsetPart.charCodeAt(1);
        }
    }

    function caseFoldCharset(charSet) {
        var charsetParts = charSet.substring(1, charSet.length - 1).match(
        new RegExp('\\\\u[0-9A-Fa-f]{4}' + '|\\\\x[0-9A-Fa-f]{2}' + '|\\\\[0-3][0-7]{0,2}' + '|\\\\[0-7]{1,2}' + '|\\\\[\\s\\S]' + '|-' + '|[^-\\\\]', 'g'));
        var groups = [];
        var ranges = [];
        var inverse = charsetParts[0] === '^';
        for (var i = inverse ? 1 : 0, n = charsetParts.length; i < n; ++i) {
            var p = charsetParts[i];
            if (/\\[bdsw]/i.test(p)) { // Don't muck with named groups.
                groups.push(p);
            } else {
                var start = decodeEscape(p);
                var end;
                if (i + 2 < n && '-' === charsetParts[i + 1]) {
                    end = decodeEscape(charsetParts[i + 2]);
                    i += 2;
                } else {
                    end = start;
                }
                ranges.push([start, end]);
                // If the range might intersect letters, then expand it.
                // This case handling is too simplistic.
                // It does not deal with non-latin case folding.
                // It works for latin source code identifiers though.
                if (!(end < 65 || start > 122)) {
                    if (!(end < 65 || start > 90)) {
                        ranges.push([Math.max(65, start) | 32, Math.min(end, 90) | 32]);
                    }
                    if (!(end < 97 || start > 122)) {
                        ranges.push([Math.max(97, start) & ~32, Math.min(end, 122) & ~32]);
                    }
                }
            }
        }

        // [[1, 10], [3, 4], [8, 12], [14, 14], [16, 16], [17, 17]]
        // -> [[1, 12], [14, 14], [16, 17]]
        ranges.sort(function (a, b) {
            return (a[0] - b[0]) || (b[1] - a[1]);
        });
        var consolidatedRanges = [];
        var lastRange = [NaN, NaN];
        for (var i = 0; i < ranges.length; ++i) {
            var range = ranges[i];
            if (range[0] <= lastRange[1] + 1) {
                lastRange[1] = Math.max(lastRange[1], range[1]);
            } else {
                consolidatedRanges.push(lastRange = range);
            }
        }

        var out = ['['];
        if (inverse) {
            out.push('^');
        }
        out.push.apply(out, groups);
        for (var i = 0; i < consolidatedRanges.length; ++i) {
            var range = consolidatedRanges[i];
            out.push(encodeEscape(range[0]));
            if (range[1] > range[0]) {
                if (range[1] + 1 > range[0]) {
                    out.push('-');
                }
                out.push(encodeEscape(range[1]));
            }
        }
        out.push(']');
        return out.join('');
    }

    /**
     * Apply the given language handler to sourceCode and add the resulting
     * decorations to out.
     * @param {number} basePos the index of sourceCode within the chunk of source
     *    whose decorations are already present on out.
     */
    function appendDecorations(basePos, sourceCode, brush, out) {
        if (sourceCode) {
            out.push.apply(out, brush(sourceCode, basePos));
        }
    }

    /**
     * 删除空的位置和相邻的位置。
     */
    function removeEmptyAndNestedDecorations(decorations) {
        for (var srcIndex = 0, destIndex = 0, length = decorations.length, lastPos, lastStyle; srcIndex < length;) {

            // 如果上一个长度和当前长度相同，或者上一个样式和现在的相同，则跳过。
            if (lastPos === decorations[srcIndex]) {
                srcIndex++;
                decorations[destIndex - 1] = lastStyle = decorations[srcIndex++];
            } else if (lastStyle === decorations[srcIndex + 1]) {
                srcIndex += 2;
            } else {
                decorations[destIndex++] = lastPos = decorations[srcIndex++];
                decorations[destIndex++] = lastStyle = decorations[srcIndex++];
            }
        };

        decorations.length = destIndex;

    }

    /**
     * 高亮单一的节点。
     * @param {Element} elem 要高亮的节点。
     * @param {String} [language] 语言本身。系统会自动根据源码猜测语言。
     */
    SH.one = function (pre, language) {

        // Extract tags, and convert the source code to plain text.
        var sourceAndSpans = extractSourceSpans(pre),
            specificLanuage = (pre.className.match(/\bsh-(\w+)(?!\S)/i) || [])[1];

        // 自动决定 language
        if (!language) {
            language = specificLanuage || SH.guessLanguage(sourceAndSpans.sourceCode);
        }

        if (!specificLanuage) {
            pre.className += ' doc-sh-' + language;
        }

        // Apply the appropriate language handler
        // Integrate the decorations and tags back into the source code,
        // modifying the sourceNode in place.
        recombineTagsAndDecorations(sourceAndSpans, SH.findBrush(language)(sourceAndSpans.sourceCode, 0));
    };

    /**
     * Split markup into a string of source code and an array mapping ranges in
     * that string to the text nodes in which they appear.
     *
     * <p>
     * The HTML DOM structure:</p>
     * <pre>
     * (Element   "p"
     *   (Element "b"
     *     (Text  "print "))       ; #1
     *   (Text    "'Hello '")      ; #2
     *   (Element "br")            ; #3
     *   (Text    "  + 'World';")) ; #4
     * </pre>
     * <p>
     * corresponds to the HTML
     * {@code <p><b>print </b>'Hello '<br>  + 'World';</p>}.</p>
     *
     * <p>
     * It will produce the output:</p>
     * <pre>
     * {
     *   sourceCode: "print 'Hello '\n  + 'World';",
     *   //              1         2
     *   //       012345678901234 5678901234567
     *   spans: [0, #1, 6, #2, 14, #3, 15, #4]
     * }
     * </pre>
     * <p>
     * where #1 is a reference to the {@code "print "} text node above, and so
     * on for the other text nodes.
     * </p>
     *
     * <p>
     * The {@code} spans array is an array of pairs.  Even elements are the start
     * indices of substrings, and odd elements are the text nodes (or BR elements)
     * that contain the text for those substrings.
     * Substrings continue until the next index or the end of the source.
     * </p>
     *
     * @param {Node} node an HTML DOM subtree containing source-code.
     * @return {Object} source code and the text nodes in which they occur.
     */
    function extractSourceSpans(node) {

        var chunks = [];
        var length = 0;
        var spans = [];
        var k = 0;

        var whitespace;
        if (node.currentStyle) {
            whitespace = node.currentStyle.whiteSpace;
        } else if (window.getComputedStyle) {
            whitespace = document.defaultView.getComputedStyle(node, null).getPropertyValue('white-space');
        }
        var isPreformatted = whitespace && 'pre' === whitespace.substring(0, 3);

        function walk(node) {
            switch (node.nodeType) {
                case 1:
                    // Element
                    for (var child = node.firstChild; child; child = child.nextSibling) {
                        walk(child);
                    }
                    var nodeName = node.nodeName;
                    if ('BR' === nodeName || 'LI' === nodeName) {
                        chunks[k] = '\n';
                        spans[k << 1] = length++;
                        spans[(k++ << 1) | 1] = node;
                    }
                    break;
                case 3:
                case 4:
                    // Text
                    var text = node.nodeValue;
                    if (text.length) {
                        if (isPreformatted) {
                            text = text.replace(/\r\n?/g, '\n'); // Normalize newlines.
                        } else {
                            text = text.replace(/[\r\n]+/g, '\r\n　');
                            text = text.replace(/[ \t]+/g, ' ');
                        }
                        // TODO: handle tabs here?
                        chunks[k] = text;
                        spans[k << 1] = length;
                        length += text.length;
                        spans[(k++ << 1) | 1] = node;
                    }
                    break;
            }
        }

        walk(node);

        return {
            sourceCode: chunks.join('').replace(/\n$/, ''),
            spans: spans
        };
    }

    /**
     * Breaks {@code job.sourceCode} around style boundaries in
     * {@code job.decorations} and modifies {@code job.sourceNode} in place.
     * @param {Object} job like <pre>{
     *    sourceCode: {string} source as plain text,
     *    spans: {Array.<number|Node>} alternating span start indices into source
     *       and the text node or element (e.g. {@code <BR>}) corresponding to that
     *       span.
     *    decorations: {Array.<number|string} an array of style classes preceded
     *       by the position at which they start in job.sourceCode in order
     * }</pre>
     * @private
     */
    function recombineTagsAndDecorations(sourceAndSpans, decorations) {
        //var isIE = /\bMSIE\b/.test(navigator.userAgent);
        var newlineRe = /\n/g;

        var source = sourceAndSpans.sourceCode;
        var sourceLength = source.length;
        // Index into source after the last code-unit recombined.
        var sourceIndex = 0;

        var spans = sourceAndSpans.spans;
        var nSpans = spans.length;
        // Index into spans after the last span which ends at or before sourceIndex.
        var spanIndex = 0;

        var decorations = decorations;
        var nDecorations = decorations.length;
        var decorationIndex = 0;

        var decoration = null;
        while (spanIndex < nSpans) {
            var spanStart = spans[spanIndex];
            var spanEnd = spans[spanIndex + 2] || sourceLength;

            var decStart = decorations[decorationIndex];
            var decEnd = decorations[decorationIndex + 2] || sourceLength;

            var end = Math.min(spanEnd, decEnd);

            var textNode = spans[spanIndex + 1];
            var styledText;
            if (textNode.nodeType !== 1 // Don't muck with <BR>s or <LI>s
                // Don't introduce spans around empty text nodes.
            &&
            (styledText = source.substring(sourceIndex, end))) {
                // This may seem bizarre, and it is.  Emitting LF on IE causes the
                // code to display with spaces instead of line breaks.
                // Emitting Windows standard issue linebreaks (CRLF) causes a blank
                // space to appear at the beginning of every line but the first.
                // Emitting an old Mac OS 9 line separator makes everything spiffy.
                // if (isIE) {
                // styledText = styledText.replace(newlineRe, '\r');
                // }
                textNode.nodeValue = styledText;
                var document = textNode.ownerDocument;
                var span = document.createElement('SPAN');
                span.className = 'doc-sh-' + decorations[decorationIndex + 1];
                var parentNode = textNode.parentNode;
                parentNode.replaceChild(span, textNode);
                span.appendChild(textNode);
                if (sourceIndex < spanEnd) { // Split off a text node.
                    spans[spanIndex + 1] = textNode
                    // TODO: Possibly optimize by using '' if there's no flicker.
                    =
                    document.createTextNode(source.substring(end, spanEnd));
                    parentNode.insertBefore(textNode, span.nextSibling);
                }
            }

            sourceIndex = end;

            if (sourceIndex >= spanEnd) {
                spanIndex += 2;
            }
            if (sourceIndex >= decEnd) {
                decorationIndex += 2;
            }
        }
    }

    // Keyword lists for various languages.
    // We use things that coerce to strings to make them compact when minified
    // and to defeat aggressive optimizers that fold large string constants.
    var FLOW_CONTROL_KEYWORDS = "break continue do else for if return while";
    var C_KEYWORDS = FLOW_CONTROL_KEYWORDS + " auto case char const default double enum extern float goto int long register short signed sizeof " + "static struct switch typedef union unsigned void volatile";
    var COMMON_KEYWORDS = [C_KEYWORDS, "catch class delete false import new operator private protected public this throw true try typeof"];
    var CPP_KEYWORDS = [COMMON_KEYWORDS, "alignof align_union asm axiom bool concept concept_map const_cast constexpr decltype dynamic_cast explicit export friend inline late_check mutable namespace nullptr reinterpret_cast static_assert static_cast template typeid typename using virtual where"];
    var JAVA_KEYWORDS = [COMMON_KEYWORDS, "abstract boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient"];
    var CSHARP_KEYWORDS = [JAVA_KEYWORDS, "as base by checked decimal delegate descending dynamic event fixed foreach from group implicit in interface internal into is lock object out override orderby params partial readonly ref sbyte sealed stackalloc string select uint ulong unchecked unsafe ushort var"];
    var JSCRIPT_KEYWORDS = [COMMON_KEYWORDS, "debugger eval export function get null set undefined var with Infinity NaN"];
    var PERL_KEYWORDS = "caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END";
    var PYTHON_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "and as assert class def del elif except exec finally from global import in is lambda nonlocal not or pass print raise try with yield False True None"];
    var RUBY_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "alias and begin case class def defined elsif end ensure false in module next nil not or redo rescue retry self super then true undef unless until when yield BEGIN END"];
    var SH_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "case done elif esac eval fi function in local set then until"];
    var ALL_KEYWORDS = [CPP_KEYWORDS, CSHARP_KEYWORDS, JSCRIPT_KEYWORDS, PERL_KEYWORDS + PYTHON_KEYWORDS, RUBY_KEYWORDS, SH_KEYWORDS];
    var C_TYPES = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/;

    /**
     * A set of tokens that can precede a regular expression literal in
     * javascript
     * http://web.archive.org/web/20070717142515/http://www.mozilla.org/js/language/js20/rationale/syntax.html
     * has the full list, but I've removed ones that might be problematic when
     * seen in languages that don't support regular expression literals.
     *
     * <p>Specifically, I've removed any keywords that can't precede a regexp
     * literal in a syntactically legal javascript program, and I've removed the
     * "in" keyword since it's not a keyword in many languages, and might be used
     * as a count of inches.
     *
     * <p>The link a above does not accurately describe EcmaScript rules since
     * it fails to distinguish between (a=++/b/i) and (a++/b/i) but it works
     * very well in practice.
     *
     * @private
     * @const
     */
    var REGEXP_PRECEDER_PATTERN = '(?:^^\\.?|[+-]|\\!|\\!=|\\!==|\\#|\\%|\\%=|&|&&|&&=|&=|\\(|\\*|\\*=|\\+=|\\,|\\-=|\\->|\\/|\\/=|:|::|\\;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\@|\\[|\\^|\\^=|\\^\\^|\\^\\^=|\\{|\\||\\|=|\\|\\||\\|\\|=|\\~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*';
    // token style names.  correspond to css classes
    /**
     * token style for a string literal
     * @const
     */
    var STRING = 'string';
    /**
     * token style for a keyword
     * @const
     */
    var KEYWORD = 'keyword';
    /**
     * token style for a comment
     * @const
     */
    var COMMENT = 'comment';
    /**
     * token style for a type
     * @const
     */
    var TYPE = 'type';
    /**
     * token style for a literal value.  e.g. 1, null, true.
     * @const
     */
    var LITERAL = 'literal';
    /**
     * token style for a punctuation string.
     * @const
     */
    var PUNCTUATION = 'punctuation';
    /**
     * token style for a punctuation string.
     * @const
     */
    var PLAIN = 'plain';

    /**
     * token style for an sgml tag.
     * @const
     */
    var TAG = 'tag';
    /**
     * token style for a markup declaration such as a DOCTYPE.
     * @const
     */
    var DECLARATION = 'declaration';
    /**
     * token style for embedded source.
     * @const
     */
    var SOURCE = 'source';
    /**
     * token style for an sgml attribute name.
     * @const
     */
    var ATTRIB_NAME = 'attrname';
    /**
     * token style for an sgml attribute value.
     * @const
     */
    var ATTRIB_VALUE = 'attrvalue';

    var register = SH.register;

    /** returns a function that produces a list of decorations from source text.
     *
     * This code treats ", ', and ` as string delimiters, and \ as a string
     * escape.  It does not recognize perl's qq() style strings.
     * It has no special handling for double delimiter escapes as in basic, or
     * the tripled delimiters used in python, but should work on those regardless
     * although in those cases a single string literal may be broken up into
     * multiple adjacent string literals.
     *
     * It recognizes C, C++, and shell style comments.
     *
     * @param {Object} options a set of optional parameters.
     * @return {function (Object)} a function that examines the source code
     *     in the input job and builds the decoration list.
     */
    var simpleLexer = SH.simpleLexer = function (options) {

        var shortcutStylePatterns = [], fallthroughStylePatterns = [];
        if (options.tripleQuotedStrings) {
            // '''multi-line-string''', 'single-line-string', and double-quoted
            shortcutStylePatterns.push(['string', /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/, '\'"']);
        } else if (options.multiLineStrings) {
            // 'multi-line-string', "multi-line-string"
            shortcutStylePatterns.push(['string', /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/, '\'"`']);
        } else {
            // 'single-line-string', "single-line-string"
            shortcutStylePatterns.push(['string', /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/, '"\'']);
        }
        if (options.verbatimStrings) {
            // verbatim-string-literal production from the C# grammar.  See issue 93.
            fallthroughStylePatterns.push(['string', /^@\"(?:[^\"]|\"\")*(?:\"|$)/]);
        }
        var hc = options.hashComments;
        if (hc) {
            if (options.cStyleComments) {
                if (hc > 1) {  // multiline hash comments
                    shortcutStylePatterns.push(['comment', /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, '#']);
                } else {
                    // Stop C preprocessor declarations at an unclosed open comment
                    shortcutStylePatterns.push(['comment', /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\r\n]*)/, '#']);
                }
                fallthroughStylePatterns.push(['string', /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/]);
            } else {
                shortcutStylePatterns.push(['comment', /^#[^\r\n]*/, '#']);
            }
        }
        if (options.cStyleComments) {
            fallthroughStylePatterns.push(['comment', /^\/\/[^\r\n]*/]);
            fallthroughStylePatterns.push(['comment', /^\/\*[\s\S]*?(?:\*\/|$)/]);
        }
        if (options.regexLiterals) {
            fallthroughStylePatterns.push(['regex', new RegExp('^' + REGEXP_PRECEDER_PATTERN + '(' + // A regular expression literal starts with a slash that is
            // not followed by * or / so that it is not confused with
            // comments.
            '/(?=[^/*])'
            // and then contains any number of raw characters,
            +
            '(?:[^/\\x5B\\x5C]'
            // escape sequences (\x5C),
            +
            '|\\x5C[\\s\\S]'
            // or non-nesting character sets (\x5B\x5D);
            +
            '|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+'
            // finally closed by a /.
            +
            '/' + ')')]);
        }

        var types = options.types;
        if (types) {
            fallthroughStylePatterns.push(['type', types]);
        }

        var keywords = ("" + options.keywords).replace(/^ | $/g, '');
        if (keywords.length) {
            fallthroughStylePatterns.push(['keyword', new RegExp('^(?:' + keywords.replace(/[\s,]+/g, '|') + ')\\b')]);
        }

        shortcutStylePatterns.push(['plain', /^\s+/, ' \r\n\t\xA0']);
        fallthroughStylePatterns.push(
        // TODO(mikesamuel): recognize non-latin letters and numerals in idents
        ['literal', /^@[a-z_$][a-z_$@0-9]*/i],
        ['type', /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/],
        ['plain', /^[a-z_$][a-z_$@0-9]*/i],
        ['literal', new RegExp(
             '^(?:'
             // A hex number
             + '0x[a-f0-9]+'
             // or an octal or decimal number,
             + '|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)'
             // possibly in scientific notation
             + '(?:e[+\\-]?\\d+)?'
             + ')'
             // with an optional modifier like UL for unsigned long
             + '[a-z]*', 'i'), '0123456789'],
        // Don't treat escaped quotes in bash as starting strings.  See issue 144.
        ['plain', /^\\[\s\S]?/],
        ['punctuation', /^.[^\s\w\.$@\'\"\`\/\#\\]*/]);

        return shortcutStylePatterns.concat(fallthroughStylePatterns);





    }

    register('default', simpleLexer({
        'keywords': ALL_KEYWORDS,
        'hashComments': true,
        'cStyleComments': true,
        'multiLineStrings': true,
        'regexLiterals': true
    }));
    register('regex', [
        [STRING, /^[\s\S]+/]
    ]);
    register('js', simpleLexer({
        'keywords': JSCRIPT_KEYWORDS,
        'cStyleComments': true,
        'regexLiterals': true
    }));
    register('in.tag',
    [
        [PLAIN, /^[\s]+/, ' \t\r\n'],
        [ATTRIB_VALUE, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, '\"\''],
        [TAG, /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
        [ATTRIB_NAME, /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
        ['uq.val', /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],
        [PUNCTUATION, /^[=<>\/]+/],
        ['js', /^on\w+\s*=\s*\"([^\"]+)\"/i],
        ['js', /^on\w+\s*=\s*\'([^\']+)\'/i],
        ['js', /^on\w+\s*=\s*([^\"\'>\s]+)/i],
        ['css', /^style\s*=\s*\"([^\"]+)\"/i],
        ['css', /^style\s*=\s*\'([^\']+)\'/i],
        ['css', /^style\s*=\s*([^\"\'>\s]+)/i]
    ]);

    register('htm html mxml xhtml xml xsl', [
        ['plain', /^[^<?]+/],
        ['declaration', /^<!\w[^>]*(?:>|$)/],
        ['comment', /^<\!--[\s\S]*?(?:-\->|$)/],
        // Unescaped content in an unknown language
        ['in.php', /^<\?([\s\S]+?)(?:\?>|$)/],
        ['in.asp', /^<%([\s\S]+?)(?:%>|$)/],
        ['punctuation', /^(?:<[%?]|[%?]>)/],
        ['plain', /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],
        // Unescaped content in javascript.  (Or possibly vbscript).
        ['js', /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],
        // Contains unescaped stylesheet content
        ['css', /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],
        ['in.tag', /^(<\/?[a-z][^<>]*>)/i]
    ]);

    register('css', [
        // The space Prettifyoduction <s>
        ['plain', /^[ \t\r\n\f]+/, ' \t\r\n\f'],
        // Quoted strings. <string1> and <string2>
        ['string', /^\"(?:[^\n\r\f\\\"]|\\(?:\r\n?|\n|\f)|\\[\s\S])*\"/],
        ['string', /^\'(?:[^\n\r\f\\\']|\\(?:\r\n?|\n|\f)|\\[\s\S])*\'/],
        [SH.createBrush([
        ['string', /^[^\)\"\']+/]
        ]), /^url\(([^\)\"\']*)\)/i],
        ['keyword', /^(?:url|rgb|\!important|@|inherit|initial|auto)(?=[^\-\w]|$)/i],
        // A Prettifyoperty name -- an identifier followed by a colon.
        [SH.createBrush([
        ['keyword', /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i]
        ]), /^(-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*)\s*:/i],
        // A C style block comment. The <comment> Prettifyoduction.
        ['comment', /^\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//],
        // Escaping text spans
        ['comment', /^(?:<!--|-->)/],
        // A number possibly containing a suffix.
        ['literal', /^(?:\d+|\d*\.\d+)(?:%|[a-z]+)?/i],
        // A hex color
        ['literal', /^#(?:[0-9a-f]{3}){1,2}/i],
        // An identifier
        ['plain', /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i],
        // A run of punctuation
        ['punctuation', /^[^\s\w\'\"]+/]
    ]);

    register('json', simpleLexer({
        'keywords': 'null,true,false'
    }));

    return SH;
})();

// #endregion

// 指示当前系统是否在后台运行。
if (typeof module === 'object' && typeof __dirname === 'string') {

    //#region 后台部分

    Doc.basePath = require('path').resolve(__dirname, Doc.Configs.basePath);

    // 导出 Doc 模块。
    module.exports = Doc;

    //#endregion

} else {

    // #region DOM 辅助函数

    /**
	* DOM辅助处理模块。
	*/
    Doc.Dom = {

        /**
		 * 指示当前是否为 IE6-8 浏览器。
		 */
        isOldIE: !+"\v1",

        /**
         * 为 IE 浏览器提供特殊处理。
         */
        fixBrowser: function () {

            // 令 IE6-8 支持显示 HTML5 新元素。
            if (Doc.Dom.isOldIE) {
                'article section header footer nav aside details summary menu'.replace(/\w+/g, function (tagName) {
                    document.createElement(tagName);
                });
            }

            // IE6-8 缺少 indexOf 函数。
            Array.prototype.indexOf = Array.prototype.indexOf || function (value, startIndex) {
                for (var i = startIndex || 0; i < this.length; i++) {
                    if (this[i] === value) {
                        return i;
                    }
                }
                return -1;
            };

            String.prototype.trim = String.prototype.trim || function () {
                return this.replace(/^\s+|\s+$/g, "");
            };

            // IE6-7 缺少 document.querySelector 函数。
            document.querySelectorAll = document.querySelectorAll || function (selector) {

                // selector 可能为 tagName, .className, tagName[attrName=attrValue]

                var match = /^(\w*)(\.(\w+)|\[(\w+)=(['"]?)([^'"]*)\5\])?$/.exec(selector);
                var list = this.getElementsByTagName(match[1] || '*');
                // 没有其它过滤器，直接返回。
                if (!match[2]) {
                    return list;
                }

                var result = [];

                for (var i = 0, node; node = list[i]; i++) {
                    // 区分是否是属性选择器。
                    if (match[4]) {
                        if (node.getAttribute(match[4]) === match[6]) {
                            result.push(node);
                        }
                    } else {
                        if ((' ' + node.className + ' ').indexOf(' ' + match[3] + ' ') >= 0) {
                            result.push(node);
                        }
                    }
                }

                return result;
            };
            document.querySelector = document.querySelector || function (selector) {
                return document.querySelectorAll(selector)[0] || null;
            };

            // IE6-8 缺少 localStorage
            window.localStorage = window.localStorage || {};

        },

        /**
         * 为指定节点增加类名。
         */
        addClass: function (node, className) {
            node.className = node.className ? node.className + ' ' + className : className;
        },

        /**
         * 计算指定节点的当前样式。
         */
        computeStyle: function (node, cssName) {
            return parseFloat(getComputedStyle(node, null)[cssName]);
        },

        /**
		 * 设置 DOM ready 后的回调。
		 */
        ready: function (callback) {
            document.addEventListener && document.addEventListener('DOMContentLoaded', callback, false);
        },

        /**
         * 异步载入一个脚本。
         */
        loadScript: function (src, callback) {
            var script = document.createElement('SCRIPT');
            script.type = 'text/javascript';
            script.src = src;
            if (callback) {
                script.onload = script.onreadystatechange = function () {
                    if (!script.readyState || !/in/.test(script.readyState)) {
                        script.onload = script.onreadystatechange = null;
                        callback();
                    }
                };
            }
            var head = document.getElementsByTagName('HEAD')[0] || document.body;
            head.insertBefore(script, head.firstChild);
        },

        /**
         * 执行 CSS 选择器并对每个节点执行回调。
         */
        each: function (selector, callback) {
            var nodes = document.querySelectorAll(selector);
            for (var i = 0, node; node = nodes[i]; i++) {
                callback(node, i, nodes);
            }
        }

    };

    // #endregion

    // #region Page

    /**
     * 负责生成页面导航。
     */
    Doc.Page = {

        title: ' - TealUI | 更懂你的前端代码库',

        header: '<nav id="doc_topbar" class="doc-container doc-section doc-clear">\
                    <div id="doc_progress"></div>\
                    <a href="{basePath}{index}" id="doc_logo" class="doc-left">TealUI <sup>{version}</sup></a>\
                    <span id="doc_navbar_trigger" class="doc-right" onclick="this.classList.toggle(\'doc-trigger-actived\')" ontouchstart="this.onclick(); return false;">≡</span>\
                    <ul id="doc_navbar">\
                        <li{folder_actived_docs}><a href="{basePath}{folder_docs}/{index}">开始使用</a></li>\
                        <li{folder_actived_demos}><a href="{basePath}{folder_demos}/{index}">文档和演示</a></li>\
                        <li{folder_actived_tools_customize}><a href="{basePath}{folder_tools}/customize/{index}">下载和定制</a></li>\
                        <li{folder_actived_tools_devtools}><a href="{basePath}{folder_tools}/devTools/{index}">开发者工具</a></li>\
                        <li class="doc-right"><a href="http://jplusui.github.com/" target="_blank">历史版本</a></li>\
                    </ul>\
                </nav>\
                <header id="doc_header" class="doc-container doc-section">\
                    <h1>{pageTitle}</h1>\
                    <p>{pageDescription}</p>\
                </header>\
                <aside id="doc_sidebar">\
                    <input type="search" id="doc_list_filter" class="doc-section" placeholder=" 🔍 搜索{pageName}..." onkeydown="Doc.Page.onFilterKeyPress(event)" autocomplete="off" onchange="Doc.Page.filterList()" oninput="Doc.Page.filterList()" />\
                    <div id="doc_list" class="doc-section"></div>\
                </aside>\
                <div id="doc_mask" onclick="document.getElementById(\'doc_sidebar\').classList.remove(\'doc-sidebar-actived\')" ontouchstart="this.onclick(); return false;"></div>\
                <nav id="doc_pager" class="doc-section">\
                    <div><a accesskey="W" class="doc-pager-hide" title="返回顶部(Alt{shift}+W)" href="javascript:Doc.Page.gotoTop();" id="doc_pager_up">^</a></div>\
                    <div>\
                        <a accesskey="A" title="上一页(Alt{shift}+A)" href="javascript:Doc.Page.moveListActivedItem(true);Doc.Page.gotoActivedItem();" id="doc_pager_left">«</a>\
                        <a accesskey="S" title="{pageName}列表(Alt{shift}+S)" href="javascript:Doc.Page.toggleSidebar();" id="doc_pager_search">≡</a>\
                        <a accesskey="D" title="下一页(Alt+Shift+D)" href="javascript:Doc.Page.moveListActivedItem(false);Doc.Page.gotoActivedItem();" id="doc_pager_right">»</a>\
                    </div>\
                </nav>\
                <div class="doc-toolbar doc-toolbar-module doc-right doc-section">\
                    {packager}\
                    <a href="{newWindowUrl}" target="_blank">❒ 在新窗口打开</a>\
                </div>\
                <h1>{title} <small>{path}</small></h1>',

        footer: '<div>\
                    <a href="{basePath}{folder_docs}/about/{index}">关于我们</a> |\
                    <a href="{basePath}{folder_docs}/about/joinus.html">加入我们</a> |\
                    <a href="{basePath}{folder_docs}/about/license.html">开源协议</a> |\
                    <a href="https://github.com/Teal/TealUI/issues/new" target="_blank">问题反馈</a>\
                </div>\
                &copy; 2011-2015 TealUI Team. All Rights Reserved.',

        onFilterKeyPress: function (event) {
            var keyCode = event.keyCode;
            if (keyCode === 40 || keyCode === 38) {
                event.preventDefault();
                Doc.Page.moveListActivedItem(keyCode === 38);
            } else if (keyCode === 13 || keyCode === 10) {
                Doc.Page.gotoActivedItem();
            }
        },

        moveListActivedItem: function (up) {
            var dds = [];
            Doc.Dom.each('#doc_list dd', function (node) {
                if (!node.firstChild.className) {
                    dds.push(node);
                }
            });
            var link = document.querySelector('#doc_list .doc-actived');
            if (link) {
                link.className = '';
            }
            var index = link ? dds.indexOf(link) : -1;
            if (link = index >= 0 && dds[index + (up ? -1 : 1)] || dds[up ? dds.length - 1 : 0]) {
                link.className = 'doc-actived';
                Doc.Page.scrollActivedItemIntoView(up);
            }
        },

        scrollActivedItemIntoView: function (up) {
            var link = document.querySelector('#doc_list .doc-actived');
            if (link) {
                var offsetTop = link.offsetTop,
                    docList = document.getElementById('doc_list'),
                    scrollTop = docList.scrollTop;

                // 如果即将超出屏幕范围则自动滚动。
                if (offsetTop <= scrollTop + docList.firstChild.nextSibling.offsetTop || offsetTop >= scrollTop + docList.offsetHeight) {
                    link.scrollIntoView(up);
                }
            }
        },

        gotoActivedItem: function () {
            var link = document.querySelector('#doc_list .doc-actived');
            if (link) {
                location.href = link.firstChild.href;
            }
        },

        gotoTop: function () {
            var srcollElement = document.documentElement;
            if (!srcollElement.scrollTop) {
                srcollElement = document.body;
            }
            var step = srcollElement.scrollTop / 5;
            moveNext();
            function moveNext() {
                srcollElement.scrollTop -= step;
                if (srcollElement.scrollTop > 0) {
                    setTimeout(moveNext, 20);
                }
            }
        },

        togglePackage: function () {
            var docPackages = localStorage.doc_packages ? JSON.parse(localStorage.doc_packages) : {};
            docPackages[Doc.path] = document.getElementById('doc_package_current').checked;
            localStorage.doc_packages = JSON.stringify(docPackages);
        },

        /**
         * 应用过滤项重新渲染列表。
         */
        filterList: function () {

            // 获取过滤的关键字。
            var filter = document.getElementById('doc_list_filter').value.trim().toLowerCase(),
                filterRegExp = filter && new RegExp('(' + filter.replace(/([\-.*+?^${}()|[\]\/\\])/g, '\\$1') + ')', 'ig'),
                docList = document.getElementById('doc_list'),
                nonHintText = docList.firstChild;

            // 重新显示找不到的提示文案。
            if (nonHintText) {
                nonHintText.className = '';
            }

            for (var i = 0, h2dl, lastH2; h2dl = docList.childNodes[i]; i++) {

                if (h2dl.tagName === 'DL') {

                    for (var j = 0, dtdd, lastDt, lastDtIsShown; dtdd = h2dl.childNodes[j]; j++) {

                        // 判断当前项是否需要显示。
                        var title = dtdd.getAttribute('data-title'),
                            name = dtdd.getAttribute('data-name'),
                            shouldShow = false;

                        if (filter) {

                            // 先验证是否在名字中。
                            var t = name.replace(filterRegExp, '<span class="doc-red">$1</span>');
                            if (t.length !== name.length) {
                                shouldShow = true;
                                name = t;
                            }

                            // 再验证是否在标题中。
                            t = title.replace(filterRegExp, '<span class="doc-red">$1</span>');
                            if (t.length !== title.length) {
                                shouldShow = true;
                                title = t;
                            } else {

                                // 最后验证是否符合拼音。
                                var titlePinYin = (dtdd.getAttribute('data-title-pin-yin') || "");

                                // 验证是否符合拼音首字母。
                                t = titlePinYin.replace(/(\S)\S+\s?/g, "$1").indexOf(filter);
                                if (t >= 0) {
                                    shouldShow = true;
                                    title = title.substr(0, t) + '<span class="doc-red">' + title.substr(t, filter.length) + '</span>' + title.substr(t + filter.length);
                                } else {

                                    // 验证是否符合拼音全拼。
                                    var titlePinYinArray = titlePinYin.split(' ');
                                    var titlePinYinString = titlePinYinArray.join('');
                                    var prefixLength = 0;
                                    for (var k = 0; k < titlePinYinArray.length; k++) {

                                        // 从当前位置查找全拼。
                                        if (titlePinYinString.indexOf(filter, prefixLength) === prefixLength) {
                                            
                                            // 根据输入的拼音长度确定实际匹配到的中文数。
                                            var len = 0, maxK = k;
                                            for (; maxK < titlePinYinArray.length; maxK++) {
                                                len += titlePinYinArray[maxK].length;
                                                if (len >= filter.length) {
                                                    break;
                                                }
                                            }
                                            
                                            shouldShow = true;
                                            title = title.substr(0, k) + '<span class="doc-red">' + title.substr(k, maxK - k + 1) + '</span>' + title.substr(maxK + 1);

                                            break;

                                        }

                                        prefixLength += titlePinYinArray[k].length;
                                    }

                                }

                            }

                        }

                        if (dtdd.tagName === 'DD') {

                            // 如果父项被筛选出，则同时筛选子项。允许根据路径搜索。
                            shouldShow = shouldShow || lastDtIsShown || dtdd.firstChild.href.toLowerCase().indexOf(filter) >= 0 || (dtdd.getAttribute('data-tags') || '').toLowerCase().indexOf(filter) >= 0;

                            // 如果子项被筛选出，则同时筛选父项。
                            if (lastDt && shouldShow) {
                                lastDt.className = '';
                                lastDt = null;
                            }

                            // 如果子项被筛选出，则同时筛选父项。
                            if (lastH2 && shouldShow) {
                                lastH2.className = '';
                                lastH2 = null;
                            }

                            // 如果有任一项被筛选出，则隐藏找不到的文案。
                            if (nonHintText && shouldShow) {
                                nonHintText.className = 'doc-list-hide';
                                nonHintText = null;
                            }

                            dtdd = dtdd.firstChild;

                        } else if (dtdd.tagName === 'DT') {
                            lastDt = dtdd;
                            lastDtIsShown = shouldShow;
                        }

                        // 首先隐藏节点，如果子项存在则显示节点。
                        dtdd.className = shouldShow ? '' : 'doc-list-hide';
                        dtdd.innerHTML = title + ' <small>' + name + '</small>';

                    }

                } else if (h2dl.tagName === 'H2') {

                    lastH2 = h2dl;

                    // 首先隐藏节点，如果子项存在则显示节点。
                    lastH2.className = 'doc-list-hide';

                }
            }

            function appendFilter(value) {
                return filter ? value.replace(filter, '<span class="doc-red">' + filter + '</span>') : value;
            }

            // 默认选中第一项。
            var actived = document.querySelector('#doc_list .doc-actived');
            if (!actived || actived.firstChild.className) {
                Doc.Page.moveListActivedItem();
            }

        },

        /**
         * 调用远程 node 服务器完成操作。
         */
        callService: function (cmdName, params, success, error) {
            var url = Doc.Configs.servicePath + '?cmd=' + cmdName + params;
            if (location.protocol === 'file:') {
                error(Doc.Utils.formatString('通过 file:/// 直接打开文件时，无法 AJAX 调用远程服务，请先执行 [项目跟目录]/{devTools}/node/bootserver.cmd 启动服务器', Doc.Configs.devTools));
                return;
            }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 1223) {
                        if (xhr.getResponseHeader("content-type") === "text/html") {
                            success(xhr.responseText);
                        } else {
                            error(Doc.Utils.formatString('无效的远程服务器，请先执行 [项目跟目录]/{devTools}/node/bootserver.cmd 启动服务器', Doc.Configs.devTools));
                        }
                    } else {
                        error('调用时出错：' + url);
                    }
                }
            };
            xhr.send(null);
        },

        /**
         * 初始化页面框架。
         */
        init: function () {

            //// 修复浏览器。
            //Doc.Dom.fixBrowser();

            // 获取当前 doc.js 所在路径。
            var docJsPath = document.getElementsByTagName("script");
            docJsPath = docJsPath[docJsPath.length - 1].src;

            // 获取当前项目的跟目录。
            var a = document.createElement('a');
            a.href = docJsPath.replace(/\/[^\/]*$/, "/") + Doc.Configs.basePath;
            Doc.basePath = a.href;

            // 获取当前项目路径。
            var path = location.href.replace(/[?#].*$/, "");
            if (path.indexOf(Doc.basePath) === 0) {
                path = path.substr(Doc.basePath.length);
            }
            Doc.path = path.replace(/[^/]*\//, "");

            // 获取当前项目所在文件夹。
            var actucalFolder = path.replace(/\/.*$/, "");
            Doc.folder = 'assets';
            for (var folderName in Doc.Configs.folders) {
                if (actucalFolder === Doc.Configs.folders[folderName].path) {
                    Doc.folder = folderName;
                    break;
                }
            }

            // 判断当前开发系统是否在本地运行。
            Doc.local = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '::1';

            // 载入 CSS 样式。
            var frame = '<link type="text/css" rel="stylesheet" href="' + docJsPath.replace(/\.js$/, '.css') + '" />';
            var docPageClass = '';

            // 如果地址存在 ?frame=none，则不加载文档顶部和底部。
            if (!/[?&]frame=none/i.test(location.search) && +"\v1") {

                docPageClass = ' doc-page';

                var args = {
                    basePath: Doc.basePath,
                    version: Doc.Configs.version,
                    pageName: Doc.Configs.folders[Doc.folder].pageName,
                    pageTitle: Doc.Configs.folders[Doc.folder].pageTitle,
                    pageDescription: Doc.Configs.folders[Doc.folder].pageDescription,
                    title: document.title,
                    path: Doc.path.replace(/\..*$/, ""),
                    newWindowUrl: location.href + (location.search ? '&' : '?') + 'frame=none',
                    docPackageChecked: localStorage.doc_packages && JSON.parse(localStorage.doc_packages)[Doc.path] ? ' checked="checked"' : '',
                    index: location.protocol === 'file:' ? 'index.html' : '',
                    packager: Doc.path && Doc.folder === 'demos' ? '<label><input type="checkbox" id="doc_package_current" onclick="Doc.Page.togglePackage()"' + (localStorage.doc_packages && JSON.parse(localStorage.doc_packages)[Doc.path] ? ' checked="checked"' : '') + '>打包此组件</label>' : '',
                    shift: navigator.userAgent.indexOf('Firefox') >= 0 ? '+Shift' : ''
                };

                // 更新导航条高亮。
                for (var folderName in Doc.Configs.folders) {
                    args['folder_' + folderName] = Doc.Configs.folders[folderName].path;
                }
                var activedFolder = Doc.folder;
                if (activedFolder === 'tools') {
                    activedFolder += '_' + Doc.path.replace(/\/.*$/, "");
                }

                args['folder_actived_' + activedFolder] = ' class="doc-actived"';
                frame += Doc.Utility.formatString(Doc.Page.header, args);

                var metaDdescription = document.querySelector('meta[name=description]');
                if (metaDdescription) {
                    frame += '<blockquote>' + metaDdescription.content + '</blockquote>';
                }

                Doc.Dom.loadScript(Doc.basePath + Doc.Configs.listsPath + '/' + Doc.Configs.folders[Doc.folder].path + '.js');

                Doc.Dom.ready(function () {

                    // 插入多说评论框。
                    if (!Doc.local) {
                        var div = document.createElement('div');
                        div.className = 'ds-thread';
                        div.setAttribute('data-thread-key', location.pathname);
                        div.setAttribute('data-title', document.title);
                        div.setAttribute('data-url', location.pathname);
                        document.body.appendChild(div);

                        window.duoshuoQuery = { short_name: "teal" };
                        Doc.Dom.loadScript('//static.duoshuo.com/embed.js');
                    }

                    // 插入底部。
                    var footer = document.createElement('footer');
                    footer.id = 'doc_footer';
                    footer.className = 'doc-container doc-section';
                    footer.innerHTML = Doc.Utility.formatString(Doc.Page.footer, args);
                    document.body.appendChild(footer);

                    // 底部影响边栏大小。
                    Doc.Page.updateSidebar(true);

                    // 载入列表。
                    Doc.Dom.loadScript(Doc.basePath + Doc.Configs.listsPath + '/' + Doc.Configs.folders[Doc.folder].path + '.js');

                });

                document.title += Doc.Page.title;

                // 插入百度统计代码。
                if (!Doc.local) {
                    Doc.Dom.loadScript("http://hm.baidu.com/h.js?a37192ce04370b8eb0c50aa13e48a15b".replace('http:', location.protocol));
                }

            }

            // 插入页面框架。
            document.write(frame);
            Doc.Dom.addClass(document.body, 'doc' + docPageClass);

            Doc.Dom.ready(function () {
                Doc.Page.initSourceCode();
            });

        },

        /**
         * 初始化页内的代码区域。
         */
        initSourceCode: function () {
            // 处理 <pre>, <script class="doc-demo">, <aside class="doc-demo">
            Doc.Dom.each('pre, .doc-demo', function (node) {

                // 获取源码和语言。
                var pre, content, language;
                if (node.tagName === 'PRE') {
                    content = node.textContent;
                    pre = node;
                } else if (node.tagName === 'SCRIPT') {
                    content = node.textContent;
                    language = !node.type || node.type === 'text/javascript' ? 'js' : null;
                    node.className = node.className.replace('doc-demo', '');
                } else {
                    content = node.innerHTML;
                    language = 'html';
                }

                language = language || (pre && (/\bdoc-sh-(\w+)\b/.exec(pre.className) || [])[1]) ||Doc.SyntaxHighligher.guessLanguage(content);
                if (!pre) {
                    pre = document.createElement('pre');
                    node.parentNode.insertBefore(pre, node.nextSibling);
                }

                pre.textContent = Doc.Utility.removeLeadingWhiteSpaces(content);
                Doc.Dom.addClass(pre, 'doc doc-sh');

                // 语法高亮。
                setTimeout(function () {
                    Doc.SyntaxHighligher.one(pre, language);
                }, 0);

                // 插入工具按钮。
                if (typeof document.ontouchend === 'undefined') {
                    var html = '<a href="javascript://编辑并执行源码">编辑</a><a href="javascript://全选并复制源码">全选</a>',
                        editButton = 0,
                        copyButton = 1,
                        execButton;

                    if (pre === node && language == 'js') {
                        html = '<a href="javascript://执行代码">执行</a>' + html;
                        editButton++;
                        copyButton++;
                        execButton = 0;
                    }

                    // 插入工具条。
                    var aside = document.createElement('aside');
                    aside.className = 'doc-toolbar doc-toolbar-code doc-section';
                    aside.innerHTML = html;
                    pre.parentNode.insertBefore(aside, pre);

                    editButton = aside.childNodes[editButton];
                    copyButton = aside.childNodes[copyButton];
                    execButton = aside.childNodes[execButton];

                    // 检测flash 复制。
                    if (location.protocol !== 'file:' && navigator.plugins && navigator.plugins["Shockwave Flash"]) {
                        copyButton.innerHTML = '复制';
                        copyButton.onmouseover = function () {
                            // 初始化复制 FLASH。
                            if (!Doc.ZeroClipboard) {
                                window.ZeroClipboard = Doc.ZeroClipboard = {
                                };
                                var div = document.createElement('div');
                                div.style.position = 'absolute';
                                div.innerHTML = '<embed id="zeroClipboard" src="' + Doc.basePath + Doc.Configs.folders.assets.path + '/ZeroClipboard.swf" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + copyButton.offsetWidth + '" height="' + copyButton.offsetHeight + '" name="zeroClipboard" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + 'id=zeroClipboard&width=' + copyButton.offsetWidth + '&height=' + copyButton.offsetHeight + '" wmode="transparent" />';
                                document.body.appendChild(div);
                                window.ZeroClipboard.movie = document.getElementById('zeroClipboard');
                            }

                            // 设置回调。
                            window.ZeroClipboard.dispatch = function (id, eventName, args) {
                                if (eventName === 'mouseOver') {
                                    copyButton.innerHTML = '复制';
                                    copyButton.className = 'doc-hover';
                                } else if (eventName === 'mouseOut') {
                                    copyButton.onmouseout();
                                } else if (eventName === 'complete') {
                                    copyButton.innerHTML = '成功';
                                }
                            };

                            // 设置按钮样式。
                            window.ZeroClipboard.dispatch(null, 'mouseOver');

                            // 设置flash样式。
                            var div = window.ZeroClipboard.movie.parentNode;
                            var rect = copyButton.getBoundingClientRect();
                            div.style.left = rect.left + window.scrollX + 'px';
                            div.style.top = rect.top + window.scrollY + 'px';

                            doLoad();

                            function doLoad() {
                                if (window.ZeroClipboard.movie.setText) {
                                    window.ZeroClipboard.movie.setText(pre.textContent.replace(/\r?\n/g, "\r\n"));
                                    return;
                                }
                                setTimeout(doLoad, 10);
                            }


                        };
                        copyButton.onmouseout = function () {
                            copyButton.innerHTML = '复制';
                            copyButton.className = '';
                        };
                    }

                    // 全选按钮。
                    copyButton.onclick = function () {
                        pre.focus();
                        var range = new Range();
                        range.selectNode(pre);
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    };

                    // 编辑和执行按钮。
                    editButton.onclick = function () {
                        var canExec = !execButton && (language === 'js' || (language === 'html' && pre !== node));
                        if (pre.contentEditable === 'true') {
                            if (canExec) {
                                if (language === 'js') {
                                    execScript(pre.textContent);
                                } else {
                                    execHtml(pre.textContent);
                                }
                            } else {
                                pre.contentEditable = false;
                                editButton.innerHTML = '编辑';
                                Doc.SyntaxHighligher.one(pre, language);
                            }
                        } else {
                            pre.contentEditable = true;
                            pre.focus();
                            pre.textContent = pre.textContent;
                            editButton.innerHTML = canExec ? '执行' : '完成';

                            pre.onkeydown = function (event) {

                                // 设置插入 TAB 后为插入四个空格。
                                if (event.keyCode === 9) {
                                    event.preventDefault();
                                    var sel = window.getSelection();
                                    var range = sel.getRangeAt(0);
                                    range.collapse(false);
                                    var node = range.createContextualFragment("    ");
                                    var c = node.lastChild;
                                    range.insertNode(node);
                                    if (c) {
                                        range.setEndAfter(c);
                                        range.setStartAfter(c)
                                    }
                                    sel.removeAllRanges();
                                    sel.addRange(range);

                                    // 设置插入 CTRL 回车后执行代码。
                                } else if (event.ctrlKey && (event.keyCode === 10 || event.keyCode === 13)) {
                                    execHtml(pre.textContent);
                                }
                            };

                            // 选中最后一个字符。
                            var range = new Range();
                            range.setEndAfter(pre.lastChild);
                            range.setStartAfter(pre.lastChild);
                            var sel = window.getSelection();
                            sel.removeAllRanges();
                            sel.addRange(range);

                        }
                    };

                    // 执行按钮。
                    if (execButton) {
                        execButton.onclick = function () {
                            execScript(pre.textContent);
                        };
                    }

                    function execScript(content) {
                        try {
                            console.group(pre.textContent);
                        } catch (e) {
                        }

                        var result;

                        try {

                            // 如果是这行发生错误说明是用户编辑的脚本有错误。
                            result = window["eval"].call(window, content);

                        } finally {
                            try {
                                if (result !== undefined) {
                                    console.log(result);
                                }
                                console.groupEnd();
                            } catch (e) {
                            }
                        }
                    }

                    function execHtml(content) {
                        node.innerHTML = content;
                        var scripts = node.getElementsByTagName('script');
                        for (var i = 0, script; script = scripts[i]; i++) {
                            if (!script.type || script.type === 'text/javascript') {
                                execScript(script.textContent);
                            }
                        }
                    }

                }

            });
        },

        /**
         * 载入列表完成后负责更新列表。
         */
        initList: function (list) {
            var html = '<small class="doc-list-hide">无搜索结果</small>';
            html += '<dl>';
            for (var i = 0; i < list.length ; i++) {
                var itemI = list[i];
                html += Doc.Utility.formatString('<dt data-title="{title}" data-name="{name}" data-title-pin-yin="{titlePinYin}">{title} <small>{name}</small></dt>', itemI);
                for (var j = 0; j < (itemI.children && itemI.children.length) ; j++) {
                    var itemJ = itemI.children[j];
                    itemJ.activedClass = itemJ.path === Doc.path ? ' doc-actived' : '';
                    itemJ.fullPath = Doc.basePath + Doc.Configs.folders[Doc.folder].path + '/' + itemJ.path;
                    itemJ.status = itemJ.status || 'done';
                    html += Doc.Utility.formatString('<dd data-title="{title}" data-name="{name}" data-tags="{tags}" data-title-pin-yin="{titlePinYin}" class="doc-list-{status}{activedClass}"><a href="{fullPath}">{title} <small>{name}</small></a></dd>', itemJ);
                }
            }
            html += '</dl>';
            document.getElementById('doc_list').innerHTML = html;

            // 更新列表大小。
            Doc.Page.updateSidebar(true);

            // 实现边栏菜单固定位置显示。
            window.addEventListener('resize', Doc.Page.updateSidebar, false);
            window.addEventListener('scroll', Doc.Page.updateSidebar, false);

            // 绑定列表滚动大小。
            document.getElementById('doc_list').addEventListener('scroll', function () {
                localStorage.doc_listScrollTop = document.getElementById('doc_list').scrollTop;
            }, false);
            if (localStorage.doc_listScrollTop) {
                document.getElementById('doc_list').scrollTop = localStorage.doc_listScrollTop;
            }
            Doc.Page.scrollActivedItemIntoView(true);
        },

        /**
         * 更新侧边尺寸。
         */
        updateSidebar: function (lazy) {
            
            var sidebar = document.getElementById('doc_sidebar');
            var list = document.getElementById('doc_list');
            var filter = document.getElementById('doc_list_filter');
            var header = document.getElementById('doc_header');
            var footer = document.getElementById('doc_footer');

            var bodyHeight = window.innerHeight;

            var mainTop = header.getBoundingClientRect().bottom + Doc.Dom.computeStyle(header, 'marginBottom');
            var mainBottom = footer ? footer.getBoundingClientRect().top : 1 / 0;

            var listHeight;

            // 如果正在显示局部。
            if (/\bdoc-sidebar-actived\b/.test(sidebar.className)) {
                sidebar.style.position = 'fixed';
                sidebar.style.top = 0;
                listHeight = bodyHeight;
            } else if (mainTop <= 0) {
                sidebar.style.position = 'fixed';
                sidebar.style.top = 0;
                listHeight = Math.min(bodyHeight, mainBottom);
            } else {
                sidebar.style.position = 'absolute';
                sidebar.style.top = 'auto';
                listHeight = bodyHeight - mainTop;
            }

            list.style.height = listHeight - filter.offsetHeight - Doc.Dom.computeStyle(filter, 'marginTop') - Doc.Dom.computeStyle(filter, 'marginBottom') + 'px';

            // 将内容变的足够高。
            if (mainBottom - mainTop < listHeight && sidebar.getBoundingClientRect().left >= 0) {
                var div = document.createElement('div');
                div.style.height = bodyHeight + 'px';
                document.body.insertBefore(div, footer);
            }

            if (lazy !== true) {

                // 更新返回顶部按钮。
                document.getElementById('doc_pager_up').className = mainTop < 0 ? '' : 'doc-pager-hide';

                var contentHeight = mainBottom - mainTop - bodyHeight;

                // 减去评论框的高度。
                var thread = document.getElementById('ds-thread');
                if (thread) {
                    contentHeight -= thread.offsetHeight;
                }

                // 更新进度条位置。
                document.getElementById('doc_progress').style.width = mainTop < 0 ? Math.min(-mainTop * 100 / contentHeight, 100) + '%' : 0;

            }

        },

        /**
         * 切换侧边栏。
         */
        toggleSidebar: function () {
            var sidebar = document.getElementById('doc_sidebar');
            if (sidebar.className = sidebar.className ? '' : 'doc-sidebar-actived') {
                Doc.Page.updateSidebar(true);
            }
        }

    };

    Doc.Page.init();

    // #endregion

}

// #region trace

/**
 * Print variables to console.
 * @param {Object} ... The variable list to print.
 */
function trace() {

    if (!trace.disable) {

        // If no argument exisits. Fill argument as (trace: id).
        // For usages like: callback = trace;
        if (arguments.length === 0) {
            if (!trace.$count)
                trace.$count = 0;
            return trace('(trace: ' + (trace.$count++) + ')');
        }

        // Use console if available.
        if (window.console) {

            // Check console.debug
            if (console.debug instanceof Function) {
                return console.debug.apply(console, arguments);
            }

            // Check console.log
            if (console.log instanceof Function) {
                return console.log.apply(console, arguments);
            }

            // console.log.apply is undefined in IE 7-8.
            if (console.log) {
                return console.log(arguments.length > 1 ? arguments : arguments[0]);
            }

        }

        // Fallback to call trace.write, which calls window.alert by default.
        return trace.write.apply(trace, arguments);

    }
}

trace.disable = false;

/**
 * Display all variables to user. 
 * @param {Object} ... The variable list to print.
 * @remark Differs from trace(), trace.write() preferred to using window.alert. 
 * Overwrite it to disable window.alert.
 */
trace.write = function () {

    var r = [], i = arguments.length;

    // dump all arguments.
    while (i--) {
        r[i] = trace.dump(arguments[i]);
    }

    window.alert(r.join(' '));
};

/**
 * Convert any objects to readable string. Same as var_dump() in PHP.
 * @param {Object} obj The variable to dump.
 * @param {Number} deep=3 The maximum count of recursion.
 * @return String The dumped string.
 */
trace.dump = function (obj, deep, showArrayPlain) {

    if (deep == null)
        deep = 3;
    switch (typeof obj) {
        case "function":
            // 函数
            return deep >= 3 ? obj.toString().replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
                return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
            }) : "function()";

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
                    r += '\t... (' + flag + ' more)\r\n';
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
};

/**
 * Print a log to console.
 * @param {String} message The message to print.
 * @type Function
 */
trace.log = function (message) {
    if (!trace.disable && window.console && console.log) {
        return console.log(message);
    }
};

/**
 * Print a error to console.
 * @param {String} message The message to print.
 */
trace.error = function (message) {
    if (!trace.disable) {
        if (window.console && console.error)
            return console.error(message); // This is a known error which is caused by mismatched argument in most time.
        else
            throw message; // This is a known error which is caused by mismatched argument in most time.
    }
};

/**
 * Print a warning to console.
 * @param {String} message The message to print.
 */
trace.warn = function (message) {
    if (!trace.disable) {
        return window.console && console.warn ? console.warn(message) : trace("[WARNING]", message);
    }
};

/**
 * Print a inforation to console.
 * @param {String} message The message to print.
 */
trace.info = function (message) {
    if (!trace.disable) {
        return window.console && console.info ? console.info(message) : trace("[INFO]", message);
    }
};

/**
 * Print all members of specified variable.
 * @param {Object} obj The varaiable to dir.
 */
trace.dir = function (obj) {
    if (!trace.disable) {
        if (window.console && console.dir)
            return console.dir(obj);
        else if (obj) {
            var r = "", i;
            for (i in obj)
                r += i + " = " + trace.inspect(obj[i], 1) + "\r\n";
            return trace(r);
        }
    }
};

/**
 * Try to clear console.
 */
trace.clear = function () {
    if (window.console && console.clear)
        return console.clear();
};

/**
 * Test the efficiency of specified function.
 * @param {Function} fn The function to test, which will be executed more than 10 times.
 */
trace.time = function (fn) {

    if (typeof fn === 'string') {
        fn = new Function(fn);
    }

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
        return trace.error(e);
    }
    return trace.info("[TIME] " + past / time);
};

// #endregion
