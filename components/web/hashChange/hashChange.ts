/**
 * 设置当前页面地址的哈希值改变事件的回调函数。
 * @param callback 要设置的回调函数。
 * @example hashChange(() => { console.log("哈希值改变为：" + hash()); })
 */
export default function hashChange(callback: () => void) {
    window.addEventListener("hashchange", callback, false);
    callback.call(window);

    // 并不是所有浏览器都支持 hashchange 事件，
    // 当浏览器不支持的时候，使用自定义的监视器，每隔 50ms 监听当前 hash 是否被修改。
    if (!("onhashchange" in window) || (document as any).documentMode < 8) {
        var currentHash = hash();
        setInterval(function () {
            const newHash = hash();
            if (currentHash !== newHash) {
                currentHash = newHash;
                callback();
            }
        }, 50);
    }
}

/**
 * 获取当前页面地址的哈希值（不含 # 号）。
 * @return 返回当前页面的哈希值（不含 # 号）。如果不存在则返回 null。
 * @example hash()
 */
export function hash() {
    const href = location.href;
    const index = href.indexOf("#");
    return index >= 0 ? href.substr(index + 1) : null;
}
