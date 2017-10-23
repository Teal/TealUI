import { getScroll, setScroll, getRect, Size, getStyle, Point } from "web/dom";

/**
 * 滚动元素到指定的位置。
 * @param elem 元素或文档。
 * @param value 要滚动的目标坐标。允许只设置部分属性。
 * @param duration 滚动的动画时间。如果为 0 则不使用动画。
 * @param callback 滚动动画结束的回调函数。
 * @example scrollTo(document, {y: 400})
 */
export function scrollTo(elem: Element | Document, value: Partial<Point>, duration = 200, callback?: (value: Point) => void) {
    const start = getScroll(elem);
    let last = start;
    if (duration === 0) {
        setScroll(elem, value);
    } else if (value.x != null || value.y != null) {
        const deltaX = value.x! - start.x;
        const deltaY = value.y! - start.y;
        const maxCount = duration / 20;
        let count = 0;
        const step = () => {
            value = getScroll(elem);
            if (value.x === last.x && value.y === last.y) {
                if (deltaX) {
                    value.x = start.x + (1 - (1 - count / maxCount) ** 3) * deltaX;
                }
                if (deltaY) {
                    value.y = start.y + (1 - (1 - count / maxCount) ** 3) * deltaY;
                }
                setScroll(elem, value);
                if (count++ < maxCount) {
                    last = getScroll(elem);
                    setTimeout(step, 20);
                } else {
                    callback && callback(last);
                }
            }
        };
        step();
        return;
    }
    callback && callback(last);
}

/**
 * 滚动元素指定的偏移量。
 * @param elem 要滚动的元素或文档。
 * @param value 要滚动的距离坐标。允许只设置部分属性。
 * @param duration 滚动的动画时间。如果为 0 则不使用动画。
 * @param callback 滚动动画结束的回调函数。
 * @example scrollBy(document, {y: 400})
 */
export function scrollBy(elem: Element | Document, value: Partial<Point>, duration?: number, callback?: (value: Point) => void) {
    const scroll = getScroll(elem);
    if (value.x != null) scroll.x += value.x;
    if (value.y != null) scroll.y += value.y;
    scrollTo(elem, scroll, duration, callback);
}

/**
 * 获取元素的滚动区域大小。
 * @param elem 要获取的元素或文档。
 * @return 返回一个大小。
 * @example scrollSize(document.body)
 */
export function scrollSize(elem: Element | Document) {
    return {
        width: elem.nodeType === 9 ? Math.max((elem as Document).documentElement.scrollWidth || 0, (elem as Document).body.scrollWidth || 0, (elem as Element).clientWidth || 0) : (elem as Element).scrollWidth,
        height: elem.nodeType === 9 ? Math.max((elem as Document).documentElement.scrollHeight || 0, (elem as Document).body.scrollHeight || 0, (elem as Element).clientHeight || 0) : (elem as Element).scrollHeight
    } as Size;
}

/**
 * 判断指定元素是否在可见区域内。
 * @param elem 要判断的元素或文档。
 * @param scrollable 滚动的容器元素。
 * @param padding 判断是否在区域内的最小距离。
 * @return 如果元素部分或全部在可见区域内则返回 true，否则返回 false。
 * @example isScrollIntoView(document.body)
 */
export function isScrollIntoView(elem: Element | Document, scrollable: Element | Document = scrollParent(elem), padding = 0) {
    const container = getRect(scrollable);
    const rect = getRect(elem);
    const deltaY = rect.y - container.y;
    const deltaX = rect.x - container.x;
    return (deltaY < padding ? deltaY + rect.height > padding : deltaY < container.height) && (deltaX < padding ? deltaX + rect.width > padding : deltaX < container.width);
}

/**
 * 将元素滚动到可见区域。
 * @param elem 要滚动的元素或文档。
 * @param position 滚动的位置。
 * @param scrollable 滚动的容器元素。
 * @param duration 滚动的动画时间。如果为 0 则不使用动画。
 * @param offset 如果需要滚动则额外偏移的距离。
 * @param callback 滚动动画结束的回调函数。
 */
