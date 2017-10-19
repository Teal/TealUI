
var Markdown = Markdown || require('./markdown.js');


/**
 * 所有支持的标签信息。
 */
var tags = {
    access: { type: 'text' },

    summary: { type: 'html' },

    params: { type: 'param' },
    param: { alias: 'params' },

    'type': { type: 'type' },

    'returns': { type: 'return' },
    'return': { alias: 'returns' },

    'exception': { type: 'exception' },
    'throws': { alias: 'throw' },
    'throw': { alias: 'exception' },

    'since': { type: 'text' },
    'version': { alias: 'since' },

    'property': { type: 'memberType' },
    'field': { type: 'memberType' },
    'function': { type: 'memberType' },
    'method': { type: 'memberType' },
    'event': { type: 'memberType' },
    'constructor': { type: 'memberType' },
    'category': { type: 'memberType' },
    'class': { type: 'memberType' },
    'namespace': { type: 'memberType' },

    name: { type: 'text' },
    memberOf: { type: 'text' },
    author: { type: 'text' },
    fileOverview: { type: 'html' },
    remark: { type: 'html' },

    example: { type: 'code' },
    sample: { alias: 'example' }
};

var lastDocComment;

/**
 * 解析源码并返回所有标记列表。
 */
function parseDoc(content) {
    var reader = new SourceReader(content);
    var docComments = getAllDocComments(reader);
    lastDocComment = null;
    return docComments;
}

/**
 * 获取源码中所有文档注释。
 */
function getAllDocComments(reader) {

    var docComments = [],
        docComment,
        lastPos,
        token = reader.readTo("///", "/**");

    // 提取所有注释原始信息。
    while (token) {

        if (token.content === "///") {
            reader.readTo("\n");
            hasSingleLineComments = true;
        } else {
            reader.readTo("*/");
        }

        // 保存当前文档注释内容。
        docComment = {
            type: token.content,
            line: token.line,
            col: token.col,
            indent: token.indent,
            content: reader.source.substring(token.pos, lastPos = reader.pos)
        };

        // 多读取 2 行文本，以便之后提取信息。
        while (token = reader.readTo("///", "/**", "\n")) {

            // 连续多个 /// 合并为一个注释。
            if (token.content === "///" && docComment.type === "///") {
                reader.readTo("\n");
                docComment.content += "\n" + reader.source.substring(token.pos, lastPos = reader.pos);
                continue;
            }

            // 继续读取一行。
            if (token.content === "\n") {
                token = reader.readTo("///", "/**", "\n");
            }
            break;
        }

        // 解析剩余部分。
        docComment.rest = reader.source.substring(lastPos + 1, (token || reader).pos).trim();
        docComment.content = (docComment.type === "///" ? docComment.content.replace(/^\s*\/\/\/ ?/gm, "") : docComment.content.substring("/**".length, docComment.content.length - "*/".length).replace(/^\s*\* ?/mg, "")).trim();
        docComment.tags = parseDocComment(docComment.content, docComment.rest);

        if (docComment.tags) {
            docComments.push(docComment);
        }

        // 跳过当前换行。
        if (token && token.content === "\n") {
            token = reader.readTo("///", "/**");
        }

    }

    return docComments;
}

/**
 * 解析一个文档注释。
 */
