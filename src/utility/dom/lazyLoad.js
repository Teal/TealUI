/**
 * @author xuld
 */

// #require base

/**
 * 懒加载图片。
 * @param {Function} [callback] 滚动到当前指定节点时的回调。
 * @param {Element} [scrollParent=document] 滚动所在的容器。
 */
Dom.prototype.lazyLoad = function (callback, scrollParent) {
    return this.scrollShow(function (e) {
        if (this._lazyLoaded) {
            return;
        }
        this._lazyLoaded = true;
        var proxy = new Image();
        proxy.src = callback && callback.call(this, e, proxy) || this.getAttribute('data-src');
        proxy.onload = (function (image) {
            return function () {
                image.src = proxy.src;
                Dom(image).show('opacity');
            }
        }(this));
    }, 'once', scrollParent);
};
