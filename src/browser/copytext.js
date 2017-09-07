

/**
 * 复制文本到系统剪贴板。
 * @param {String} content 要复制的内容。
 * @return {Boolean} 是否成功。
 */
function copyText(content) {
	
	// IE
	if(window.clipboardData) {
		window.clipboardData.setData("Text", content);
		return true;
	}
	
	return false;

};