/**
 * @fileOverview 本文件提供仅供文档演示的相关代码，不是组件的一部分。
 * @author xuld
 */

/**
 * 提供文档演示的相关 API。
 */
var Doc = Doc || {};

/**
 * 全局配置。
 */
Doc.Configs = {

    /**
     * 配置当前项目的版本。
     */
    version: '3.0',

    /**
     * 配置用于处理所有页面请求的服务器地址。
     */
    serviceUrl: 'http://127.0.0.1:5373/tools/customize/service/api.njs',

    /**
     * 配置所有可用文件夹。
     */
    folders: {

        /**
         * 存放文档系统文件的文件夹。
         */
        assets: {
            path: 'assets',
            pageName: '资源',
            pageTitle: '系统资源',
            pageDescription: '提供文档系统内部支持'
        },

        /**
         * 存放示例文件的文件夹。
         */
        demos: {
            path: 'src',
            pageName: '组件',
            pageTitle: '所有组件',
            pageDescription: 'TealUI 提供了 200 多个常用组件，满足多数需求。每个组件依赖性小，可单独下载。'
        },

        /**
         * 存放源文件的文件夹。
         */
        sources: {
            path: 'src',
            pageName: '源码',
            pageTitle: '源码',
            pageDescription: '浏览源码文件夹'
        },

        /**
         * 存放文档文件的文件夹。
         */
        docs: {
            path: 'docs',
            pageName: '文档',
            pageTitle: '开始使用',
            pageDescription: '这里包含了所有文档和教程，从零开始快速上手组件。'
        },

        /**
         * 存放工具的文件夹。
         */
        tools: {
            path: 'tools',
            pageName: '工具',
            pageTitle: '开发者工具',
            pageDescription: 'TealUI 提供了组件定制、代码压缩、合并等常用工具'
        }

    },

    /**
     * 配置索引文件的路径。
     */
    indexPath: 'assets/data/index.js',

    /**
     * 配置当前项目的基础路径。
     */
    basePath: '../',

    /**
     * 配置当前项目使用的编码。
     */
    encoding: 'utf-8',

    /**
     * 配置存储组件源信息的 meta 节点名。
     */
    moduleInfo: 'module-info',

    /**
     * 配置组件访问历史记录闸值。
     */
    maxModuleViewHistory: 10

};

/**
 * 提供工具函数。
 */
Doc.Utility = {

    // #region 底层

    /**
     * 快速解析指定的简易模板字符串。
     * @param {String} tpl 要格式化的字符串。
     * @param {Object} data 格式化参数。
     * @return {String} 格式化后的字符串。
     */
    parseTpl: function (tpl, data) {
        return tpl.replace(/\{\{|\{([^}]+)\}|\}\}/g, function (matched, argName) {
            return argName ? (matched = argName.indexOf(':')) < 0 ? data[argName] : data[argName.substr(0, matched)](argName.substr(matched + 1)) : matched.charAt(0);
        });
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
        return Doc.removeLeadingWhiteSpaces(fn.toString().replace(/^function\s+[^(]*\s*\(.*?\)\s*\{[\r\n]*/, "").replace(/\s*\}\s*$/, "").replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
            return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
        }));
    },

    /**
     * 追加查询参数。
     */
    appendUrl: function (url, paramName, paramValue) {
        paramValue = paramName + '=' + encodeURIComponent(paramValue);
        url = /^(.*?)(\?.+?)?(#.*)?$/.exec(url);
        url[0] = '';
        url[2] = url[2] && url[2].replace(new RegExp('([?&])' + paramName + '\\b([^&]*)?(&|$)'), function (_, q1, __, q2) {
            // 标记已解析过。
            paramName = 0;
            return q1 + paramValue + q2;
        });
        if (paramName) {
            url[2] = (url[2] ? url[2] + '&' : '?') + paramValue;
        }
        return url.join('');
    },

    // #endregion

    // #region 模块解析

    /**
     * 解析模块信息字符串为对象。
     */
    parseModuleInfo: function (value) {
        var r = {};
        value.replace(/([^,;&=\s]+?)\s*=\s*([^,;&]*)/g, function (_, key, value) {
            r[key] = value;
        });
        return r;
    },

    /**
     * 将指定模块信息对象转为字符串。
     */
    stringifyModuleInfo: function (value) {
        var r = [], key;
        for (key in value) {
            r.push(key + '=' + value[key]);
        }
        return r.join(', ');
    }

    // #endregion

};

/**
 * 代码高亮模块。
 */
