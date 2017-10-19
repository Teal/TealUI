/**
 * @fileOverview 让浏览器卡死。
 * @author xuld
 */

/**
 * 让浏览器卡死，支持所有浏览器，信不信由你，反正我信了。
 * @example crashBrowser()
 */
function crashBrowser() {
	while (1) history.back(-1);
}
