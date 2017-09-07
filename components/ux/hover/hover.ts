/**
 * 绑定鼠标移上后的操作。
 * @param elem 相关的元素。
 * @param mouseEnter 鼠标移入后的操作。
 * @param mouseLeave 鼠标移出后的操作。
 * @param delay 触发事件延时执行的毫秒数。鼠标进入后指定时间内不触发函数。
 * @example hover(elem, function(){ alert("鼠标进来了") }, function(){ alert("鼠标出去了") });
 */
export default function hover(elem: HTMLElement, mouseEnter?: (e: MouseEvent) => void, mouseLeave?: (e: MouseEvent) => void, delay = 30) {
    let timer: number;
    elem.addEventListener("mouseenter", e => {
        timer = setTimeout(() => {
            timer = 0;
            mouseEnter && mouseEnter(e);
        }, delay) as any;
    }, false);
    elem.addEventListener("mouseleave", e => {
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        } else {
            mouseLeave && mouseLeave(e);
        }
    }, false);
}
