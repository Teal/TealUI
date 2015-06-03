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
 * @param {Boolean} [reset] 是否在特效执行结束后重置样式。
 */
Dom.animate = function (elem, to, callback, duration, ease, reset, reset2) {

    // 获取或初始化配置对象。
    var fxOptions = Dom._fxOptions,
        transitionContext = elem.style._transitionContext || (elem.style._transitionContext = {}),
        proxyTimer,
        key,
        proxyCallback = function (e) {

            // 确保事件不是冒泡的，确保当前函数只执行一次。
            if ((!e || e.target === e.currentTarget) && proxyTimer) {
                clearTimeout(proxyTimer);
                proxyTimer = 0;

                // 解绑事件。
                elem.removeEventListener(fxOptions.transitionEnd, proxyCallback, false);

                // 从上下文中删除回调信息。
                var transitionContextIsUpdated = false;
                for (key in transitionContext) {
                    if (transitionContext[key] === proxyCallback) {
                        delete transitionContext[key];
                        transitionContextIsUpdated = true;
                    }
                }

                // 如果当前特效执行结束涉及当前的回答，则调用回调函数。
                if (transitionContextIsUpdated) {

                    // 删除渐变式。
                    updateTransition();

                    // 恢复样式。
                    if (reset) {
                        for (key in to) {
                            Dom.setStyle(elem, key, '');
                        }
                    }

                    // 执行回调。
                    callback && callback.call(elem, elem);
                }

            }

        },
        from;

    // 获取或初始化配置对象。
    if (!fxOptions) {
        Dom._fxOptions = fxOptions = {};
        fxOptions.transition = Dom.vendorCssPropertyName(elem, 'transition');
        fxOptions.prefix = fxOptions.transition.substr(0, fxOptions.transition.length - 'transition'.length);
        fxOptions.transitionEnd = fxOptions.prefix ? fxOptions.prefix + 'TransitionEnd' : 'transitionend';
        fxOptions.supportAnimation = fxOptions.transition in elem.style;
    }

    // 提取 from 参数。
    if (callback && callback.constructor !== Function) {
        from = to;
        to = callback;
        callback = duration;
        duration = ease;
        ease = reset;
        reset = reset2;
    }

    // 不支持特效，直接调用回调。
    if (!fxOptions.supportAnimation) {
        callback && callback.call(elem, elem);
        return;
    }

    // 修补默认参数。
    if (duration == null) {
        duration = 300;
    }
    ease = ease || 'ease-in';

    // 设置当前状态为起始状态。
    if (from) {

        // 处理 'auto' -> {} 。
        if (from === 'auto') {
            from = {};
            for (key in to) {
                from[key] = Dom.getStyle(elem, key);
            }
        }

        // 处理 {} -> 'auto' 。 
        if (to === 'auto') {
            to = {};
            for (key in from) {
                reset2 = transitionContext[key];
                to[key] = reset2 && reset2.from && key in reset2.from ? reset2.from[key] : Dom.getStyle(elem, key);
            }
        }

        proxyCallback.from = from;
        for (key in from) {
            Dom.setStyle(elem, key, from[key]);
        }
    }

    // 触发页面重计算以保证效果可以触发。
    key = elem.offsetWidth && elem.clientLeft;

    // 更新渐变上下文。
    for (key in to) {
        transitionContext[key] = proxyCallback;
    }

    // 设置渐变样式。
    updateTransition();

    // 绑定渐变完成事件。
    elem.addEventListener(fxOptions.transitionEnd, proxyCallback, false);
    proxyTimer = setTimeout(proxyCallback, duration);

    // 设置 CSS 属性以激活渐变。
    for (key in to) {
        Dom.setStyle(elem, key, to[key]);
    }

    function updateTransition() {
        var transitions = '';
        for (key in transitionContext) {
            if (transitions) {
                transitions += ',';
            }
            transitions += key.replace(/([A-Z]|^ms)/g, function (word) {
                return '-' + word.toLowerCase();
            }) + ' ' + duration + 'ms ' + ease;
        }
        elem.style[fxOptions.transition] = transitions;
        //elem.style[fxOptions.transition] = 'all ' + ' ' + duration + 'ms ' + ease + ' ' + dalay + 's ';
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
    if (fxName = Dom.toggleFx[fxName]) {
        Dom.animate(elem, fxName, 'auto', callback, duration, ease, true);
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
    if (fxName = Dom.toggleFx[fxName]) {
        Dom.animate(elem, 'auto', fxName, function (elem) {
            Dom._hide(this);
            callback && callback.call(this, elem);
        }, duration, ease, true);
    } else {
        Dom._hide(elem);
    }

};
