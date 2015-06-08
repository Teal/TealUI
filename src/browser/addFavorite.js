/**
 * @fileOverview 弹出添加到收藏夹对话框。
 * @author xuld
 */

/**
 * 打开添加收藏夹对话框。
 * @param {String} [title] 收藏的标题。默认为当前网页标题。
 * @param {String} [url] 收藏的地址。默认为当前网页地址。
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
            alert("添加收藏失败，请按 Ctrl+D 进行添加");
        }
    }
}
