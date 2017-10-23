/**
 * 禁止指定元素的浏览器默认右键菜单。
 * @param elem 元素。
 */
export default function noContextMenu(elem: HTMLElement | Document = document) {
    elem.addEventListener("contextmenu", e => e.preventDefault());
}
