/**
 * @author xuld
 */

// #require dom/base.js

Dom.resize = function (callback, delay) {
    if (callback.constructor === Function) {
        var timer;
        Dom.on(window, 'resize', function(e) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function() {
                timer = 0;
                callback(e);
            }, delay || 200);
        });
        callback();
    } else {
        Dom.trigger(window, 'resize', callback);
    }
};
