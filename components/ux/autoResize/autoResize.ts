/**
 * 令文本域随输入内容自动调整高度。
 * @param elem 要处理的文本域节点。
 */
export default function autoResize(elem: HTMLElement) {
    function autoResize() {
        elem.style.height = 'auto';
        elem.style.height = elem.scrollHeight + 'px';
    }
    elem.style.overflow = "hidden";
    elem.addEventListener("keydown", autoResize);
    elem.addEventListener("input", autoResize);
    elem.addEventListener("keyup", autoResize);
    autoResize();
}
