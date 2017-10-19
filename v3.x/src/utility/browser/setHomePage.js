/**
 * @fileOverview 弹出设置主页对话框。
 * @author xuld
 */

/**
 * 打开设为主页对话框。
 * @param {String} [url] 设置的地址。
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
function setHomePage(url) {
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
