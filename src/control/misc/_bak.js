
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
                pattern: /^<\/?[^\s>\/]+/i,
                content: [
                    { pattern: /^<\/?/, type: 'punctuation' },
                    { pattern: /^[^\s>\/:]+:/, type: 'namespace' },
                    { type: 'tag-name' }
                ]
            },
            {
                pattern: /=(?:('|")[\s\S]*?(\1)|[^\s>]+)/i,
                type: 'attr-value',
                content: [{ pattern: /=|>|"|'/, type: 'punctuation' }]
            },
            { pattern: /\/?>/, type: 'punctuation' },
            {
                pattern: /[^\s>\/]+/,
                type: 'attr-name',
                content: [{ pattern: /^[^\s>\/:]+:/, type: 'namespace' }]
            }
        ],
        'html': [
            // 注释。
            { pattern: /<!--[\s\S]*?-->/, type: 'comment' },
            { pattern: /<\?.+?\?>/, type: 'prolog' },
            { pattern: /<!DOCTYPE.+?>/, type: 'doctype' },
            { pattern: /<!\[CDATA\[[\s\S]*?]]>/i, type: 'cdata' },

            // 节点。
            {
                pattern: /<\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
                content: [{
                    pattern: /<style[\s\S]*?>[\s\S]*?<\/style>/i,
                    content: [{
                        pattern: /<style[\s\S]*?>|<\/style>/i,
                        content: ['markup-tag']
                    }, 'css']
                }, {
                    pattern: /<script[\s\S]*text\/(html?|template|markdown)?>[\s\S]*?<\/script>/i,
                    content: [{
                        pattern: /<script[\s\S]*?>|<\/script>/i,
                        content: ['markup-tag']
                    }, 'html']
                }, {
                    pattern: /<script[\s\S]*?>[\s\S]*?<\/script>/i,
                    content: [{
                        pattern: /<script[\s\S]*?>|<\/script>/i,
                        content: ['markup-tag']
                    }, 'js']
                }, {
                    pattern: /^<\/?[^\s>\/]+/i,
                    type: 'tag',
                    content: ['markup-tag']
                }]
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
     * 高亮单一的节点。
     * @param {Element} elem 要高亮的节点。
     * @param {String} [language] 高亮的语法。系统会自动根据源码猜测语言。
     */
    one: function (element, language) {
        language = language || Doc.SyntaxHighligher.guessLanguage(element.textContent);
        element.innerHTML = Doc.SyntaxHighligher.highlight(element.textContent.replace(/^(?:\r?\n|\r)/, ''), language);
    },

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
     * 根据源码猜测对应的刷子。
     * @param {String} sourceCode 需要高亮的源码。
     * @returns {String} 返回一个语言名。
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
                if (!pattern) {
                    tokens.push({
                        type: grammar.type,
                        content: text,
                    });
                    return true;
                }
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
                    t = content;
                    if (grammar.content) {
                        proc(content, grammar.content, t = []);
                    }
                    tokens.push({
                        type: grammar.type,
                        content: t,
                    });

                    // 如果匹配的文本之后存在内容，则继续解析。
                    t = from + content.length;
                    if (t < text.length) {
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
                    token.type && segments.push(' class="doc-code-', token.type, '"');
                    segments.push('>');
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
