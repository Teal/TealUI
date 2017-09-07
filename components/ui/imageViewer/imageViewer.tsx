import { Control, VNode, bind } from "control";
import "./imageViewer.scss";

/**
 * 表示一个图片查看器。
 */
export class ImageViewer extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-imageviewer"></div>;
    }

}

export default ImageViewer;
// #todo

/**
 * @author xuld@vip.qq.com
 */

typeof include === "function" && include("dom/imagezoom.css");
typeof include === "function" && include("dom/dom.js");

Dom.imageZoom = function (elem, getUrlCallback) {

    Dom.addClass(elem, 'x-imagezoom-small');
    Dom.on(elem, 'click', function (e) {
        var oldState, data = Dom.data(this);

        if (Dom.hasClass(this, 'x-imagezoom-small')) {
            Dom.removeClass(this, 'x-imagezoom-small');
            Dom.addClass(this, 'x-imagezoom-large');
            if (getUrlCallback) {
                data.imageZoomSrc = this.src;
                this.src = getUrlCallback(this.src);
            } else {
                data.imageZoomWidth = Dom.getWidth(this);
                data.imageZoomHeight = Dom.getHeight(this);
                this.style.width = this.style.height = 'auto';
            }
        } else {
            Dom.addClass(this, 'x-imagezoom-small');
            Dom.removeClass(this, 'x-imagezoom-large');
            if (getUrlCallback) {
                this.src = data.imageZoomSrc;
            } else {
                Dom.setWidth(this, data.imageZoomWidth);
                Dom.setHeight(this, data.imageZoomHeight);
            }
        }
    });

};

Dom.prototype.imageZoom = function () {
    return;
};