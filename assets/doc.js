/**
 * @fileOverview 本文件提供仅供文档演示的相关代码，不是组件的一部分。
 * @author xuld
 */

/**
 * 提供文档演示的相关 API。
 */
var Doc = Doc || {};

// #region 配置

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
            pageTitle: '开始使用',
            pageDescription: '从零开始快速上手组件'
        },

        /**
         * 存放文档文件的文件夹。
         */
        demos: {
            path: 'src',
            pageName: '组件',
            pageTitle: '所有组件',
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

// #endregion

// #region 工具函数

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
     * 删除公共的缩进部分。
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

// #endregion

// #region 语法高亮

/**
 * 代码高亮模块。
 */
Doc.SyntaxHighligher = {

    /**
     * 所有可用的语法定义。
     */
    languages: {
        'markup-tag': [
            {
                pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
                type: 'attr-value',
                content: [{ pattern: /=|>|"/, type: 'punctuation' }]
            },
            { pattern: /\/?>/, type: 'punctuation' },
            {
                pattern: /[^\s>\/]+/,
                type: 'attr-name',
                content: [{ pattern: /^[^\s>\/:]+:/, type: 'namespace' }]
            },
            { pattern: /^<\/?/, type: 'punctuation' },
            { pattern: /^[^\s>\/:]+:/, type: 'namespace' }
        ],
        'html': [
            // 注释。
            { pattern: /<!--[\w\W]*?-->/, type: 'comment' },
            { pattern: /<\?.+?\?>/, type: 'prolog' },
            { pattern: /<!DOCTYPE.+?>/, type: 'doctype' },
            { pattern: /<!\[CDATA\[[\w\W]*?]]>/i, type: 'cdata' },

            // 节点。
            {
                pattern: /<\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
                content: [
                    {
                        pattern: /^<\/?[^\s>\/]+/i,
                        type: 'tag',
                        content: [
                            {
                                pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/i,
                                type: 'css',
                                content: [
                                    {
                                        pattern: /<style[\w\W]*?>|<\/style>/i,
                                        content: ['markup-tag']
                                    },
                                    'css'
                                ]
                            }, {
                                pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/i,
                                type: 'js',
                                content: [
                                    {
                                        pattern: /<script[\w\W]*?>|<\/script>/i,
                                        content: ['markup-tag']
                                    },
                                    'js'
                                ]
                            },
                            'markup-tag'
                        ]
                    },
                ]
            },
            { pattern: /&#?[\da-z]{1,8};/i, type: 'entity' }
        ],
        'css': [
            { pattern: /\/\*[\w\W]*?\*\//, type: 'comment' },
            {
                pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i, type: 'atrule', content: [
            { pattern: /[;:]/, type: 'punctuation' }]
            },
            { pattern: /url\((?:(["'])(\\\n|\\?.)*?\1|.*?)\)/i, type: 'url' },
            { pattern: /[^\{\}\s][^\{\};]*(?=\s*\{)/, type: 'selector' },
            { pattern: /("|')(\\\n|\\?.)*?\1/, type: 'string' },
            { pattern: /(\b|\B)[\w-]+(?=\s*:)/i, type: 'property' },
            { pattern: /\B!important\b/i, type: 'important' },
            { pattern: /[\{\};:]/, type: 'punctuation' },
            { pattern: /[-a-z0-9]+(?=\()/i, type: 'function' }
        ],
        'js': [
           { pattern: /(^|[^\\])\/\*[\s\S]*?\*\//, matchRest: true, type: 'comment' },
            { pattern: /(^|[^\\:])\/\/.*/, matchRest: true, type: 'comment' },
            { pattern: /("|')(\\[\s\S]|(?!\1)[^\\\r\n])*\1/, type: 'string' },
            { pattern: /(?:(class|interface|extends|implements|trait|instanceof|new)\s+)[\w\$\.\\]+/, type: 'class-name' },
            { pattern: /\b[A-Z](\b|[a-z])/, type: 'class-name' },
            { pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/, matchRest: true, type: 'regex' },
            { pattern: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/, type: 'keyword' },
            { pattern: /\b(true|false|null)\b/, type: 'const' },
            { pattern: /(?!\d)[a-z0-9_$]+(?=\()/i, type: 'function', content: { pattern: /\(/, type: 'punctuation' } },
            { pattern: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/, type: 'number' },
            { pattern: /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/, type: 'operator' },
            { pattern: /&(lt|gt|amp);/i },
            { pattern: /[{}[\];(),.:]/, type: 'punctuation' }
        ]
    },

    /**
     * 异步高亮单一的节点。
     * @param {Element} elem 要高亮的节点。
     * @param {String} [language] 高亮的语法。系统会自动根据源码猜测语言。
     */
    oneAsync: function (element, language) {
        if (window.Worker) {

        }
    },

    /**
     * 根据源码猜测对应的刷子。
     * @param {String} sourceCode 需要高亮的源码。
     * @return {String} 返回一个语言名。
     */
    guessLanguage: function (sourceCode) {
        // Treat it as markup if the first non whitespace character is a < and
        // the last non-whitespace character is a >.
        return /^\s*</.test(sourceCode) ? 'html' : /\w\s*\{/.test(sourceCode) ? 'css' : /=|\w\s+\w|\w\(|\)\./.test(sourceCode) ? 'js' : null;
    },

    /**
     * 对指定文本内容进行高亮，返回高亮后的 HTML 字符串。
     * @param {Element} text 要高亮的内容。
     * @param {String} [language] 高亮的语法。如果未指定系统会自动根据源码猜测语言。
     */
    highlight: function (text, language) {
        return Doc.SyntaxHighligher._stringify(Doc.SyntaxHighligher._tokenize(text, Doc.SyntaxHighligher.languages[language] || []));
    },

    /**
     * 将指定文本根据语法解析为标记序列。
     */
    _tokenize: function (text, grammars) {

        // 一次处理一段文本。
        function proc(text, grammars, tokens) {
            for (var i = 0, grammar, pattern, match, from, content, t; grammar = grammars[i]; i++) {

                // 如果语法本身是一个字符串则递归解析。
                if (grammar.constructor === String) {
                    return proc(text, Doc.SyntaxHighligher.languages[grammar], tokens);
                }

                // 尝试使用正则匹配。
                pattern = grammar.pattern;
                pattern.lastIndex = 0;
                if (match = pattern.exec(text)) {

                    // 记录匹配结果。
                    from = match.index;
                    content = match[0];

                    // 有些正则由于匹配了无关前缀，在这里重写为匹配末尾。
                    if (grammar.matchRest) {
                        t = match[1].length;
                        from += t;
                        content = content.substr(t);
                    }

                    // 如果匹配的文本之前存在内容，则继续解析。
                    if (from) {
                        proc(text.substr(0, from), grammars, tokens);
                    }

                    // 处理当前标记。
                    if (grammar.content) {
                        content = proc(content, grammar.content, t = []);
                    }
                    tokens.push({
                        type: grammar.type,
                        content: content,
                    });

                    // 如果匹配的文本之后存在内容，则继续解析。
                    t = from + content.length;
                    if (t > text.length) {
                        proc(text.substr(t), grammars, tokens);
                    }

                    // 符合任何一个正则则停止解析。
                    return true;
                }
            }

            // 当前文本不属于任何已知标记，直接存入标记队列。
            tokens.push(text);
            return false;
        }

        var tokens = [];
        proc(text, grammars, tokens);
        return tokens;
    },

    /**
     * 将指定标记序列合并为字符串。
     */
    _stringify: function (tokens) {

        function proc(tokens, segments) {
            for (var i = 0, token; token = tokens[i]; i++) {
                if (token.constructor === String) {
                    segments.push(token);
                } else {
                    segments.push('<span');
                    token.type && segments.push('class="doc-code-', token.type, '"');
                    segments.push('">');
                    if (token.content.constructor === String) {
                        segments.push(token.content);
                    } else {
                        proc(token.content, segments);
                    }
                    segments.push('</span>');
                }
            }
        }

        var segments = [];
        proc(tokens, segments);
        return segments.join('');

    }

};

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

    // #endregion

    // #region Page

    /**
     * 绘制页内已加载的所有代码块。
     */
    Doc.renderCodes = function (node) {

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
            })[language] : Doc.SyntaxHighligher.guessLanguage(content);

            if (!pre) {
                pre = document.createElement('pre');
                node.parentNode.insertBefore(pre, node.nextSibling);
            }

            // 插入代码域。
            Doc.Dom.addClass(pre, 'doc');
            Doc.Dom.addClass(pre, 'doc-code');
            pre.textContent = Doc.Utility.removeLeadingWhiteSpaces(content);

            // 插入工具条。
            var aside = document.createElement('aside'), button;
            aside.className = 'doc-code-toolbar doc-section';
            aside.innerHTML = (language == 'js' || (language == 'html' && node.tagName !== 'SCRIPT') ? '<a href="javascript://执行本代码" title="执行本代码">执行</a>' : '') + '<a href="javascript://编辑本代码" title="编辑本代码">编辑</a><a href="javascript://全选并复制本源码" title="全选并复制本源码">全选</a>';
            pre.parentNode.insertBefore(aside, pre);

            // 全选复制按钮。
            button = aside.lastChild;
            button.onclick = function () {
                var range = new Range(),
                    sel = getSelection();
                pre.focus();
                range.selectNode(pre);
                sel.removeAllRanges();
                sel.addRange(range);
            };

            // 检测flash 复制。
            if (location.protocol !== 'file:' && navigator.plugins && navigator.plugins["Shockwave Flash"]) {
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
                    execHtml(pre.textContent);
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
                    var range = new Range(),
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
     * 负责生成页面导航。
     */
    Doc.Page = {

        // #region 页面初始化

        titlePostfix: ' - TealUI | 轻量但完整的前端开源代码库',

        header: '<nav id="doc_topbar" class="doc-container doc-section doc-clear">\
                    <a href="{baseUrl}{indexUrl}" id="doc_logo">TealUI <small>{version}</small></a>\
                    <span id="doc_menu" class="doc-right">\
                        <input id="doc_menu_search" type="button" value="🔍" onclick="Doc.Page.showSidebar();" ontouchstart="this.click(); return false;" />\
                        <input id="doc_menu_navbar" type="button" value="≡" onclick="Doc.Page.toggleNavbar();" ontouchstart="this.click(); return false;" />\
                    </span>\
                    <ul id="doc_navbar">\
                        <li{actived:docs}><a href="{baseUrl}{folder:docs}/{indexUrl}">开始使用</a></li>\
                        <li{actived:demos}><a href="{baseUrl}{folder:demos}">所有组件</a></li>\
                        <li{actived:tools/customize}><a href="{baseUrl}{folder:tools}/customize/{indexUrl}">下载和定制</a></li>\
                        <li{actived:tools/devTools}><a href="{baseUrl}{folder:tools}/devTools/{indexUrl}">开发者工具</a></li>\
                    </ul>\
                    <form id="doc_search" class="doc-right">\
                        <input type="text" placeholder="搜索组件..." value="{search}" />\
                        <input type="submit" value="🔍" />\
                    </form>\
                </nav>\
                <header id="doc_header" class="doc-container doc-section">\
                    <h1>{current:pageTitle}</h1>\
                    <p>{current:pageDescription}</p>\
                </header>\
                <aside id="doc_sidebar">\
                    <input type="search" id="doc_list_filter" class="doc-section" placeholder=" 🔍 搜索{current:pageName}..." onkeydown="Doc.Page.onFilterKeyPress(event)" autocomplete="off" onchange="Doc.Page.filterList()" oninput="Doc.Page.filterList()" />\
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
                <aside id="doc_module_toolbar" class="doc-toolbar doc-right doc-section">\
                    {download:<a id="doc_module_toolbar_download" href="#" target="_blank">下载此组件</a>}\
                    {favorite:<a id="doc_module_toolbar_favorite" href="#" target="_blank">收藏</a>}\
                    <a id="doc_module_toolbar_fullscreen" href="{fullScreenUrl}" target="_blank">全屏</a>\
                </aside>\
                <h1>{title} <small>{path}</small></h1>\
                {summary:<blockquote class="doc-summary">#</blockquote>}',

        footer: '<div>\
                    <a href="{baseUrl}{folderDocs}/about/{indexUrl}">关于我们</a> |\
                    <a href="{baseUrl}{folderDocs}/about/license.html">开源协议</a> |\
                    <a href="https://github.com/Teal/TealUI/issues/new" target="_blank">问题反馈</a>\
                    <a href="{baseUrl}{folderDocs}/about/joinus.html">加入我们</a> |\
                </div>\
                &copy; 2011-2015 The Teal Team. All Rights Reserved.',

        /**
         * 初始化页面框架。
         */
        init: function () {

            //// 修复浏览器。
            //Doc.Dom.fixBrowser();

            // #region 初始化配置

            // 判断当前运行的框架。
            Doc.frame = (/[?&]frame=([^&]*)/i.exec(location.search) || [])[1] || document.documentElement.getAttribute("data-frame") || '';

            // 如果页面框架设置为无，则不再继续处理。
            if (Doc.frame == 'none') {
                return;
            }

            // 判断当前开发系统是否在本地运行。
            Doc.local = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '::1';

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

            // #endregion

            // #region 生成页面

            // 如果当前页面不是独立的页面。
            if (Doc.frame != "page") {

                // 载入 CSS 样式。
                var html = '<link type="text/css" rel="stylesheet" href="' + docJsPath.replace(/\.js\b/, '.css') + '" />';

                // 如果不是全屏模式，则生成页面主结构。
                if (Doc.frame != "fullscreen") {

                    var data = {
                        baseUrl: Doc.baseUrl,
                        version: Doc.Configs.version,

                        current: function (field) {
                            return Doc.Configs.folders[Doc.folder][field];
                        },

                        title: document.title,
                        path: Doc.path.replace(/\..*$/, ""),

                        fullScreenUrl: Doc.Utility.appendUrl(location.href, 'frame', 'fullscreen'),
                        indexUrl: location.protocol === 'file:' ? 'index.html' : '',

                        search: '',
                        shift: navigator.userAgent.indexOf('Firefox') >= 0 ? '+Shift' : '',

                        download: function (html) {
                            return Doc.folder == 'demos' ? html.replace('#', this.baseUrl + Doc.Configs.folders.tools + '/customize/' + this.indexUrl + '?module=' + Doc.path) : '';
                        },

                        favorite: function (html) {
                            return localStorage.doc_favorites && ~JSON.parse(localStorage.doc_favorites).indexOf(Doc.path) ? html.replace('>', ' class="doc-actived">已') : html;
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

                    // 载入列表。
                    Doc.Dom.loadScript(Doc.basePath + Doc.Configs.listsPath + '/' + Doc.Configs.folders[Doc.folder].path + '.js');

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

            }

            // #endregion

            // 插入百度统计代码。
            if (!Doc.local) {
                Doc.Dom.loadScript("http://hm.baidu.com/h.js?a37192ce04370b8eb0c50aa13e48a15b".replace('http:', location.protocol));
            }

            // 插入语法高亮代码。
            Doc.Dom.ready(Doc.renderCodes);

        },

        // #endregion

        // #region 页面交互

        /**
         * 在手机模式切换显示导航条。
         */
        toggleNavbar: function () {
            var menu = document.getElementById('doc_menu_navbar'),
                docNavbar = document.getElementById('doc_navbar'),
                height;

            if (menu.className) {
                menu.className = '';
                docNavbar.style.height = '';
            } else {
                menu.className = 'doc-menu-actived';
                docNavbar.style.height = 'auto';
                height = docNavbar.offsetHeight;
                docNavbar.style.height = '';
                docNavbar.offsetHeight;
                docNavbar.style.height = height + 'px';
            }

        },

        showSidebar: function () {

        },

        hideSidebar: function () {

        },

        showSearchSuggest: function () {
            var suggest = document.getElementById('doc_sidebar_suggest');
            if (!suggest) {
                suggest = document.createElement('dl');
                suggest.id = 'doc_sidebar_suggest';
                suggest.className = 'doc-list';
            }
            suggest.style.display = '';
        },

        updateSuggest: function () {

        },

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
        },

        initSearchBox: function (suggestInput) {

            suggestInput.onkeypress = function (e) {
                var keyCode = event.keyCode;
                if (keyCode === 40 || keyCode === 38) {
                    event.preventDefault();
                    Doc.Page.moveListActivedItem(keyCode === 38);
                } else if (keyCode === 13 || keyCode === 10) {
                    Doc.Page.gotoActivedItem();
                }
            };

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