/**
 * 禁用 TAB 切换焦点并改为输入。
 * @param elem 输入框元素。
 * @param tab 按下 TAB 键后要输入的内容。
 */
export default function disableTab(elem: HTMLInputElement, tab = "\t") {
    elem.addEventListener("keydown", e => {
        if (e.keyCode == 9) {
            e.preventDefault();
            elem.ownerDocument.execCommand("insertHTML", false, tab);
        }
    }, false);
}
