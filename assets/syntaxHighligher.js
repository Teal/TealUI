
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
            pre.className += ' doc-code-' + language;
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
