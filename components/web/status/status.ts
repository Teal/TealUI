import * as dom from "web/dom";

/**
 * 表示一个状态。
 */
export type Status = "error" | "warning" | "info" | "success" | null | undefined;

/**
 * 获取元素的状态。
 * @param elem 元素。
 * @param classPrefix CSS 类名前缀。
 * @return 返回状态。
 */
export function getStatus(elem: HTMLElement, classPrefix: string) {
    for (const status of ["error", "warning", "info", "success"]) {
        if (dom.hasClass(elem, `${classPrefix}${status}`)) {
            return status as Status;
        }
    }
    return null;
}

/**
 * 设置元素的状态。
 * @param elem 元素。
 * @param classPrefix CSS 类名前缀。
 * @param value 要设置的状态。
 */
export function setStatus(elem: HTMLElement, classPrefix: string, value: Status) {
    for (const status of ["error", "warning", "info", "success"]) {
        dom.removeClass(elem, `${classPrefix}${status}`);
    }
    if (value != null) {
        dom.addClass(elem, `${classPrefix}${value}`);
    }
}
