/**
 * 让浏览器卡死（需要强制关闭进程）。
 * @example crashBrowser()
 */
export function crashBrowser() {
    while (1) (history.back as any)(-1);
}

/**
 * 让浏览器假死（页面内不响应，但允许关闭页面）。
 * @example delayBrowser()
 */
export function delayBrowser() {
    var s = "abcde";
    for (var i = 0; i < 21; i++) s += s;
    /a.*c.*f/.test(s);
}
