
/**
 * 动态载入一个图片。
 * @param {String} url 加载图片的路径。
 * @param {Function} [callback] 载入成功的回调函数。函数参数为：
 * * @example {String} url 加载的图片文件路径。
 * @example loadImage("../../assets/resources/100x100.png")
 */
function loadImage(url, callback) {
    var image = new Image();
    if (callback) {
        image.onload = function () {
            callback(url);
        };
    }
    image.src = url;
    return image;
}

// #region @loadImages

/**
 * 动态载入全部图片。
 * @param {Array} url 加载图片的路径。
 * @param {Function} callback 载入成功的回调函数。函数参数为：
 * * @example {Array} url 加载的图片文件路径。
 * @example loadImages(["../../assets/resources/100x100.png"])
 */
function loadImages(urls, callback) {
    for (var i = 0, leftCount = urls.length; i < urls.length; i++) {
        loadImage(urls[i], callback && function () {
            if (--leftCount <= 0) {
                callback(urls);
            }
        });
    }
}

// #endregion
