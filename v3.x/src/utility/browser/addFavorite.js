/**
 * @fileOverview 弹出添加到收藏夹对话框。
 * @author xuld
 */

/**
 * 打开添加收藏夹对话框。
 * @param {String} [title] 收藏的标题。默认为当前网页标题。
 * @param {String} [url] 收藏的地址。默认为当前网页地址。
 * @example 
 * ##### 添加当前网页到收藏夹
 * addFavorite()
 * 
 * ##### 添加指定网页到收藏夹
 * addFavorite("TealUI", "http://teal.github.io/TealUI")
 * 
 * @remark
 * > #### !注意
 * > 最新浏览器由于安全限制，不允许使用此功能。这时，函数会提示用户手动操作。
 */
function addFavorite(title, url) {
    title = title || document.title;
    url = url || location.href;
    try {
        external.addFavorite(url, title);
    } catch (e) {
        try {
            sidebar.addPanel(title, url, '');
        } catch (e) {
            alert("请按 Ctrl+D 进行添加");
        }
    }
}
