/**
 * @author xuld
 * @fileOverview 提供 DOM 操作的辅助函数。
 */

/**
 * 基于 CSS 3 实现动画效果。
 * @param {Element} elem 要设置的节点。
 * @param {Function} callback 要设置的回调。
 * @param {Number} duration=300 指定特效的执行时间。
 */
Dom.animate = function (elem, to, duration, ease, callback, dalay) {

    if (duration instanceof Function) {
        callback = duration;
        ease = duration = null;
    }

    if (duration == undefined) {
        duration = 300;
    }

    ease = ease || 'ease-in';
    dalay = dalay || 0;

    // 获取或初始化配置对象。
    var fxOptions = Dom._fxOptions;
    if (!fxOptions) {
        Dom._fxOptions = fxOptions = {};

        fxOptions.prefix = '';
        var prefix = {
            transition: '',
            webkitTransition: 'webkit',
            mozTransition: 'moz',
            oTransition: 'o'
        };
        for (var key in prefix) {
            if (key in elem.style) {
                fxOptions.prefix = prefix[key];
                break;
            }
        }

        fxOptions.transitionEnd = fxOptions.prefix ? fxOptions.prefix + 'TransitionEnd' : 'transitionend';
        fxOptions.transition = fxOptions.prefix ? fxOptions.prefix + 'Transition' : 'transition';
        fxOptions.transform = fxOptions.prefix ? fxOptions.prefix + 'Transform' : 'transform';
    }

    // 直接支持 transforms 属性。
    for (var key in to) {
        if (/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i.test(key)) {
            to.transforms = to.transforms || '';
            to.transforms = key + '(' + to[key] + ') ' + to.transforms;
            delete to[key];
            key = 'transforms';
        }
        // 设置初始值。
        elem.style[key] = Dom.getStyle(elem, key);
    }

    setTimeout(function () {

        // 设置回调函数。
        var timer;
        var proxy = function (e) {

            // 确保事件不是冒泡的。
            if (e && e.target !== e.currentTarget) {
                return;
            }

            // 确保当前函数只执行一次。
            if (timer) {
                clearTimeout(timer);
                timer = 0;

                // 删除特效。
                elem.style[fxOptions.transition] = '';

                // 解绑事件。
                elem.removeEventListener(fxOptions.transitionEnd, proxy, false);

                // 执行回调。
                callback && callback.call(this)
            }

        };

        // 生成渐变样式。
        var transitions = [];
        for (var key in to) {
            transitions.push(key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + ' ' + duration + 'ms ' + ease + ' ' + dalay + 's ');
        }

        elem.style[fxOptions.transition] = transitions.join(',');
        //elem.style[fxOptions.transition] = 'all ' + ' ' + duration + 'ms ' + ease + ' ' + dalay + 's ';

        elem.addEventListener(fxOptions.transitionEnd, proxy, false);
        timer = setTimeout(proxy, duration);

        // 触发页面重计算以保证效果可以触发。
        elem.offsetWidth && elem.clientLeft;

        // 设置 CSS 属性以激活样式。
        for (var key in to) {
            elem.style[key] = to[key];
        }
    }, 0)
};

/**
 * 通过一定的预设特效显示元素。
 */
Dom.slideUp = function (elem, duration, ease, callback, dalay) {
    elem.style.overflow = 'hidden';
    Dom.animate(elem, {
        marginTop: 0,
        borderTopWidth: 0,
        paddingTop: 0,
        height: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
        marginBottom: 0,
    }, duration, ease, callback, dalay);
};

/**
 * 通过一定的预设特效隐藏元素。
 */
Dom.slideDown = function (elem, duration, ease, callback, dalay) {
    var properties = {
        marginTop: 0,
        borderTopWidth: 0,
        paddingTop: 0,
        height: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
        marginBottom: 0
    },
        key;
    for (key in properties) {
        elem.style[key] = '';
    }
    for (key in properties) {
        properties[key] = Dom.getStyle(elem, key);
    }
    for (key in properties) {
        elem.style[key] = '0';
    }
    Dom.animate(elem, properties, duration, ease, callback, dalay);
};

Dom.fadeIn = Dom.show;
Dom.fadeOut = Dom.hide;