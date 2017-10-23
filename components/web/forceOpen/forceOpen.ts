/**
 * 在新窗口打开指定的地址，如果弹出窗口被阻止则等待下次点击后打开。
 * @param url 要打开的地址。
 * @example forceOpen("http://tealui.com/")
 */
export default function forceOpen(url: string) {
    if (!window.open(url)) {
        const open = () => {
            document.removeEventListener("click", open, false);
            window.open(url);
        };
        document.addEventListener("click", open, false);
    }
}
