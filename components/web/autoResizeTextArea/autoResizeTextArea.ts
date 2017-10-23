/**
 * 让文本域随输入内容自动调整高度。
 * @param elem 文本域元素。
 */
export default function autoResizeTextArea(elem: HTMLElement) {
    const min = elem.offsetHeight;
    function autoResize() {
        elem.style.height = "auto";
        elem.style.height = Math.max(min, elem.scrollHeight) + "px";
    }
    elem.style.overflow = "hidden";
    elem.addEventListener("keydown", autoResize, false);
    elem.addEventListener("input", autoResize, false);
    elem.addEventListener("keyup", autoResize, false);
    autoResize();
}
