
/**
 * 表示一个资源动态载入器。
 */
var Loader = {

    /**
     * 动态载入一个脚本。
     * @param {String} url 加载 js 的路径。
     * @param {Function} callback 载入成功回调。
     */
    loadScript: function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        if (callback) {
            script.onload = script.onreadystatechange = function () {
                if (!script.readyState || script.readyState == "loaded" || script.readyState == "complete") {
                    script.onload = script.onreadystatechange = null;
                    callback(url);
                }
            };
        }
        return (document.getElementsByTagName("head")[0] || document.body).appendChild(script);
    },

    /**
     * 动态载入一个样式。
     * @param {String} url 加载 css 的路径。
     * @param {Function} callback 载入成功回调。
     */
    loadStyle: function (url, callback) {
        var link = document.createElement("link");
        link.rel = 'stylesheet';
        link.media = 'screen';
        link.type = 'text/css';
        link.href = url;
        if (callback) {
            link.onload = link.onreadystatechange = function () {
                if (!link.readyState || link.readyState == "loaded" || link.readyState == "complete") {
                    link.onload = link.onreadystatechange = null;
                    callback(url);
                }
            };
        }
        return (document.getElementsByTagName("head")[0] || document.body).appendChild(link);
    },

    /**
     * 动态载入一个图片。
     * @param {String} url 加载图片的路径。
     * @param {Function} callback 载入成功回调。
     */
    loadImage: function (url, callback) {
        var image = new Image();
        if (callback) {
            image.onload = function () {
                callback(url);
            };
        }
        image.src = url;
        return image;
    },

    /**
     * 动态载入全部图片。
     * @param {String} url 加载图片的路径。
     * @param {Function} callback 载入成功回调。
     */
    loadImages: function (urls, callback) {
        for (var i = 0, leftCount = urls.length; i < urls.length; i++) {
            Loader.loadImage(urls[i], callback && function() {
                if (--leftCount <= 0) {
                    callback(urls);
                }
            });
        }
    }

};
