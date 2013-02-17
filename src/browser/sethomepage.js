/**
 * @author xuld
 */

/**
 * 打开设为主页对话框。
 * @param {String} url 地址。
 * @return {Boolean} 是否成功。
 */
function setHomepage(url) {
	url = url || location.href;
	
	if (document.body && document.body.setHomePage) {
		document.body.style.behavior = "url(#default#homepage)";
		document.body.setHomePage(url);
		return true;
	}
	
	return false;
}


