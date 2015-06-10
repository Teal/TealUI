/** * @author xuld */

// #require scroll

/**
 * 懒加载指定节点内的图片。
 * @param {Function} [callback] 滚动到当前指定节点时的回调。
 * @param {Element} [scrollParent=document] 滚动所在的容器。
 */
Document.prototype.lazyLoad = Element.prototype.lazyLoad = function (callback, scrollParent) {
    var images = $('img[data-src]', this),
        container;

    scrollParent = scrollParent || (this.getScrollParent ? this.getScrollParent() : this);
    container = scrollParent.defaultView || scrollParent;
    container.addEventListener('scroll', scrollCallback, false)
    scrollCallback();

    function scrollCallback() {
        for (var i = images.length - 1, image; i >= 0; i--) {
            image = images[i];
            if (image.isScrollIntoView(document)) {
                var proxy = new Image();
                proxy.src = callback && callback(image, proxy) || image.getAttribute('data-src');
                proxy.onload = (function (image) {
                    return function () {
                        image.src = proxy.src;
                        image.show('opacity');
                    }
                }(image));
                image.removeAttribute('data-src');
                images.splice(i, 1);
            }
        }

        if (!images.length) {
            container.removeEventListener('scoll', scrollCallback, false);
        }

    }

};