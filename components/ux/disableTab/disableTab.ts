/**
 * 禁止 Tab 切换焦点，改为输入 Tab。
 * @param elem 相关的输入框。
 * @param tab 输入的 Tab 符号。
 */
export default function disableTab(elem: HTMLInputElement, tab = "\t") {
    elem.addEventListener("keydown", e => {
        if (e.keyCode == 9) {
            e.preventDefault();
            elem.ownerDocument.execCommand("insertHTML", false, tab);
        }
    });
}
