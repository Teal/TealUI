/**
 * @author xuld
 */

typeof include === "function" && include("scrollShow");

/**
 * 懒加载图片。
 * @param {Function} [callback] 滚动到当前指定节点时的回调。函数参数为：
 * * @this {Element} 引发事件的节点。
 * * @param {Event} e 发生的事件对象。
 * * @param {Image} proxy 用于代理载入图片的节点。
 * * @returns {String} 返回实际载入的图片路径。如果未指定则使用 `data-src` 属性指定的路径。
 * @param {Dom} [scrollParent=document] 滚动所在的容器。
 * @example $('img[data-src]').lazyLoad();
 */
Dom.prototype.lazyLoad = function(callback, scrollParent) {
    return this.scrollShow(function(e) {
        if (this._lazyLoaded) {
            return;
        }
        this._lazyLoaded = true;
        var proxy = new Image();
        proxy.src = callback && callback.call(this, e, proxy) || this.getAttribute("data-src");
        proxy.onload = (function(image) {
            return function() {
                image.src = proxy.src;
                Dom(image).show("opacity");
            };
        }(this));
    }, "once", scrollParent);
};