/**
 * 禁止右键菜单。
 * @param elem 相关的元素。
 */
export default function noContextMenu(elem: HTMLElement) {
    elem.addEventListener("contextmenu", e => e.preventDefault());
}
