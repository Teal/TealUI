import * as dom from "ux/dom";

/**
 * 表示验证状态。
 */
export type Status = "error" | "warning" | "info" | "success" | null;

/**
 * 获取元素的状态。
 * @param elem 要获取的元素。
 * @param prefix CSS 类名前缀。
 * @return 返回状态。
 */
export function getStatus(elem: HTMLElement, prefix: string) {
    for (const state of ["error", "warning", "info", "success"]) {
        if (dom.hasClass(elem, `${prefix}${state}`)) {
            return state as Status;
        }
    }
    return null;
}

/**
 * 设置元素的状态。
 * @param elem 要设置的元素。
 * @param prefix CSS 类名前缀。
 * @param value 要设置的状态。
 */
export function setStatus(elem: HTMLElement, prefix: string, value: Status) {
    for (const state of ["error", "warning", "info", "success"]) {
        dom.removeClass(elem, `${prefix}${state}`);
    }
    if (value) {
        dom.addClass(elem, `${prefix}${value}`);
    }
}
