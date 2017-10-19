define(["require", "exports", "util/pinyin", "util/html"], function (require, exports, pinyin_1, html_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 模糊搜索一个列表（支持拼音）。
     * @param inputs 被搜索的所有列表项。
     * @param search 要搜索的内容。
     * @param markStart 用于标记匹配开始的标记。
     * @param markEnd 用于标记匹配结束的标记。
     * @param encoder 用于编码源内容的回调函数。源内容被编码后可以避免将内容和匹配标记混淆。
     * @param cache 如果提供了缓存对象则可以加速第二次搜索的速度。
     * @return 返回所有的匹配项组成的数组。每个匹配项是一个包含所有匹配起止位置的数组，并附加了以下属性：
     * - r：当前匹配项最终拼接后的文本内容。
     * - index：当前匹配项在源列表的索引。
     * @example searchPinYin(["ab", "b"], "a") // [ {r: "<mark>a</mark>b", index: 0, length: 1, 0: {start: 0, end: 1, level: 1}} ]
     */
    function searchPinYin(inputs, search, markStart, markEnd, encoder, cache) {
        if (markStart === void 0) { markStart = "<mark>"; }
        if (markEnd === void 0) { markEnd = "</mark>"; }
        if (encoder === void 0) { encoder = html_1.encodeHTML; }
        if (cache === void 0) { cache = { __proto__: null }; }
        search = search.trim().toLowerCase();
        var r = [];
        for (var i = 0; i < inputs.length; i++) {
            var m = matchPinYin(inputs[i], search, cache);
            if (m.length) {
                m.index = i;
                m.r = formatMatch(inputs[i], m, markStart, markEnd, encoder);
                r.push(m);
            }
        }
        r.sort(compare);
        return r;
    }
    exports.default = searchPinYin;
    /**
     * 获取单个内容的拼音匹配结果。
     * @param input 被匹配的内容。
     * @param pattern 要匹配的模式。
     * @param cache 如果提供了缓存对象则可以加速第二次匹配的速度。
     * @return 返回包含所有匹配起止位置的数组。如果不匹配则返回空数组。
     * @example matchPinYin("ab", "a") // [{start: 0, end: 1, level: 1}]
     */
    function matchPinYin(input, pattern, cache) {
        if (cache === void 0) { cache = { __proto__: null }; }
        var info = cache[input];
        if (!info) {
            cache[input] = info = {
                chars: [],
                pinyins: []
            };
            input = input.toLowerCase();
            for (var i = 0; i < input.length; i++) {
                info.chars.push(input.charCodeAt(i));
                info.pinyins.push(pinyin_1.getPinYinOfChar(input.charAt(i)));
            }
        }
        var r = [];
        next: for (var i = 0; i < info.chars.length; i++) {
            var charIndex = i;
            var patternIndex = 0;
            var level = 0;
            while (patternIndex < pattern.length) {
                if (charIndex >= info.chars.length) {
                    continue next;
                }
                if (info.chars[charIndex] === pattern.charCodeAt(patternIndex)) {
                    patternIndex++;
                    level++;
                }
                else {
                    var matchCount = void 0;
                    for (var _i = 0, _a = info.pinyins[charIndex]; _i < _a.length; _i++) {
                        var pinyin = _a[_i];
                        matchCount = searchStart(pinyin, pattern, patternIndex);
                        if (matchCount) {
                            patternIndex += matchCount;
                            break;
                        }
                    }
                    if (!matchCount) {
                        continue next;
                    }
                }
                charIndex++;
            }
            r.push({ level: level, start: i, end: charIndex });
            i = charIndex;
        }
        return r;
    }
    exports.matchPinYin = matchPinYin;
    /**
     * 搜索字符串和指定子字符串的相同前缀字符数。
     * @param value 被搜索的字符串。
     * @param child 要搜索的子字符串。
     * @param childIndex 子字符串中开始搜索的索引。
     * @return 返回最大匹配的字符数。如果无匹配则返回 0。
     * @internal
     */
    function searchStart(value, child, childIndex) {
        var r = 0;
        while (r < value.length && childIndex + r < child.length && value.charCodeAt(r) === child.charCodeAt(childIndex + r)) {
            r++;
        }
        return r;
    }
    exports.searchStart = searchStart;
    /**
     * 比较两个匹配结果。
     * @param result1 要比较的第一个结果。
     * @param result2 要比较的第二个结果。
     * @return 如果 result1 更匹配则返回 -1，如果 result2 更匹配则返回 1，如果 result1 和 result2 匹配度相当则返回 0。
     */
    function compare(result1, result2) {
        if (result1.length && result2.length && result1[0].start !== result2[0].start) {
            return result2[0].end - result1[0].end;
        }
        return result2.length - result1.length;
    }
    /**
     * 格式化匹配结果为一个字符串。
     * @param input 被匹配的内容。
     * @param matchResult 包含所有匹配起止位置的数组。
     * @param markStart 用于标记匹配开始的标记。
     * @param markEnd 用于标记匹配结束的标记。
     * @param encoder 用于编码源内容的回调函数。源内容被编码后可以避免将内容和匹配标记混淆。
     * @return 返回拼接后的文本内容。
     * @example matchPinYin("ab", [{start: 0, end: 1, level: 1}]) // "<mark>a</mark>b"
     */
    function formatMatch(input, matchResult, markStart, markEnd, encoder) {
        if (markStart === void 0) { markStart = "<mark>"; }
        if (markEnd === void 0) { markEnd = "</mark>"; }
        if (encoder === void 0) { encoder = html_1.encodeHTML; }
        for (var i = matchResult.length; i-- > 0;) {
            var match = matchResult[i];
            input = encoder(input.slice(0, match.start)) + markStart + encoder(input.slice(match.start, match.end)) + markEnd + (i === matchResult.length - 1 ? encoder(input.slice(match.end)) : input.slice(match.end));
        }
        return input;
    }
    exports.formatMatch = formatMatch;
});
//# sourceMappingURL=searchPinYin.js.map