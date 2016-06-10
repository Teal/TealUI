/**
 * @fileOverview 弹出添加到收藏夹对话框。
 * @author xuld@vip.qq.com
 */

declare global {
    interface External { addFavorite(title: string, url: string): void }
}
declare var sidebar: { addPanel(title: string, url: string, id: string): void };

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
export function addFavorite(title = document.title, url = location.href) {
    try {
        external.addFavorite(url, title);
    } catch (e) {
        try {
            sidebar.addPanel(title, url, '');
        } catch (e2) {
            alert("请按 Ctrl + D 添加到收藏夹");
        }
    }
}

declare global {
    interface CSSStyleDeclaration { behavior: string; }
    interface HTMLElement { setHomePage(url: string): void; }
}

/**
 * 弹出设置主页对话框。
 * @param url 设置的地址。
 * @example 
 * #### 设置当前网页为主页
 * setHomePage()
 * 
 * #### 设置指定网页为主页
 * setHomePage("TealUI", "http://teal.github.io/TealUI")
 * 
 * @remark
 * > #### !注意
 * > 最新浏览器由于安全限制，不允许使用此功能。这时，函数会提示用户手动操作。
 */
export function setHomePage(url: string) {
    try {
        document.body.style.behavior = "url(#default#homepage)";
        document.body.setHomePage(url || location.href);
    } catch (e) {
        alert("请打开设置页进行设置");
        // 用户也可选择打开以下页面提示用户设置方法。
        // window.open("http://hao.360.cn/sub/sethomepage.html");
        // window.open("http://www.hao123.com/redian/sheshouyef.htm");
    }
}
