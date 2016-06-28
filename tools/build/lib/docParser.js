/**
 * @fileOverview JsDoc 解析器
 * @descrition 解析 JsDoc 风格的文档注释。
 */
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
/**
 * 解析指定文本的文档注释。
 * @param text 包含所有源码的文本。
 * @param start 注释在源码内的开始位置。
 * @param end 注释在源码内的结束位置。
 * @returns {}
 */
function parseDocComment(text, start, end) {
}
exports.parseDocComment = parseDocComment;
//# sourceMappingURL=docParser.js.map