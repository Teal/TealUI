
include("browser/base.js");


/**
 * 打开添加收藏夹对话框。
 * @param {String} title 显示名。
 * @param {String} url 地址。
 * @return {Boolean} 是否成功。
 */
Browser.addFavorite = function (title, url) {
	title = title || document.title;
	url = url || location.href;
	if (window.sidebar) {
		window.sidebar.addPanel(title, url, '');
	} else if (window.external) {
	    window.external.addFavorite(url, title);
	} else {
	    return false;
	}
	return true;
};
	
/**
 * 打开设为主页对话框。
 * @param {String} url 地址。
 * @return {Boolean} 是否成功。
 */
Browser.setHomepage = function (url) {
	url = url || location.href;
	if (navigator.isIE) {
		document.body.style.behavior = "url(#default#homepage)";
		document.body.setHomePage(url);
	} else if (navigator.isFirefox) {
		if (window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); //解决执行命令的问题
			} catch (e) {
				alert("您使用的FireFox浏览器安全设置过高, 无法设置主页！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
				return false;
			}
		}
		Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).setCharPref("browser.startup.homepage", url);
	}
	return true;
};



