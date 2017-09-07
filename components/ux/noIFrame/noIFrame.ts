/**
 * 如果页面被内嵌在 `<iframe>` 则代替主页面。
 */
export default function noIFrame() {
    if (self !== top) {
        (top as any).location = self.location;
    }
}
