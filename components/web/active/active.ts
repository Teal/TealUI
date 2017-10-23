import * as dom from "web/dom";

/**
 * 获取列表中的元素的激活元素。
 * @param items 所有元素列表。
 * @param className 激活的 CSS 类名。
 * @return 返回激活的元素。如果不存在则返回 null。
 */
export function getActive(items: ArrayLike<HTMLElement>, className: string) {
    for (const item of items as any) {
        if (dom.hasClass(item, className)) {
            return item;
        }
    }
    return null;
}

/**
 * 设置列表中指定的元素为激活样式。
 * @param items 所有元素列表。
 * @param className 激活的 CSS 类名。
 * @param value 要激活的元素。如果为 null 则表示撤销已有的激活元素。
 */
export function setActive(items: ArrayLike<HTMLElement>, className: string, value: HTMLElement | null | undefined) {
    for (const item of items as any) {
        dom.toggleClass(item, className, item === value);
    }
}
