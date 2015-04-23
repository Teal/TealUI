/**
 * @author xuld
 */

/**
 * 预载入一个地址的资源。
 * @param {String} src 图片地址。
 */
function preload(src) {

    function loadNext() {

        if (preload.isLoading) {
            setTimeout(loadNext, 10);
            return;
        }

        if (!preload.loadings.length)
            return;

        preload.isLoading = true;
        var src = preload.loadings.shift(),
            img = document.createElement('img');
        img.src = src;
        img.onload = img.onerror = function () {
            img = img.onload = img.onerror = img.src = null;
            preload.isLoading = false;
        };
    }

    preload.loadings = preload.loadings || [];
    preload.loadings.push(src);
    loadNext();
}

