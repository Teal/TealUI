import { on, off } from "web/dom";

/**
 * 设置指针按住时的回调函数。
 * @param elem 相关的元素。
 * @param pointerDown 指针按下后的回调函数。
 * @param pointerUp 指针松开后的回调函数。
 * @param duration 当指针保持按下状态时持续触发按下事件的间隔时间。
 * @example active(elem, () => console.log("下"), () => console.log("上"))
 */
export default function active(elem: HTMLElement, pointerDown?: (e: MouseEvent) => void, pointerUp?: (e: MouseEvent) => void, duration = 50) {
    let timer: any;
    const handlePointUp = (e: MouseEvent) => {
        if (timer) {
            clearInterval(timer);
            timer = 0;
        }
        off(document, "pointerup", handlePointUp);
        pointerUp && pointerUp(e);
    };
    on(elem, "pointerdown", (e: MouseEvent) => {
        on(document, "pointerup", handlePointUp);
        if (pointerDown) {
            timer = setInterval(pointerDown, duration, e);
            pointerDown(e);
        }
    });
}
