// #todo


/**
 * 动态载入一个 JavaScript 脚本。
 * @param {String} url 加载 JavaScript 文件的路径。
 * @param {Function} [callback] 载入成功的回调函数。函数参数为：
 * * @example {String} url 加载的 JavaScript 文件路径。
 * @return {Element} 返回用于载入脚本的 &lt;script&gt; 标签。
 * @example loadScript("../../assets/resources/ajax/test.js")
 */
function loadScript(url: string, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if (callback) {
        script.onload = script.onreadystatechange = function() {
            if (!script.readyState || script.readyState === "loaded" || script.readyState === "complete") {
                script.onload = script.onreadystatechange = null;
                callback(url);
            }
        };
    }
    return (document.getElementsByTagName("head")[0] || document.body).appendChild(script);
}