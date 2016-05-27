

/**
 * 复制文本到系统剪贴板。
 * @param {String} content 要复制的内容。
 * @returns {Boolean} 是否成功。
 * @example copyText("文本")
 */
function copyText(content) {
	// IE：目前只有 IE 支持此接口。
	if(window.clipboardData) {
		window.clipboardData.setData("Text", content);
		return true;
	}
	return false;
}
