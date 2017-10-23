import * as dom from "web/dom";

/**
 * 判断元素是否和指定区域存在交集。
 * @param elem 元素。
 * @param container 要判断的容器元素或区域。
 * @param containerPadding 容器的内边距。即将元素和容器判定为相交时的最小的距离。
 * @return 如果元素和目标容器有任一交集则返回 true，否则返回 false。
 * @example within(elem, { x:0, y:0, width: 400, height: 500 });
 */
export default function within(elem: HTMLElement, container: HTMLElement | Document | dom.Rect, containerPadding = 0) {
    container = (container as HTMLElement | Document).nodeType ? dom.getRect(container as HTMLElement | Document) : container as dom.Rect;
    const rect = dom.getRect(elem);
    const deltaY = rect.y - container.y;
    const deltaX = rect.x - container.x;
    return (deltaY < containerPadding ? deltaY + rect.height >= containerPadding : deltaY <= container.height) && (deltaX < containerPadding ? deltaX + rect.width >= containerPadding : deltaX <= container.width);
}
