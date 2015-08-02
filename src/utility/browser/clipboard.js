

/**
 * 复制文本到系统剪贴板。
 * @param {String} content 要复制的内容。
 * @returns {Boolean} 是否成功。
 * @example copyText("文本")
 */
function copyText(content) {
	
	// IE
	if(window.clipboardData) {
		window.clipboardData.setData("Text", content);
		return true;
	}
	
	return false;

}
