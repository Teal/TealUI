define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 编码 HTML 转义字符。
     * @param value 要编码的字符串。
     * @return 返回已编码的字符串。HTML 特殊字符 `&`、`<`、`>`、`'`、`"` 分别会被编码成 `&amp;`、`&lt;`、`&gt;`、`&#39;`、`&quot;`。
     * @example encodeHTML("<a></a>") // "&lt;a&gt;&lt;/a&gt;"
     */
    function encodeHTML(value) {
        return value.replace(/[&<>'"]/g, function (c) { return ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\'": "&#39;",
            '\"': "&quot;"
        }[c]); });
    }
    exports.encodeHTML = encodeHTML;
    /**
     * 编码 HTML 属性转义字符。
     * @param value 要编码的字符串。
     * @return 返回已编码的字符串。HTML 属性转义字符 `'`、`"` 分别会被编码成 `&#39;`、`&quot;`。
     * @example encodeHTMLAttribute("'") // "&#39;"
     */
    function encodeHTMLAttribute(value) {
        return value.replace(/['"]/g, function (c) { return ({
            "\'": "&#39;",
            '\"': "&quot;"
        }[c]); });
    }
    exports.encodeHTMLAttribute = encodeHTMLAttribute;
    /**
     * 解码 HTML 转义字符。
     * @param value 要解码的字符串。
     * @return 返回已解码的字符串。
     * @example decodeHTML("&lt;a&gt;&lt;/a&gt;") // "<a></a>"
     */
    function decodeHTML(value) {
        return value.replace(/&(#(\d+)|\w+);/g, function (_, word, unicode) { return unicode ? String.fromCharCode(+unicode) : ({
            "amp": "&",
            "lt": "<",
            "gt": ">",
            "quot": '\"'
        }[word] || word); });
    }
    exports.decodeHTML = decodeHTML;
    /**
     * 为 HTML 属性值添加引号。
     * @param value HTML 属性值。
     * @param quote 要添加的引号。
     * @return 返回含引号的 HTML 属性。属性值的引号会被编码。
     * @example escapeHTMLAttribute("a", '"') // "\"a\""
     */
    function wrapHTMLAttribute(value, quote) {
        var q = quote && quote.charCodeAt(0);
        return q === 34 /*"*/ ? '"' + value.replace(/"/g, "&quot;") + '"' :
            q === 39 /*'*/ ? "'" + value.replace(/'/g, "&#39;") + "'" :
                /[>\s="']/.test(value) ? wrapHTMLAttribute(value, value.indexOf('"') >= 0 && value.indexOf("\'") < 0 ? "\'" : '"') : value;
    }
    exports.wrapHTMLAttribute = wrapHTMLAttribute;
    /**
     * 删除 HTML 属性值的引号。
     * @param value 含引号的 HTML 属性。
     * @return 返回原始 HTML 属性值。属性值的 HTML 会被解码。
     * @example unescapeHTMLAttribute("'a'") // "a"
     */
    function unwrapHTMLAttribute(value) {
        return decodeHTML(value.replace(/^(['"])(.*)\1$/, "$2"));
    }
    exports.unwrapHTMLAttribute = unwrapHTMLAttribute;
});
//# sourceMappingURL=html.js.map