/**
 * @author xuld
 */

/**
 * 懒加载图片。
 * @param {Function} [callback] 滚动到当前指定节点时的回调。
 * @param {Element} [scrollParent=document] 滚动所在的容器。
 */
Dom.prototype.lazyLoad = function (callback, scrollParent) {
    scrollParent = scrollParent || document;
    var images = this.slice(0),
        container = scrollParent.defaultView;

    container.addEventListener('scroll', scrollCallback, false)
    scrollCallback();

    function scrollCallback() {
        for (var i = images.length - 1, image; i >= 0; i--) {
            image = images[i];
            if (Dom(image).isScrollIntoView(scrollParent)) {
                var proxy = new Image();
                proxy.src = callback && callback(image, proxy) || image.getAttribute('data-src');
                proxy.onload = (function (image) {
                    return function () {
                        image.src = proxy.src;
                        Dom(image).show('opacity');
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
