/**
 * @author xuld
 * @fileOverview 提供 DOM 操作的辅助函数。
 */

/**
 * 基于 CSS 3 实现动画效果。
 * @param {Element} elem 要设置的节点。
 * @param {Object?} from 特效的起始样式。
 * @param {Object} to 特效的结束样式。
 * @param {String} duration=300 特效的持续时间。
 * @param {String} ease 特效的渐变类型。
 * @param {Function} callback 特效执行完成的回调。
 * @param {Number} dalay=0 特效的延时时间。
 */
Dom.animate = function (elem, to, duration, ease, callback, dalay, dalay2) {

    // 获取或初始化配置对象。
    var fxOptions = Dom._fxOptions;
    if (!fxOptions) {
        Dom._fxOptions = fxOptions = {};
        fxOptions.transition = Dom.vendorCssPropertyName(elem, 'transition');
        fxOptions.prefix = fxOptions.transition.substr(0, fxOptions.transition.length - 'transition'.length);
        fxOptions.transitionEnd = fxOptions.prefix ? fxOptions.prefix + 'TransitionEnd' : 'transitionend';
    }

    // 直接支持 transforms 属性。
    if (duration instanceof Function) {
        callback = duration;
        ease = duration = null;
    }

    if (duration == undefined) {
        duration = 300;
    }

    // 实现从某个范围到另一个范围的渐变。
    if (duration.constructor === Object) {
        for (var key in to) {
            elem.style[key] = to[key];
        }
        return setTimeout(function () {
            Dom.animate(elem, duration, ease, callback, dalay);
        }, dalay2 || 0);
    }

    ease = ease || 'ease-in';
    dalay = dalay || 0;

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
            if (--elem.style._transitionCount < 1) {
                elem.style[fxOptions.transition] = '';
            }

            // 解绑事件。
            elem.removeEventListener(fxOptions.transitionEnd, proxy, false);

            // 执行回调。
            callback && callback.call(elem)
        }

    };

    // 生成渐变样式。
    var transitions = [];
    for (var key in to) {
        transitions.push(key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + ' ' + duration + 'ms ' + ease + ' ' + dalay + 's ');
    }
    elem.style[fxOptions.transition] = transitions.join(',');
    //elem.style[fxOptions.transition] = 'all ' + ' ' + duration + 'ms ' + ease + ' ' + dalay + 's ';
    elem.style._transitionCount = elem.style._transitionCount || 0;
    elem.style._transitionCount++;

    elem.addEventListener(fxOptions.transitionEnd, proxy, false);
    timer = setTimeout(proxy, duration);

    // 触发页面重计算以保证效果可以触发。
    elem.offsetWidth && elem.clientLeft;

    // 设置 CSS 属性以激活样式。
    for (var key in to) {
        Dom.setStyle(elem, key, to[key]);
    }
};

/**
 * 通过一定的预设特效显示元素。
 * @param {Element} elem 要设置的节点。
 * @param {String} duration=300 特效的持续时间。
 * @param {String} ease 特效的渐变类型。
 * @param {Function} callback 特效执行完成的回调。
 * @param {Number} dalay=0 特效的延时时间。
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
 * @param {Element} elem 要设置的节点。
 * @param {String} duration=300 特效的持续时间。
 * @param {String} ease 特效的渐变类型。
 * @param {Function} callback 特效执行完成的回调。
 * @param {Number} dalay=0 特效的延时时间。
 */
Dom.slideDown = function (elem, duration, ease, callback, dalay) {
    var from = {
        marginTop: 0,
        borderTopWidth: 0,
        paddingTop: 0,
        height: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
        marginBottom: 0
    }, to = {},
        key;

    // 首先清空当前属性设置，获取默认样式。
    for (key in from) {
        elem.style[key] = '';
    }

    // 获取每个属性的值。
    for (key in from) {
        to[key] = Dom.getStyle(elem, key);
    }

    Dom.animate(elem, from, to, duration, ease, callback, dalay);
};

/**
 * 通过一定的预设特效显示元素。
 * @param {Element} elem 要设置的节点。
 * @param {String} duration=300 特效的持续时间。
 * @param {String} ease 特效的渐变类型。
 * @param {Function} callback 特效执行完成的回调。
 * @param {Number} dalay=0 特效的延时时间。
 */
Dom.fadeIn = function (elem, duration, ease, callback, dalay) {
    Dom.show(elem);
    Dom.animate(elem, {
        opacity: 0
    }, {
        opacity: Dom.getStyle(elem, 'opacity')
    }, duration, ease, callback, dalay);
};

/**
 * 通过一定的预设特效隐藏元素。
 * @param {Element} elem 要设置的节点。
 * @param {String} duration=300 特效的持续时间。
 * @param {String} ease 特效的渐变类型。
 * @param {Function} callback 特效执行完成的回调。
 * @param {Number} dalay=0 特效的延时时间。
 */
Dom.fadeOut = function (elem, duration, ease, callback, dalay) {
    Dom.animate(elem, {
        opacity: 0
    }, duration, ease, function () {
        elem.style.opacity = '';
        Dom.hide(elem);
        callback && callback.call(elem);
    }, dalay);
};
