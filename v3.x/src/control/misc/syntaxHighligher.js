/**
 * @author xuld
 */

/**
 * 提供语法高亮功能。
 */
var SyntaxHighligher = {

    /**
     * 所有可用的语法定义。
     */
    languages: {
        'c-like': [
            {
                pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
                matchRest: true,
                type: 'comment'
            },
            {
                pattern: /(^|[^\\:])\/\/.*/,
                matchRest: true,
                type: 'comment'
            },
            {
                pattern: /("|')(\\[\s\S]|(?!\1)[^\\\r\n])*\1/,
                type: 'string'
            },
            {
                pattern: /(?:(class|interface|extends|implements|trait|instanceof|new)\s+)[\w\$\.\\]+/,
                type: 'class-name'
            },
            {
                pattern: /\b[A-Z](\b|[a-z])/,
                type: 'class-name'
            },
            {
                pattern: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
                type: 'keyword'
            },
            {
                pattern: /\b(true|false|null)\b/,
                type: 'const'
            },
            {
                pattern: /[a-z0-9_]+\(/i,
                type: 'function',
                inside: {
                    pattern: /\(/,
                    type: 'punctuation'
                }
            },
            {
                pattern: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/,
                type: 'number'
            },
            {
                pattern: /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/,
                type: 'operator'
            },
            {
                pattern: /&(lt|gt|amp);/i
            },
            {
                pattern: /[{}[\];(),.:]/,
                type: 'punctuation'
            }
        ]
    },

    /**
     * 高亮单一的节点。
     * @param {Element} elem 要高亮的节点。
     * @param {String} [language] 高亮的语法。系统会自动根据源码猜测语言。
     */
    one: function (element, language) {

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
        return SyntaxHighligher._stringify(SyntaxHighligher._tokenize(text, SyntaxHighligher.languages[language] || []));
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
                    return proc(text, SyntaxHighligher.languages[grammar], tokens);
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
                    if (grammar.inside) {
                        content = proc(content, grammar.inside, t = []);
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
                    segments.push('<span class="x-code-plain">', token, '</span>');
                } else {
                    segments.push('<span class="x-code-', token.type || 'plain', '">');
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
