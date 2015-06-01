/**
 * @author xuld
 * @fileOverview 提供 DOM 操作的辅助函数。
 */

/**
 * 基于 CSS 3 实现动画效果。
 * @param {Element} elem 要设置的节点。
 * @param {Object} [from] 特效的起始样式。
 * @param {Object} to 特效的结束样式。
 * @param {Function} [callback] 特效执行完成的回调。
 * @param {String} [duration=300] 特效的持续时间。
 * @param {String} [ease="ease-in"] 特效的渐变类型。
 * @param {Boolean} [reset] 如果指定了需要重置的样式，则在特效执行结束后重置样式。
 */
Dom.animate = function (elem, to, callback, duration, ease, reset, reset2) {

    // 获取或初始化配置对象。
    var fxOptions = Dom._fxOptions, key, fixedKey;
    if (!fxOptions) {
        Dom._fxOptions = fxOptions = {};
        fxOptions.transition = Dom.vendorCssPropertyName(elem, 'transition');
        fxOptions.prefix = fxOptions.transition.substr(0, fxOptions.transition.length - 'transition'.length);
        fxOptions.transitionEnd = fxOptions.prefix ? fxOptions.prefix + 'TransitionEnd' : 'transitionend';
    }

    // 实现从某个范围到另一个范围的渐变。
    if (callback && callback.constructor === Object) {

        // 设置当前状态为起始状态。
        for (key in to) {

            // 修复部分 CSS 属性名。
            fixedKey = Dom.vendorCssPropertyName(elem, key);

            // 先保存应用之前的样式。
            if (reset2 && !(fixedKey in reset2)) {
                reset2[fixedKey] = elem.style[fixedKey];
            }

            // 应用开始样式。
            elem.style[fixedKey] = to[key];
        }

        // 触发页面重计算以保证效果可以触发。
        elem.offsetWidth && elem.clientLeft;

        return Dom.animate(elem, callback, duration, ease, reset, reset2);
    }

    // 修补默认参数。
    if (duration == null) {
        duration = 300;
    }
    ease = ease || 'ease-in';

    // 设置回调函数。
    var timer,
        proxy = function (e) {

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

                // 恢复样式。
                if (reset) {
                    for (key in reset) {
                        elem.style[key] = reset[key];
                    }
                }

                // 执行回调。
                callback && callback.call(elem);
            }

        },
        transitions = [];

    // 计算需要渐变的全部样式。
    for (key in to) {

        // 修复部分 CSS 属性名。
        fixedKey = Dom.vendorCssPropertyName(elem, key);

        // 先保存应用之前的样式。
        if (reset && !(fixedKey in reset)) {
            reset[fixedKey] = elem.style[fixedKey];
        }

        // 保存渐变样式。
        transitions.push(fixedKey.replace(/([A-Z]|^ms)/g, '-$1').toLowerCase() + ' ' + duration + 'ms ' + ease);
    }

    // 设置渐变样式。
    elem.style[fxOptions.transition] = transitions.join(',');
    //elem.style[fxOptions.transition] = 'all ' + ' ' + duration + 'ms ' + ease + ' ' + dalay + 's ';
    elem.style._transitionCount = elem.style._transitionCount || 0;
    elem.style._transitionCount++;

    // 绑定渐变完成事件。
    elem.addEventListener(fxOptions.transitionEnd, proxy, false);
    timer = setTimeout(proxy, duration);

    // 触发页面重计算以保证效果可以触发。
    elem.offsetWidth && elem.clientLeft;

    // 设置 CSS 属性以激活渐变。
    for (key in to) {
        Dom.setStyle(elem, key, to[key]);
    }
};

Dom.toggleFx = {
    opacity: {
        opacity: 0
    },
    height: {
        marginTop: 0,
        borderTopWidth: 0,
        paddingTop: 0,
        height: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
        marginBottom: 0
    }
};

Dom._show = Dom.show;

/**
 * 通过一定的预设特效显示元素。
 * @param {Element} elem 要设置的节点。
 * @param {Function} [callback] 特效执行完成的回调。
 * @param {String} [duration=300] 特效的持续时间。
 * @param {String} [ease="ease-in"] 特效的渐变类型。
 */
Dom.show = function (elem, fxName, callback, duration, ease) {
    Dom._show(elem);

    // 执行特效。
    if (fxName = Dom.toggleFx[fxName] || fxName) {
        var to = {};
        for (key in fxName) {
            to[key] = Dom.getStyle(elem, key);
        }

        Dom.animate(elem, fxName, to, callback, duration, ease, {});
    } else {
        callback && callback.call(elem);
    }

};

Dom._hide = Dom.hide;

/**
 * 通过一定的预设特效隐藏元素。
 * @param {Element} elem 要设置的节点。
 * @param {Function} [callback] 特效执行完成的回调。
 * @param {String} [duration=300] 特效的持续时间。
 * @param {String} [ease="ease-in"] 特效的渐变类型。
 */
Dom.hide = function (elem, fxName, callback, duration, ease) {

    // 执行特效。
    if (fxName = Dom.toggleFx[fxName] || fxName) {
        var from = {};
        for (key in fxName) {
            from[key] = Dom.getStyle(elem, key);
        }

        Dom.animate(elem, from, fxName, hideCallback, duration, ease, {});
    } else {
        hideCallback();
    }

    function hideCallback() {
        Dom._hide(elem);
        callback && callback.call(elem);
    }

};
