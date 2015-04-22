/** * @author xuld *//** * 打开添加收藏夹对话框。 * @param {String} title 显示的网页名。 * @param {String} url 收藏的地址。 * @return {Boolean} 指示本次操作是否成功。 */function addToFavorite(title, url) {
    title = title || document.title;    url = url || location.href;    if (window.sidebar && sidebar.addPanel) {
        sidebar.addPanel(title, url, '');
    } else if (window.external && external.addFavorite) {
        external.addFavorite(url, title);
    } else {
        return false;
    }    return true;
}