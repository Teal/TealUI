/**
 * @author xuld
 */

/**
 * 打开设为主页对话框。
 * @param {String} url 设置的地址。
 * @return {Boolean} 指示本次操作是否成功。
 */
function setHomePage(url) {
    try {
        document.body.style.behavior = "url(#default#homepage)";
        document.body.setHomePage(url || location.href);
    } catch (e) {
        alert("设置主页失败，请手动设置");
        // window.open("http://hao.360.cn/sub/sethomepage.html");
        // window.open("http://www.hao123.com/redian/sheshouyef.htm");
    }
}
