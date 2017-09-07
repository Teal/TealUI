import { show } from "ux/dom";
import { scrollShow } from "ux/scroll";

/**
 * 懒加载图片。
 * @param elem 要加载的图片。
 * @param url 加载的地址。
 * @param scrollParent 可滚动的元素。
 * @param callback 图片已加载的回调函数。
 * @example lazyLoad(img)
 */
export default function lazyLoad(elem: HTMLImageElement, url: string, scrollParent?: HTMLElement, callback?: () => void) {
    scrollShow(elem, () => {
        const proxy = new Image();
        proxy.src = url;
        proxy.onload = () => {
            elem.src = proxy.src;
            show(elem, "opacity");
            callback && callback();
        };
    }, true, scrollParent);
}