function parseDocComment(comment, rest) {
    var result = {
        memberOf: [],
        name: []
    };
    if (/^@/.test(comment)) comment = '\n' + comment;
    comment = comment.split(/\n\s*@/);
    var content = comment[0].trim();
    result.summary = [comment[0].trim()];
    for (var i = 1; i < comment.length; i++) {
        var match = /^(\w+)(\s+|$)/.exec(comment[i]) || ['', ''],
            tag = tags[match[1]] && tags[match[1]].alias || match[1];
        result[tag] = Object.prototype.hasOwnProperty.call(result, tag) ? result[tag] : [];
        result[tag].push(comment[i].substr(match[0].length).trim());
    }

    // 修复内置标签。
    for (var tag in result) {
        var tagInfo = tags[tag];
        if (tagInfo) {
            for (var i = 0; i < result[tag].length; i++) {
                var content = result[tag][i];

                switch (tagInfo.type) {

                    // 解析参数。
                    case 'param':
                        content = parseParam(content);
                        content.summary = parseMarkDown(content.summary);
                        break;

                    case 'return':
                    case 'exception':
                        content = parseType(content);
                        content.summary = parseMarkDown(content.summary);
                        break;

                    case 'html':
                        content = parseMarkDown(content);
                        break;

                    case "code":
                        content = parseCode(content);
                        break;

                    case "type":
                        content = content.replace(/^\{|\}$/g, "");
                        break;

                    case "memberType":
                        result.name = result.name || content;
                        result.memberType = tag;
                        break;

                }

                result[tag][i] = content;

            }

            switch (tagInfo.type) {
                case 'html':
                    result[tag] = result[tag].join('<br>');
                    break;
                case 'text':
                case "code":
                    result[tag] = result[tag].join('\n');
                    break;
                case 'return':
                    result[tag] = result[tag][result[tag].length - 1];
                    break;
                case "memberType":
                    delete result[tag];
                    break;
            }
        }
    }

    if (!result.access) {
        var access = [];
        if (result["public"]) {
            access.push("public");
        }
        if (result["protected"]) {
            access.push("protected");
        }
        if (result["private"]) {
            access.push("private");
        }
        if (access.length) {
            result.access = access.join(' ');
        }
    }

    // 从代码提取信息。
    if (rest) {
        var match = /(([$\w\.\s]+)\.)?\s*([$\w]+)\s*([:=])\s*(.*)/.exec(rest);
        if (match) {
            result.memberOf = result.memberOf || match[2];
            result.name = result.name || match[3];

            if (/^\d/.test(match[5])) {
                result.type = result.type || "Number";
            } else if (/^['"]/.test(match[5])) {
                result.type = result.type || "String";
            } else if (/^(true|false)\b/.test(match[5])) {
                result.type = result.type || "Boolean";
            } else if (/^(null\b|\{)/.test(match[5])) {
                result.type = result.type || "Object";
            } else if (/^\[/.test(match[5])) {
                result.type = result.type || "Array";
            } else if (/^new\s+Date\b/.test(match[5])) {
                result.type = result.type || "Date";
            } else if (/^\//.test(match[5])) {
                result.type = result.type || "RegExp";
            }

            if (match[4] === ':' && !result.memberOf && lastDocComment) {
                var lastName = lastDocComment.name;
                if (lastDocComment.memberType === 'class') {
                    lastName += '.prototype';
                }
                result.memberOf = lastName;
                if (lastDocComment.inner) {
                    result.inner = true;
                }
            }
        }

        match = /function\s+([$\w]+)\(/.exec(rest);
        if (match) {
            result.name = result.name || match[1];
        }
    }

    if (result.memberOf == "window") {
        result.memberOf = "";
    }

    // 为对象持有者忽略注释。
    if ((result.memberType === 'class' || result.memberType === 'namespace' || result.memberType === 'interface') && /^[A-Z]/.test(result['name']) && !result['memberOf']) {
        lastDocComment = result;
        return null;
    }

    if (result['inner'] || (!result['name'])) {
        return null;
    }

    if (result.memberType == "constructor") {
        result.name = result.memberOf.replace(/\.prototype$/, "");
        result.memberOf = "";
    }

    for (var key in result) {
        if (!result[key]) {
            delete result[key];
        }
    }

    return result;
}

function parseParam(content) {
    var match = /^(\{([^\}]*)\})?\s*((\w+)|\[(\w+)(=([^\]]+))?\]|(\.+))?\s+/.exec(content) || [''],
        result = {};
    if (match[2]) result.type = match[2];
    if (match[4] || match[5] || match[8]) result.name = match[4] || match[5] || match[8];
    if (match[7]) result.defaultValue = match[7];
    if (match[5] || match[7]) result.optional = true;
    result.summary = content.substr(match[0].length);
    return result;
}

function parseType(content) {
    var match = /^(\{([^\}]*)\})?\s+/.exec(content) || [''],
        result = {};
    if (match[2]) result.type = match[2];
    result.summary = content.substr(match[0].length);
    return result;
}

/**
 * 解析 markDown 为 HTML。
 */
function parseMarkDown(content) {

    // 解析内联 @param 和 @returns 标签
    content = content.replace(/^\*\s*@(\w+)\s+([^\n*]*)$/gm, function (all, type, args) {
        var parsed;
        if (type === 'param') {
            parsed = parseParam(args);
        } else if (type === 'returns') {
            parsed = parseType(args);
            parsed.name = '返回值';
        } else if (type === 'this') {
            parsed = parseType(args);
            parsed.name = '<strong>this</strong>';
        } else if (type === 'field') {
            parsed = parseType(args);
        } else {
            return all;
        }

        var result = ' - '
        if (parsed.name) result += parsed.name + ': ';
        if (parsed.type) result += '`' + parsed.type + '` ';
        result += parsed.summary;
        if (parsed.defaultValue) result += '(默认：' + parsed.defaultValue + '）';
        return result;
    });

    // 解析内部 @标签
    content = content.replace(/{@(link)\s+([^}]*)\}/g, function (_, key, value) {
        return '<a href="' + value + '" target="_blank">' + value + '</a>';
    });
    content = content.replace(/@(null|true|false|undefined|this)/g, "<strong>$1</strong>");
    content = content.replace(/@([\w$\.\#]+)/g, "<em>$1</em>");

    content = Markdown.toHTML(content);
    content = content.replace(/<blockquote>(\s*<h\d>)?\!/g, '<blockquote class="doc-note">$1');

    return content;
}

function parseCode(content) {
    content = content.replace(/^([^\n#=\-][^\n]*)$/gm, "<pre>$1</pre>").replace(/<\/pre>\n<pre>/g, "\n");
    content = parseMarkDown(content);
    content = content.replace(/<pre><code>/ig, "<pre>").replace(/<\/code><\/pre>/ig, "<\/pre>")
    return content;
}

/**
 * 表示一个源码读取器。
 */
function SourceReader(source) {
    this.source = source.replace(/\r\n?/g, "\n");
    this.line = this.col = 1;
    this.indent = 0;
    this.pos = -1;
}

SourceReader.prototype = {

    tabSize: 4,

    /**
     * 读取下一个字符。
     */
    read: function () {
        var ch = this.source.charAt(++this.pos);

        // 如果读到 \r 或 \n
        if (ch === '\n') {
            this.line++;
            this.col = 1;
            this.indent = 0;
        } else if (ch === ' ') {
            this.indent++;
        } else if (ch === '\t') {
            this.indent += this.tabSize;
        }
        return ch;
    },

    /**
     * 预览紧跟的字符。
     */
    peek: function (peekCount) {
        return this.source.substr(this.pos, peekCount || 1);
    },

    /**
     * 读取文本直到出现指定字符。
     * @returns {Object} 返回结果对象。
     * - content
     * - line
     * - col
     * - pos
     */
    readTo: function () {
        var ch;
        while (ch = this.read()) {
            for (var i = 0, content, result; i < arguments.length; i++) {
                content = arguments[i];
                if (ch === content.charAt(0) && this.peek(content.length) === content) {
                    result = {
                        content: content,
                        line: this.line,
                        col: this.col,
                        indent: this.indent,
                        pos: this.pos
                    };

                    // 读取标记所在字符。
                    while (this.pos < result.pos + content.length - 1)
                        this.read();

                    return result;
                }
            }
        }
    }

};


// 判断当前系统是否在后台运行。
if (typeof exports === 'object') {
    exports.parseDoc = parseDoc;
}