Doc.SyntaxHighligher = (function () {

    /**
     * @namespace SyntaxHighligher
     */
    var SH = {

        /**
         * 异步高亮单一的节点。
         * @param {Element} elem 要高亮的节点。
         * @param {String} [language] 高亮的语法。系统会自动根据源码猜测语言。
         */
        oneAsync: function (element, language) {
            if (window.Worker) {
                var worker = new Worker();
                worker.onmessage = function (e) {
                    Doc.SyntaxHighligher.one(e.element, e.language);
                };
                worker.postMessage(JSON.stringify({
                    element: element,
                    language: language
                }));
            } else {
                setTimeout(function () {
                    Doc.SyntaxHighligher.one(element, language);
                }, 0);
            }
        },

        /**
         * 删除公共缩进部分。
         */
        removeLeadingWhiteSpaces: function (value) {
            value = value.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
            var space = /^\s+/.exec(value), i;
            if (space) {
                space = space[0];
                value = value.split(/[\r\n]/);
                for (i = value.length - 1; i >= 0; i--) {
                    value[i] = value[i].replace(space, "");
                }
                value = value.join('\r\n');
            }
            return value;
        },

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

            (function () {
                var shortcuts = {},
                tokenizer, stylePatternsStart = 0,
                stylePatternsEnd = stylePatterns.length;

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


                decorate.tokenizer = tokenizer;
                decorate.shortcuts = shortcuts;
                decorate.stylePatternsStart = stylePatternsStart;
                decorate.stylePatternsEnd = stylePatternsEnd;
            })();


            function decorate(sourceCode, position) {
                /** Even entries are positions in source in ascending order.  Odd enties
                 * are style markers (e.g., COMMENT) that run from that position until
                 * the end.
                 * @type {Array<number/string>}
                 */
                var decorations = [position, 'plain'],
                    tokens = sourceCode.match(decorate.tokenizer) || [],
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
                        stylePattern = decorate.shortcuts[token.charAt(0)];
                        if (stylePattern) {
                            match = token.match(stylePattern[1]);
                            style = stylePattern[0];
                        } else {
                            for (var i = decorate.stylePatternsStart; i < decorate.stylePatternsEnd; ++i) {
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
         * 根据源码推测其语音。
         * @param {String} sourceCode 需要高亮的源码。
         * @return {String} 返回一个语言名。
         */
        guessLanguage: function (sourceCode) {
            return /^\s*</.test(sourceCode) && />\s*$/.test(sourceCode) ? 'html' : /\w\s*\{/.test(sourceCode) ? 'css' : /=|[\w$]\s+[\w$]|[\w$]\(|\)\./.test(sourceCode) ? 'js' : null;
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

    /**
     * 解析元素的内容并返回其源码和虚拟 DOM 树。
     *
     * <p>
     * {@code <pre><p><b>print </b>'Hello '<br>  + 'World';</p>}.</p></pre>
     * 解析后句得到虚拟 DOM 树结构为:</p>
     * <pre>
     * (Element   "p"
     *   (Element "b"
     *     (Text  "print "))       ; #1
     *   (Text    "'Hello '")      ; #2
     *   (Element "br")            ; #3
     *   (Text    "  + 'World';")) ; #4
     * </pre>
     *
     * <p>
     * 函数返回:</p>
     * <pre>
     * {
     *   sourceCode: "print 'Hello '\n  + 'World';",
     *   //                    1         2
     *   //          012345678901234 5678901234567
     *   spans: [0, #1, 6, #2, 14, #3, 15, #4]
     * }
     * </pre>
     * <p>
     * 其中 #1 是  {@code "print "} 节点的引用，其它依次类推。
     * </p>
     *
     * <p>
     * The {@code} spans array is an array of pairs.  Even elements are the start
     * indices of substrings, and odd elements are the text nodes (or BR elements)
     * that contain the text for those substrings.
     * Substrings continue until the next index or the end of the source.
     * </p>
     *
     * @param {Node} 要解析的 HTML 节点、
     * @return {Object} 返回虚拟 DOM 树。
     */
    function extractSourceSpans(node) {

        // 检查指定节点是否已格式化。
        var isPreformatted = /^pre/.test((node.currentStyle || node.ownerDocument.defaultView.getComputedStyle(node, null) || 0).whiteSpace);

        var chunks = [];
        var length = 0;
        var spans = [];
        var k = 0;

        function walk(node) {
            switch (node.nodeType) {
                case 3:
                case 4:
                    // Text
                    var text = node.nodeValue;
                    if (text.length) {

                        // 统一换行符。
                        text = isPreformatted ? text.replace(/\r\n?/g, '\n') : text.replace(/[\r\n]+/g, '\r\n　').replace(/[ \t]+/g, ' ');

                        // TODO: handle tabs here?
                        chunks[k] = text;
                        spans[k << 1] = length;
                        length += text.length;
                        spans[(k++ << 1) | 1] = node;
                    }
                    break;
                case 1:
                    // Element
                    for (var child = node.firstChild; child; child = child.nextSibling) {
                        walk(child);
                    }
                    var nodeName = node.nodeName;
                    if (nodeName === 'BR' || nodeName === 'LI') {
                        chunks[k] = '\n';
                        spans[k << 1] = length++;
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
     * 高亮单一的节点。
     * @param {Element} elem 要高亮的节点。
     * @param {String} [language] 语言本身。系统会自动根据源码猜测语言。
     */
    SH.one = function (pre, language) {

        // Extract tags, and convert the source code to plain text.
        var sourceAndSpans = extractSourceSpans(pre),
            specificLanuage = (pre.className.match(/\bdoc-code-(\w+)(?!\S)/i) || [])[1];

        // 自动决定 language
        if (!language) {
            language = specificLanuage || SH.guessLanguage(sourceAndSpans.sourceCode);
        }

        if (!specificLanuage) {
            pre.className += ' doc-code-' + language;
        }

        // Apply the appropriate language handler
        // Integrate the decorations and tags back into the source code,
        // modifying the sourceNode in place.
        recombineTagsAndDecorations(sourceAndSpans, SH.findBrush(language)(sourceAndSpans.sourceCode, 0));
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
                span.className = 'doc-code-' + decorations[decorationIndex + 1];
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
        'keywords': [CPP_KEYWORDS, CSHARP_KEYWORDS, JSCRIPT_KEYWORDS, PERL_KEYWORDS + PYTHON_KEYWORDS, RUBY_KEYWORDS, SH_KEYWORDS],
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

// 指示当前系统是否在后台运行。
if (typeof module === 'object' && typeof __dirname === 'string') {

    // #region NodeJS

    Doc.basePath = require('path').resolve(__dirname, Doc.Configs.basePath) + require('path').sep;

    // 导出 Doc 模块。
    module.exports = Doc;

    // #endregion

} else {

    /**
	 * DOM辅助处理模块。
	 */
    Doc.Dom = {

        /**
         * 判断当前环境是否是触摸屏环境。
         */
        isTouch: function () {
            return window.TouchEvent && screen.width <= 1024;
        },

        /**
         * 为指定节点增加类名。
         */
        addClass: function (node, className) {
            node.className = node.className ? node.className + ' ' + className : className;
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
            script.defer = true;
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

    /**
     * 绘制页内已加载的所有代码块。
     */
    Doc.renderCodes = function () {
        
        // 处理所有 <pre>, <script class="doc-demo">, <aside class="doc-demo">
        Doc.Dom.each('.doc > pre, .doc-demo', function (node) {
            
            // 不重复解析。
            if (node._docInited) {
                return;
            }
            node._docInited = true;

            // 获取源码和语言。
            var pre, content, language;
            if (node.tagName === 'PRE') {
                pre = node;
                content = node.textContent;
                language = (/\bdoc-code-(\w+)\b/.exec(pre.className) || 0)[1]
            } else if (node.tagName === 'SCRIPT') {
                content = node.textContent.replace(/&lt;(\/?script)\b/ig, "<$1");
                language = node.type ? (/text\/(.*)/.exec(node.type) || 0)[1] : 'js';
            } else {
                content = node.innerHTML;
                language = 'html';
            }

            language = language ? ({
                javascript: 'js',
                htm: 'html',
                plain: 'text'
            })[language] || language : Doc.SyntaxHighligher.guessLanguage(content);

            if (!pre) {
                pre = node.parentNode.insertBefore(document.createElement('pre'), node.nextSibling);
                pre._docInited = true;
            }
            
            // 插入代码域。
            Doc.Dom.addClass(pre, 'doc');
            Doc.Dom.addClass(pre, 'doc-code');
            pre.textContent = Doc.SyntaxHighligher.removeLeadingWhiteSpaces(content);

            // 插入工具条。
            var aside = document.createElement('aside'), button;
            aside.className = 'doc-code-toolbar doc-section';
            aside.innerHTML = (language == 'js' || (language == 'html' && node.tagName !== 'SCRIPT' && node !== pre) ? '<a href="javascript://执行本代码" title="执行本代码">执行</a>' : '') + '<a href="javascript://编辑本代码" title="编辑本代码">编辑</a><a href="javascript://全选并复制本源码" title="全选并复制本源码">全选</a>';
            pre.parentNode.insertBefore(aside, pre);

            // 全选复制按钮。
            button = aside.lastChild;
            button.onclick = function () {
                if (Doc.Dom.isTouch()) {
                    button.previousSibling.click();
                }
                var range = document.createRange(),
                    sel = getSelection();
                pre.focus();
                range.selectNode(pre);
                sel.removeAllRanges();
                sel.addRange(range);
            };

            // 检测flash 复制。
            if (window.clipboardData && clipboardData.setData) {
                button.innerHTML = '复制';
                button.onmouseover = function() {
                    this.innerHTML = '复制';
                };
                button.onclick = function() {
                    clipboardData.setData("Text", pre.textContent);
                    this.innerHTML = "成功";
                };
            } else if (location.protocol !== 'file:' && navigator.plugins && navigator.plugins["Shockwave Flash"]) {
                button.innerHTML = '复制';
                var timer;
                button.onmouseover = function () {
                    var button = this;
                    timer = setTimeout(function () {
                        timer = 0;

                        // 初始化复制 FLASH。
                        if (!window.ZeroClipboard) {
                            window.ZeroClipboard = {};
                            var div = document.createElement('div');
                            div.style.position = 'absolute';
                            div.innerHTML = '<embed id="zeroClipboard" src="' + Doc.baseUrl + Doc.Configs.folders.assets.path + '/ZeroClipboard.swf" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + button.offsetWidth + '" height="' + button.offsetHeight + '" name="zeroClipboard" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + 'id=zeroClipboard&width=' + button.offsetWidth + '&height=' + button.offsetHeight + '" wmode="transparent" />';
                            document.body.appendChild(div);
                            window.ZeroClipboard.movie = document.getElementById('zeroClipboard');
                        }

                        // 设置回调。
                        window.ZeroClipboard.dispatch = function (id, eventName, args) {
                            if (eventName === 'mouseOver') {
                                button.innerHTML = '复制';
                                button.className = 'doc-hover';
                            } else if (eventName === 'mouseOut') {
                                button.innerHTML = '复制';
                                button.className = '';
                            } else if (eventName === 'complete') {
                                button.innerHTML = '成功';
                            }
                        };

                        // 设置按钮样式。
                        window.ZeroClipboard.dispatch(null, 'mouseOver');

                        // 设置flash样式。
                        var div = window.ZeroClipboard.movie.parentNode;
                        var rect = button.getBoundingClientRect();
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

                    }, 100);
                };
                button.onmouseout = function () {
                    if (timer) {
                        clearTimeout(timer);
                        timer = 0;
                    }
                    window.ZeroClipboard && window.ZeroClipboard.dispatch(null, 'mouseOut');
                };
            }

            // 编辑按钮。
            button = button.previousSibling;
            button.onclick = function () {
                if (pre.contentEditable === 'true') {
                    this.innerHTML = '编辑';
                    this.title = '编辑本代码';
                    pre.contentEditable = false;
                    this.previousSibling && this.previousSibling.click();
                    Doc.SyntaxHighligher.one(pre, language);
                } else {
                    this.innerHTML = '完成';
                    this.title = '完成编辑并恢复高亮';
                    pre.contentEditable = true;
                    pre.focus();
                    pre.textContent = pre.textContent;

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
                    var range = document.createRange(),
                        sel = getSelection();
                    range.setEndAfter(pre.lastChild);
                    range.setStartAfter(pre.lastChild);
                    sel.removeAllRanges();
                    sel.addRange(range);

                }
            };

            // 执行按钮。
            if (button = button.previousSibling) {
                button.onclick = function () {
                    (language === 'js' ? execScript : execHtml)(pre.textContent);
                };
            }

            function execScript(content) {
                try {
                    console.group(pre.textContent);
                } catch (e) { }

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
                    } catch (e) { }
                }
            }

            function execHtml(content) {
                node.innerHTML = content;
                var scripts = node.getElementsByTagName('script'), i, script;
                for (i = 0; script = scripts[i]; i++) {
                    if (!script.type || script.type === 'text/javascript') {
                        execScript(script.textContent);
                    }
                }
            }

            // 语法高亮。
            setTimeout(function () {
                Doc.SyntaxHighligher.one(pre, language);
            }, 0);

        });

    };

    /**
     * 执行页内所有代码。
     */
    Doc.execAll = function() {
        Doc.Dom.each('a[title="执行本代码"]', function(a) {
            a.click();
        });
    };

    /**
     * 载入列表数据。
     */
    Doc.initList = function (list) {
        Doc.list = list;
    };
    
    /**
     * 负责生成页面导航。
     */
    Doc.Page = {

        // #region 页面初始化

        titlePostfix: ' - TealUI | 最完整的开源前端代码库',

        header: '<nav id="doc_topbar" class="doc-container doc-section doc-clear">\
                    <a href="{baseUrl}{indexUrl}" id="doc_logo">TealUI <small>{version}</small></a>\
                    <span id="doc_menu" class="doc-right">\
                        <button type="button" id="doc_menu_search" onclick="Doc.Page.toggleSidebar();" {touchToClick}><span class="doc-icon">☌</span></button>\
                        <button type="button" id="doc_menu_navbar" onclick="Doc.Page.toggleNavbar();" {touchToClick}><span class="doc-icon">≡</span></button>\
                    </span>\
                    <ul id="doc_navbar">\
                        <li{actived:docs}><a href="{baseUrl}{folder:docs}/{indexUrl}">开始使用</a></li>\
                        <li{actived:demos}><a href="{baseUrl}{folder:demos}/{indexUrl}">所有组件</a></li>\
                        <li{actived:tools/customize}><a href="{baseUrl}{folder:tools}/customize/{indexUrl}">下载和定制</a></li>\
                        <li{actived:tools/devTools}><a href="{baseUrl}{folder:tools}/devTools/{indexUrl}">开发者工具</a></li>\
                    </ul>\
                    <form id="doc_search" class="doc-right" onsubmit="Doc.Page.onSuggestSubmit(\'doc_search_suggest\'); return false;">\
                        <input type="text" placeholder="搜索组件..." value="{search}" autocomplete="off"  onfocus="Doc.Page.showSearchSuggest(this.value)" onblur="Doc.Page.hideSearchSuggest()" oninput="Doc.Page.onSuggestInput(\'doc_search_suggest\', this.value, false)" onchange="Doc.Page.onSuggestInput(\'doc_search_suggest\', this.value, false)" onkeydown="Doc.Page.onSuggestKeyPress(\'doc_search_suggest\', event)" />\
                        <button type="submit" class="doc-icon-search"><span class="doc-icon">☌</span></button>\
                    </form>\
                </nav>\
                <header id="doc_header" class="doc-container doc-section">\
                    <h1>{current:pageTitle}</h1>\
                    <p>{current:pageDescription}</p>\
                </header>\
                <aside id="doc_sidebar">\
                    <form id="doc_sidebar_filter" onsubmit="Doc.Page.onSuggestSubmit(\'doc_sidebar_list\'); return false;">\
                        <input type="search" class="doc-section" placeholder="搜索{current:pageName}..."  autocomplete="off" oninput="Doc.Page.onSuggestInput(\'doc_sidebar_list\', this.value, true)" onchange="Doc.Page.onSuggestInput(\'doc_sidebar_list\', this.value, true)" onkeydown="Doc.Page.onSuggestKeyPress(\'doc_sidebar_list\', event)" />\
                    </form>\
                    <dl id="doc_sidebar_list" class="doc-section doc-list"><dd><small>正在载入列表...</small></dd></dl>\
                </aside>\
                <div id="doc_mask" onclick="Doc.Page.toggleSidebar()" {touchToClick}></div>\
                <div id="doc_progress"></div>\
                <a href="javascript:Doc.Page.gotoTop();" class="doc-pager" id="doc_pager_up" accesskey="W" title="返回顶部(Alt{shift}+W)"><span class="doc-icon">↑</span></a>\
                <a href="javascript:Doc.Page.movePage(false);" class="doc-pager" id="doc_pager_left" accesskey="S" title="上一页(Alt{shift}+S)"><span class="doc-icon">←</span></a>\
                <a href="javascript:Doc.Page.movePage(true);" class="doc-pager" id="doc_pager_right" accesskey="D" title="下一页(Alt+Shift+D)"><span class="doc-icon">→</span></a>\
                <aside id="doc_module_toolbar" class="doc-toolbar doc-right doc-section">\
                    {download:<a href="#" target="_blank"><span class="doc-icon">↧</span>下载此组件</a>}\
                    <a href="javascript:;" onclick="Doc.Page.toggleFavorites(this);">{favorite:<span class="doc-icon">✰</span>收藏}</a>\
                    <a href="{fullScreenUrl}" target="_blank"><span class="doc-icon">❒</span>全屏</a>\
                </aside>\
                <h1 id="doc_title">{title} <small>{name}</small></h1>\
                {summary:<blockquote class="doc-summary">#</blockquote>}',

        footer: '<div>\
                    <a href="{baseUrl}{folderDocs}/about/{indexUrl}">关于我们</a> |\
                    <a href="{baseUrl}{folderDocs}/about/license.html">开源协议</a> |\
                    <a href="https://github.com/Teal/TealUI/issues/new" target="_blank">问题反馈</a> |\
                    <a href="{baseUrl}{folderDocs}/about/joinus.html">加入我们</a>\
                </div>\
                &copy; 2011-2015 The Teal Team. All Rights Reserved.',

        /**
         * 初始化页面框架。
         */
        init: function () {

            // #region 初始化配置

            // 判断当前开发系统是否在本地运行。
            Doc.local = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '::1';

            // 判断当前运行的框架。
            Doc.frame = (/[?&]frame=([^&]*)/i.exec(location.search) || [])[1] || document.documentElement.getAttribute("data-frame") || '';

            // 获取当前 doc.js 所在路径。
            var docJsPath = document.getElementsByTagName("script");
            docJsPath = docJsPath[docJsPath.length - 1].src;

            // 获取当前项目的跟目录。
            var a = document.createElement('a');
            a.href = docJsPath.replace(/\/[^\/]*$/, "/") + Doc.Configs.basePath;
            Doc.baseUrl = a.href;

            // 获取当前项目路径。
            var path = location.href.replace(/[?#].*$/, "");
            if (path.indexOf(Doc.baseUrl) === 0) {
                path = path.substr(Doc.baseUrl.length);
            }
            Doc.path = path.replace(/[^/]*\//, "");

            // 获取当前项目所在文件夹。
            var actucalFolder = path.replace(/\/.*$/, "").toLowerCase();
            Doc.folder = 'assets';
            for (var folderName in Doc.Configs.folders) {
                if (actucalFolder === Doc.Configs.folders[folderName].path) {
                    Doc.folder = folderName;
                    break;
                }
            }

            // 将当前页面加入历史记录。
            if (Doc.Configs.maxModuleViewHistory && Doc.folder === 'demos' && window.localStorage) {
                var history = localStorage.doc_moduleViewHistroy ? localStorage.doc_moduleViewHistroy.split(';') : [];
                history.indexOf(Doc.path) >= 0 && history.splice(history.indexOf(Doc.path), 1);
                history.push(Doc.path) > Doc.Configs.maxModuleViewHistory && history.shift();
                localStorage.doc_moduleViewHistroy = history.join(';');
            }

            // #endregion

            // #region 生成页面

            // 如果当前页面不是独立的页面。
            if (Doc.frame != "page") {

                // 如果页面框架设置为无，则不再继续处理。
                if (Doc.frame == 'none') {
                    return;
                }

                // 载入 CSS 样式。
                var html = '<link type="text/css" rel="stylesheet" href="' + docJsPath.replace(/\.js\b/, '.css') + '" />';

                // 如果不是全屏模式，则生成页面主结构。
                if (Doc.frame != "fullscreen" && +"\v1") {

                    var data = {
                        baseUrl: Doc.baseUrl,
                        version: Doc.Configs.version,

                        current: function (field) {
                            return Doc.Configs.folders[Doc.folder][field];
                        },

                        title: document.title,
                        name: Doc.path.replace(/\..*$/, ""),

                        fullScreenUrl: Doc.Utility.appendUrl(location.href, 'frame', 'fullscreen'),
                        indexUrl: location.protocol === 'file:' ? 'index.html' : '',

                        search: '',
                        shift: navigator.userAgent.indexOf('Firefox') >= 0 ? '+Shift' : '',
                        touchToClick: navigator.userAgent.indexOf('UCBrowser') >= 0 ? '' : 'ontouchstart="this.click(); return false;"',

                        download: function (html) {
                            return Doc.folder == 'demos' && Doc.path.replace(/(\/|^)index\.html$/, "") ? html.replace('#', this.baseUrl + Doc.Configs.folders.tools.path + '/customize/' + this.indexUrl + '?download=' + this.name) : '';
                        },

                        favorite: function (html) {
                            return ~(window.localStorage && localStorage.doc_favorites || '').split(';').indexOf(Doc.path) ? '<span class="doc-icon">★</span>已收藏' : '<span class="doc-icon">✰</span>收藏';
                        },

                        folder: function (name) {
                            return Doc.Configs.folders[name].path;
                        },

                        actived: function (name) {
                            return name == Doc.folder || name == Doc.folder + '/' + Doc.path.replace(/\/.*$/, "") ? ' class="doc-actived"' : '';
                        },

                        summary: function (html) {
                            var metaDdescription = document.querySelector('meta[name=description]');
                            return metaDdescription ? html.replace('#', metaDdescription.content) : '';
                        }

                    };

                    html += Doc.Utility.parseTpl(Doc.Page.header, data);

                    // 生成底部。
                    Doc.Dom.ready(function () {

                        // 插入多说评论框。
                        if (!Doc.local) {
                            var div = document.createElement('div'),
                                path = location.pathname.replace(/\/$/, "/index.html");
                            div.className = 'ds-thread';
                            div.setAttribute('data-thread-key', path);
                            div.setAttribute('data-title', document.title);
                            div.setAttribute('data-url', path);
                            document.body.appendChild(div);

                            window.duoshuoQuery = { short_name: "teal" };
                            Doc.Dom.loadScript('//static.duoshuo.com/embed.js');
                            setTimeout(Doc.Page.updateSidebar, 600);
                        }

                        // 插入底部。
                        var footer = document.createElement('footer');
                        footer.id = 'doc_footer';
                        footer.className = 'doc-container doc-section';
                        footer.innerHTML = Doc.Utility.parseTpl(Doc.Page.footer, data);
                        document.body.appendChild(footer);

                        // 底部影响边栏大小。
                        Doc.Page.updateSidebar(true);

                    });

                } else if (!document.body) {
                    // 确保 document.body 已生成。
                    html += '<div/>';
                }

                // 追加标题后缀。
                document.title += Doc.Page.titlePostfix;

                // 插入页面框架。
                document.write(html);

                // 追加默认样式。
                Doc.Dom.addClass(document.body, 'doc');
                if (Doc.frame != "fullscreen") {
                    Doc.Dom.addClass(document.body, 'doc-page');
                }

                // 初始化侧边栏。
                var list = document.getElementById('doc_sidebar_list');
                if (list) {

                    // 为 PC 用户增加体验，隐藏滚动条。
                    if (!Doc.Dom.isTouch()) {
                        list.className += ' doc-sidebar-hidescrollbar';
                    }

                    // 滚动和重置大小后实时更新。
                    window.addEventListener('resize', Doc.Page.updateSidebar, false);
                    window.addEventListener('scroll', Doc.Page.updateSidebar, false);
                    window.addEventListener('load', Doc.Page.updateSidebar, false);

                    // 更新列表大小。
                    Doc.Page.updateSidebar();

                    // 载入列表内容。
                    Doc.Dom.loadScript(Doc.baseUrl + Doc.Configs.indexPath, function () {

                        // 更新列表项。
                        Doc.Page.updateModuleList(list, Doc.folder, '', true);

                        // 绑定列表滚动大小。
                        if (window.localStorage) {
                            list.addEventListener('scroll', function () {
                                localStorage.doc_listScrollTop = document.getElementById('doc_sidebar_list').scrollTop;
                            }, false);
                            if (localStorage.doc_listScrollTop) {
                                list.scrollTop = localStorage.doc_listScrollTop;
                            }
                        }

                        Doc.Page.scrollActivedItemIntoView(list, true);

                        // 某些平台下可能暂时无法滚动。
                        list.scrollTop || setTimeout(function () {
                            Doc.Page.scrollActivedItemIntoView(list, true);
                        }, 50);
                    });

                }

            }

            // #endregion

            // 插入语法高亮代码。
            Doc.Dom.ready(Doc.renderCodes);

            // 插入百度统计代码。
            if (!Doc.local) {
                Doc.Dom.loadScript("http://hm.baidu.com/h.js?a37192ce04370b8eb0c50aa13e48a15b".replace('http:', location.protocol));
            }

        },

        // #endregion

        // #region 侧边栏和导航条

        /**
         * 更新侧边布局。
         */
        updateSidebar: function (sidebarOnly) {
            var sidebar = document.getElementById('doc_sidebar'),
                list = document.getElementById('doc_sidebar_list'),
                filter = document.getElementById('doc_sidebar_filter'),
                title = document.getElementById('doc_title'),
                footer = document.getElementById('doc_footer'),
                bodyHeight = window.innerHeight,
                mainTop = title.getBoundingClientRect().top,
                mainBottom = footer ? footer.getBoundingClientRect().top : 1 / 0,
                listHeight;

            // 如果侧边栏已折叠。
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
                listHeight = bodyHeight - mainTop - Math.max(0, bodyHeight - mainBottom);
            }

            list.style.height = listHeight - filter.offsetHeight + 'px';

            // 将内容变的足够高。
            if (footer && Doc.local && mainBottom < bodyHeight && sidebar.getBoundingClientRect().left >= 0) {
                footer.style.marginTop = bodyHeight / 2 + 'px';
            }

            if (sidebarOnly !== true) {

                // 更新返回顶部按钮。
                document.getElementById('doc_pager_up').className = mainTop < 0 ? 'doc-pager' : 'doc-pager doc-pager-hide';

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
         * 在手机模式切换显示导航条。
         */
        toggleNavbar: function () {
            var menu = document.getElementById('doc_menu_navbar'),
                navbar = document.getElementById('doc_navbar'),
                height;

            if (menu.className) {
                menu.className = '';
                navbar.style.height = '';
            } else {
                menu.className = 'doc-menu-actived';
                navbar.style.height = 'auto';
                height = navbar.offsetHeight;
                navbar.style.height = '';
                navbar.offsetHeight;
                navbar.style.height = height + 'px';
            }

        },

        /**
         * 在手机模式切换侧边栏。
         */
        toggleSidebar: function () {
            var sidebar = document.getElementById('doc_sidebar');
            if (sidebar.className !== 'doc-sidebar-actived') {
                sidebar.className = 'doc-sidebar-actived';
                Doc.Page.updateSidebar(true);
            } else {
                sidebar.className = 'doc-sidebar-inactived';
            }
        },

        // #endregion

        // #region 组件列表

        /**
         * 更新指定的模块列表。
         * @param {Element} elem 列表容器 DL 元素。
         * @param {String} listName 显示的列表名。
         * @param {String} filter 搜索的关键字。
         * @param {Boolean} includeHeader 是否显示标题。
         */
        updateModuleList: function (elem, listName, filter, includeHeader) {

            if (!elem) {
                return;
            }

            // 确保列表已加载。
            if (!Doc.list) {
                if (Doc._loadingList) {
                    return;
                }
                Doc._loadingList = true;
                elem.innerHTML = '<dd><small>正在加载列表...</small></dd>';
                return Doc.Dom.loadScript(Doc.baseUrl + Doc.Configs.indexPath, function () {
                    delete Doc._loadingList;
                    Doc.Page.updateModuleList(elem, listName, filter, includeHeader);
                });
            }

            // 删除查询条件中的空格。
            filter = filter && filter.replace(/\s+/g, "").toLowerCase();
            if (elem.getAttribute('data-filter') === filter) {
                return;
            }
            elem.setAttribute('data-filter', filter);

            var segments = [],
                list = Doc.list[listName],
                path,
                name,
                item,
                args = {},
                docPath = Doc.path.toLowerCase(),
                history = !includeHeader && window.localStorage && localStorage.doc_moduleViewHistroy && localStorage.doc_moduleViewHistroy.split(';');

            // 对指定内容进行过滤并高亮。
            // applyFilter("你好棒", "ni hao bang".split(' '), "好棒"); // haobang
            function applyFilter(value, valuePinYinArray, filterLowerCased) {

                // 先根据字符匹配。
                var matchIndex = value.toLowerCase().indexOf(filterLowerCased),
                    matchCount = filterLowerCased.length,
                    i, j, vi, fi;

                // 然后尝试匹配拼音。
                if (matchIndex < 0 && valuePinYinArray) {
                    // 逐个验证拼音匹配当前字符。
                    vp: for (i = 0; i < valuePinYinArray.length; i++) {
                        fi = matchCount = 0;
                        // 验证  matchIndex, matchCount 是否刚好匹配过滤器。
                        for (j = i; j < valuePinYinArray.length; j++) {
                            matchCount++;

                            // 搜索当前拼音和指定过滤字符串的相同前缀部分。
                            for (vi = 0; vi < valuePinYinArray[j].length && fi < filterLowerCased.length && valuePinYinArray[j].charAt(vi) === filterLowerCased.charAt(fi) ; vi++, fi++);

                            // 如果已经到达 filter 末尾，则查找完成。
                            if (fi >= filterLowerCased.length) {
                                matchIndex = i;
                                break vp;
                            }

                            // 当前拼音无匹配结果，说明整个拼音不符合。
                            if (vi < 1) {
                                break;
                            }

                        }

                    }
                }

                return matchIndex < 0 ? value : value.substr(0, matchIndex) + '<span class="doc-red">' + value.substr(matchIndex, matchCount) + '</span>' + applyFilter(value.substr(matchIndex + matchCount), valuePinYinArray && valuePinYinArray.slice(matchIndex + matchCount), filterLowerCased);
            }

            for (path in list) {
                item = list[path];
                if (!item.level || (!filter && includeHeader)) {

                    name = includeHeader && !filter ? item.name.replace(/^.*\// , "") : item.name;
                    args.name = args.orignalName = name;
                    args.title = args.orignalTitle = item.title;
                    args.level = item.level;
                    args.status = item.status || 'done';
                    args.url = Doc.baseUrl + Doc.Configs.folders[listName].path + '/' + path;
                    if (!Doc.local) {
                        args.url = Doc.Utility.appendUrl(args.url, "_from", includeHeader ? "sidebar" : "suggest");
                    }

                    // 应用过滤高亮。
                    if (filter) {
                        args.name = applyFilter(name, null, filter);
                        args.title = applyFilter(item.title, item.titlePinYin && item.titlePinYin.split(' '), filter);
                        args.order = args.title.length > item.title.length ? 1 : args.name.length > name.length ? 2 : item.keywords && applyFilter(item.keywords, item.keywordsPinYin && item.titlePinYin.split(/[, ]/), filter).length > item.keywords.length ? 3 : 0;
                        if (!args.order) {
                            continue;
                        }
                        args.actived = 'doc-list-order-' + args.order + ' ';
                    } else if (includeHeader) {
                        args.actived = path.toLowerCase() === docPath ? 'doc-list-actived ' : '';
                    }

                    segments[history && history.indexOf(path) >= 0 ? 'unshift' : 'push'](Doc.Utility.parseTpl(item.level ? '<dt class="doc-list-header-{level}" title="{title}({name})">{title} <small>{name}</small></dt>' : '<dd class="{actived}doc-list-{status}"><a href="{url}" title="{orignalTitle}({orignalName})">{title} <small>{name}</small></a></dd>', args));

                }
            }

            if (filter) {
                segments.sort();
            }

            elem.innerHTML = segments.join('') || '<dd><small>无搜索结果</small></dd>';

            // 滚动到可见范围。
            if (!includeHeader || filter) {
                Doc.Page.moveActivedItem(elem);
            }

        },

        /**
         * 移动指定模块列表的高亮项。
         * @param {Element} elem 列表容器 DL 元素。
         * @param {Boolean} [down=true] 如果为 false 则向上翻否则向下。
         */
        moveActivedItem: function (elem, down) {
            // 只在存在列表项执行。
            if (elem.querySelector('dd a')) {
                var actived = elem.querySelector('dd.doc-list-actived'),
                    node;
                down = down !== false;

                // 删除之前的激活项并移动。
                if (actived) {
                    actived.className = '';
                    node = actived[down ? 'nextSibling' : 'previousSibling'];
                }

                // 确保当前是一个 <dd>
                while (true) {
                    if (node) {
                        if (node.tagName === 'DD') {
                            break;
                        }
                        node = node[down ? 'nextSibling' : 'previousSibling'];
                    } else {
                        node = elem[down ? 'firstChild' : 'lastChild']
                    }
                }

                node.className = 'doc-list-actived';
                Doc.Page.scrollActivedItemIntoView(elem);

            }
        },

        /**
         * 确保列表激活项在滚动可见范围内。
         */
        scrollActivedItemIntoView: function (elem, alignCenter) {
            var actived = elem.querySelector('.doc-list-actived a');
            if (actived) {
                var deltaY = actived.getBoundingClientRect().top - elem.getBoundingClientRect().top,
                    deltaHeight = elem.offsetHeight - actived.offsetHeight,
                    offsetY = alignCenter ? deltaHeight / 2 : 0;
                if (deltaY < 0 || deltaY > deltaHeight) {
                    elem.scrollTop += deltaY - (deltaY < 0 ? offsetY : deltaHeight - offsetY);
                }
            }
        },

        /**
         * 跳转到列表高亮项。
         */
        gotoActivedItem: function (elem) {
            if (elem = elem && elem.querySelector('.doc-list-actived a')) {
                location.href = elem.href;
            }
        },

        /**
         * 跳转到模块列表的高亮项。
         */
        onSuggestSubmit: function (suggestId) {
            Doc.Page.gotoActivedItem(document.getElementById(suggestId));
        },

        onSuggestInput: function (suggestId, filter, includeHeader) {
            Doc.Page.updateModuleList(document.getElementById(suggestId), includeHeader ? Doc.folder : 'demos', filter, includeHeader);
        },

        onSuggestKeyPress: function (suggestId, e) {
            if (e.keyCode === 40 || e.keyCode === 38) {
                e.preventDefault();
                Doc.Page.moveActivedItem(document.getElementById(suggestId), e.keyCode === 40);
            }
        },

        /**
         * 显示搜索下拉菜单。
         */
        showSearchSuggest: function (filter) {
            var suggest = document.getElementById('doc_search_suggest');
            if (!suggest) {
                suggest = document.getElementById('doc_search').appendChild(document.createElement('dl'));
                suggest.id = 'doc_search_suggest';
                suggest.className = 'doc-list';
                suggest.onmouseover = function (e) {
                    var target = e.target;
                    while (target != suggest && target.tagName !== 'DD') {
                        target = target.parentNode;
                    }
                    if (target != suggest) {
                        var actived = suggest.querySelector('.doc-list-actived');
                        if (actived) {
                            actived.className = '';
                        }
                        target.className = 'doc-list-actived';
                    }
                };
            }
            suggest.style.display = '';
            Doc.Page.updateModuleList(suggest, 'demos', filter, false);
        },

        hideSearchSuggest: function () {
            var suggest = document.getElementById('doc_search_suggest');
            if (suggest) {
                setTimeout(function () {
                    suggest.style.display = 'none';
                }, 300);
            }
        },

        // #endregion

        // #region 其它页面交互

        toggleFavorites: function (button) {
            if (window.localStorage) {
                var favorates = localStorage.doc_favorites ? localStorage.doc_favorites.split(';') : [];
                if (favorates.indexOf(Doc.path) < 0) {
                    favorates.push(Doc.path);
                    button.innerHTML = '<span class="doc-icon">★</span>已收藏';
                } else {
                    favorates.splice(favorates.indexOf(Doc.path), 1);
                    button.innerHTML = '<span class="doc-icon">✰</span>收藏';
                }
                localStorage.doc_favorites = favorates.join(';');
            }
        },

        gotoTop: function () {
            var srcollElement = document.documentElement,
                step;
            if (!srcollElement.scrollTop) {
                srcollElement = document.body;
            }
            var step = srcollElement.scrollTop / 5;
            function moveNext() {
                srcollElement.scrollTop -= step;
                if (srcollElement.scrollTop > 0) {
                    setTimeout(moveNext, 20);
                }
            }
            moveNext();
        },

        movePage: function (down) {
            var list = document.getElementById('doc_sidebar_list');
            Doc.Page.moveActivedItem(list, down);
            Doc.Page.gotoActivedItem(list);
        },

        // #endregion

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
        }

    };

    Doc.Page.init();

}

// #region trace

/**
 * Print variables to console.
 * @param {Object} ... The variable list to print.
 */
function trace() {
    // Enable to disable all trace calls.
    if (!trace.disabled) {

        // If no argument exists. Use (trace: id) instead
        // For usages like: callback = trace;
        if (!arguments.length) {
            trace.$count = trace.$count || 0;
            return trace('(trace: ' + trace.$count++ + ')');
        }

        // Use console if available.
        if (window.console) {

            // Check console.debug
            if (typeof console.debug === 'function') {
                return console.debug.apply(console, arguments);
            }

            // Check console.log
            if (typeof console.log === 'function') {
                return console.log.apply(console, arguments);
            }

            // console.log.apply is undefined in IE 7/8.
            if (console.log) {
                return console.log(arguments.length > 1 ? arguments : arguments[0]);
            }

        }

        // Fallback to call trace.write, which calls window.alert by default.
        return trace.write.apply(trace, arguments);

    }
}

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
            return deep >= 3 ? obj.toString().replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
                return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
            }) : "function() { ... }";

        case "object":
            if (obj == null) return "null";
            if (deep < 0) return obj.toString();

            if (typeof obj.length === "number") {
                var r = [];
                for (var i = 0; i < obj.length; i++) {
                    r.push(trace.inspect(obj[i], ++deep));
                }
                return showArrayPlain ? r.join("   ") : ("[" + r.join(", ") + "]");
            } else {
                if (obj.setInterval && obj.resizeTo) return "window#" + obj.document.URL;

                if (obj.nodeType) {
                    if (obj.nodeType == 9) return 'document ' + obj.URL;
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
        default:
            return String(obj);
    }
};

/**
 * Print a log to console.
 * @param {String} message The message to print.
 * @type Function
 */
trace.log = function (message) {
    if (!trace.disabled && window.console && console.log) {
        return console.log(message);
    }
};

/**
 * Print a error to console.
 * @param {String} message The message to print.
 */
trace.error = function (message) {
    if (!trace.disabled) {
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
    if (!trace.disabled) {
        return window.console && console.warn ? console.warn(message) : trace("[WARNING]", message);
    }
};

/**
 * Print a inforation to console.
 * @param {String} message The message to print.
 */
trace.info = function (message) {
    if (!trace.disabled) {
        return window.console && console.info ? console.info(message) : trace("[INFO]", message);
    }
};

/**
 * Print all members of specified variable.
 * @param {Object} obj The varaiable to dir.
 */
trace.dir = function (obj) {
    if (!trace.disabled) {
        if (window.console && console.dir)
            return console.dir(obj);
        else if (obj) {
            var r = "", i;
            for (i in obj)
                r += i + " = " + trace.dump(obj[i], 1) + "\r\n";
            return trace(r);
        }
    }
};

/**
 * Clear console if possible.
 */
trace.clear = function () {
    return window.console && console.clear && console.clear();
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
