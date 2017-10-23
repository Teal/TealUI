/**
 * 切换全屏状态。
 * @param elem 要全屏展示的元素。
 * @return 如果已进入全屏模式则返回 true，如果已退出全屏模式则返回 false。如果浏览器不支持全屏操作则返回 undefined。
 */
export default function toggleFullScreen(elem = document.documentElement) {
    if (document.fullscreenElement || (document as any).mozFullScreenElement || document.webkitFullscreenElement || (document as any).msFullscreenElement) {
        const func = document.exitFullscreen || (document as any).msExitFullscreen || (document as any).mozCancelFullScreen || document.webkitExitFullscreen;
        if (func) {
            func.call(document);
            return false;
        }
    } else {
        const func = elem.requestFullscreen || (elem as any).msRequestFullscreen || (elem as any).mozRequestFullScreen || elem.webkitRequestFullscreen;
        if (func) {
            func.call(elem, (Element as any).ALLOW_KEYBOARD_INPUT);
            return true;
        }
    }
}
