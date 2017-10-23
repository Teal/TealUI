/**
 * 获取元素的外部 HTML。
 * @param elem 元素。
 * @return 返回外部 HTML。
 */
export function getOuterHTML(elem: HTMLElement) {
    const p = elem.ownerDocument.createElement(elem.parentNode ? elem.parentNode.nodeName : "div");
    p.appendChild(elem.cloneNode(true));
    return p.innerHTML;
}

/**
 * 设置元素的外部 HTML。
 * @param elem 元素。元素必须具有父节点。
 * @param value 要设置的外部 HTML。
 */
export function setOuterHTML(elem: HTMLElement, value: string) {
    if (elem.parentNode) {
        const p = elem.ownerDocument.createElement(elem.parentNode.nodeName);
        p.innerHTML = value;
        while (p.firstChild) {
            elem.parentNode.insertBefore(p.firstChild, elem);
        }
        elem.parentNode.removeChild(elem);
    }
}
