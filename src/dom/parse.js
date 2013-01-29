/** * @author xuld */include("dom/base.js");

Dom.parseFix = (function () {
   
	var parseFix = {
		$default: navigator.isIE678 ? [2, '$<div>', '</div>'] : [1, '', ''],
		option: [2, '<select multiple="multiple">', '</select>'],
		legend: [2, '<fieldset>', '</fieldset>'],
		thead: [2, '<table>', '</table>'],
		tr: [3, '<table><tbody>', '</tbody></table>'],
		td: [4, '<table><tbody><tr>', '</tr></tbody></table>'],
		col: [3, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
		area: [2, '<map>', '</map>']
	};

	// 初始化 parseFix。
	parseFix.optgroup = parseFix.option;
	parseFix.tbody = parseFix.tfoot = parseFix.colgroup = parseFix.caption = parseFix.thead;
	parseFix.th = parseFix.td;

	return parseFix;
	
})();

/**
 * 解析一个 html 字符串，返回相应的原生节点。
 * @param {String/Element} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
 * @param {Element} context=document 生成节点使用的文档中的任何节点。
 * @param {Boolean} cachable=true 指示是否缓存节点。这会加速下次的解析速度。
 * @return {Element/TextNode/DocumentFragment} 如果 HTML 是纯文本，返回 TextNode。如果 HTML 包含多个节点，返回 DocumentFragment 。否则返回 Element。
 * @static
 */Dom.parse = function (html, context, cachable) {

};