export function scrollIntoView(elem: Element | Document, position?: ScrollLogicalPosition, scrollable: Element | Document = scrollParent(elem), duration?: number, offset = 0, callback?: (value: Point) => void) {
    const container = getRect(scrollable);
    const rect = getRect(elem);
    const deltaY = rect.y - container.y;
    const deltaX = rect.x - container.x;
    const value = getScroll(scrollable);
    if (!position || position === "start" || position === "nearest" && deltaY <= (container.height - rect.height) / 2) {
        value.y += deltaY - offset;
    } else {
        value.y += deltaY - container.height + rect.height + offset;
        if (position === "center") {
            value.y += (container.height - rect.height) / 2;
        }
    }
    if (!position || position === "start" || position === "nearest" && deltaX <= (container.width - rect.width) / 2) {
        value.x -= -deltaX + offset;
    } else {
        value.x -= -deltaX + container.width - rect.width - offset;
        if (position === "center") {
            value.x += (container.width - rect.width) / 2;
        }
    }
    scrollTo(scrollable, value, duration, callback);
}

/**
 * 如果元素可见区域内则将元素滚动到可见区域。
 * @param elem 要滚动的元素或文档。
 * @param scrollable 滚动的容器元素。
 * @param padding 判断是否在区域内的最小距离。
 * @param offset 如果需要滚动则额外偏移的距离。
 * @param duration 滚动的动画时间。如果为 0 则不使用动画。
 * @param callback 滚动动画结束的回调函数。
 * @example scrollIntoViewIfNeeded(document.body)
 */
export function scrollIntoViewIfNeeded(elem: Element | Document, scrollable: Element | Document = scrollParent(elem), duration?: number, padding = 0, offset = 0, callback?: (value: Point) => void) {
    const container = getRect(scrollable);
    const rect = getRect(elem);
    const deltaY = rect.y - container.y;
    const deltaX = rect.x - container.x;
    const value = getScroll(scrollable);
    if (deltaY < padding) {
        value.y += deltaY - offset;
    } else if (deltaY + rect.height + padding > container.height) {
        value.y += deltaY - container.height + rect.height + offset;
    } else {
        delete value.y;
    }
    if (deltaX < padding) {
        value.x += deltaX - offset;
    } else if (deltaX + rect.width + padding > container.width) {
        value.x += deltaX - container.width + rect.width + offset;
    } else {
        delete value.x;
    }
    scrollTo(scrollable, value, duration, callback);
}

/**
 * 设置滚动到当前指定元素或文档时的回调。
 * @param elem 要绑定事件的元素或文档。
 * @param callback 滚动到当前指定元素时的回调。
 * @param once 是否只在第一次滚动时执行。
 * @param scrollable 滚动的容器元素。
 * @param padding 判断是否在区域内的最小距离。
 * @example scrollShow(document.body, () => { alert("hi"); })
 */
export function scrollShow(elem: Element | Document, callback: () => void, once = true, scrollable: Element | Document = scrollParent(elem), padding = 0) {
    const container = scrollable.nodeType === 9 ? (scrollable as Document).defaultView : scrollable;
    let inView = false;
    const handleScroll = () => {
        const oldInView = inView;
        if ((inView = isScrollIntoView(elem, scrollable, padding))) {
            if (!oldInView) {
                callback();
            }
            if (once) {
                container.removeEventListener("scroll", handleScroll, false);
            }
        }
    };
    container.addEventListener("scroll", handleScroll, false);
    handleScroll();
}

/**
 * 获取指定元素第一个可滚动的父元素。
 * @param elem 要搜索的元素。
 * @return 返回父元素。
 */
export function scrollParent(elem: Element | Document) {
    if (elem.nodeType !== 9) {
        while ((elem = elem.parentNode as Element) && elem.nodeType === 1 && !/^(?:auto|scroll)$/.test(getStyle(elem, "overflow")));
    }
    return elem;
}
