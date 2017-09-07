/**
 * @file 固定布局
 *
 */

/**
 * 确保指定的元素固定在页面指定位置。
 * @param elem 要固定的节点。
 */
export function fixed(elem: HTMLElement) {
    var rect = elem.getBoundingClientRect();
    // var activeElemTagName = document.activeElement.tagName;
    elem.style.position = "absolute";
    elem.style.top = `100px`;
    elem.style.left = `${rect.left}px`;
    elem.style.right = `${rect.right}px`;
    elem.style.bottom = `${rect.bottom}px`;
}

export default fixed;
