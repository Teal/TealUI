/**
 * @fileOverview 弹出设置主页对话框。
 * @author xuld
 */

/**
 * 打开设为主页对话框。
 * @param {String} url 设置的地址。
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
