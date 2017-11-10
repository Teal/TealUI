import { on } from "web/dom";

/**
 * 设置指针悬停时的回调函数。
 * @param elem 元素。
 * @param pointerEnter 指针移入后的回调函数。
 * @param pointerLeave 指针移出后的回调函数。
 * @param delay 触发事件延时执行的毫秒数。指针进入后指定时间内不触发函数。
 * @example hover(elem, () => console.log("进"), () => console.log("出"))
 */
export default function hover(elem: HTMLElement, pointerEnter?: (e: MouseEvent) => void, pointerLeave?: (e: MouseEvent) => void, delay = 30) {
    let timer: any;
    on(elem, "pointerenter", (e: MouseEvent) => {
        timer = setTimeout(() => {
            timer = 0;
            pointerEnter && pointerEnter(e);
        }, delay);
    });
    on(elem, "pointerleave", (e: MouseEvent) => {
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        } else {
            pointerLeave && pointerLeave(e);
        }
    });
}
