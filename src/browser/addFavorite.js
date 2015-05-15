/**
 * @author xuld
 */

/**
 * 打开添加收藏夹对话框。
 * @param {String} title 显示的网页名。
 * @param {String} url 收藏的地址。
 * @return {Boolean} 指示本次操作是否成功。
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
