
/**
 * 动态载入一个 CSS 样式。
 * @param {String} url 加载 CSS 文件的路径。
 * @param {Function} [callback] 载入成功的回调函数。函数参数为：
 * * @example {String} url 加载的 CSS 文件路径。
 * @returns {Element} 返回用于载入脚本的 &lt;link&gt; 标签。
 * @example loadScript("../../assets/resources/ajax/test.css")
 */
function loadStyle(url, callback) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.media = "screen";
    link.type = "text/css";
    link.href = url;
    if (callback) {
        link.onload = link.onreadystatechange = function() {
            if (!link.readyState || link.readyState === "loaded" || link.readyState === "complete") {
                link.onload = link.onreadystatechange = null;
                callback(url);
            }
        };
    }
    return (document.getElementsByTagName("head")[0] || document.body).appendChild(link);
}
