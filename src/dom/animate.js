/**
 * @fileOverview 基于 CSS3 实现特效。
 * @author xuld
 */

// #require base

/**
 * 基于 CSS 3 实现动画效果。
 * @param {Object} [from] 特效的起始样式。
 * @param {Object} to 特效的结束样式。
 * @param {Function} [callback] 特效执行完成的回调。
 * @param {String} [duration=300] 特效的持续时间。
 * @param {String} [ease="ease-in"] 特效的渐变类型。
 * @param {Boolean} [reset] 是否在特效执行结束后重置样式。
 */
Element.prototype.animate = function (to, callback, duration, ease, reset, reset2) {

    // 获取或初始化配置对象。
    var elem = this,
        fxOptions = Element._fxOptions,
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
                            elem.setStyle(key, '');
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
        Element._fxOptions = fxOptions = {};
        fxOptions.transition = elem.vendorCssPropertyName('transition');
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
                from[key] = elem.getStyle(key);
            }
        }

        // 处理 {} -> 'auto' 。 
        if (to === 'auto') {
            to = {};
            for (key in from) {
                reset2 = transitionContext[key];
                to[key] = reset2 && reset2.from && key in reset2.from ? reset2.from[key] : elem.getStyle(key);
            }
        }

        proxyCallback.from = from;
        for (key in from) {
            elem.setStyle(key, from[key]);
        }
    }

    // 触发页面重计算以保证效果可以触发。
    elem.offsetWidth && elem.clientLeft;

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
        elem.setStyle(key, to[key]);
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

Element.toggleFx = {
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

Element.prototype._show = Element.prototype.show;

/**
 * 通过一定的预设特效显示元素。
 * @param {Element} elem 要设置的节点。
 * @param {Function} [callback] 特效执行完成的回调。
 * @param {String} [duration=300] 特效的持续时间。
 * @param {String} [ease="ease-in"] 特效的渐变类型。
 */
Element.prototype.show = function (fxName, callback, duration, ease) {

    this._show();

    // 执行特效。
    if (fxName = Element.toggleFx[fxName]) {
        this.animate(fxName, 'auto', callback, duration, ease, true);
    }

};

Element.prototype._hide = Element.prototype.hide;

/**
 * 通过一定的预设特效隐藏元素。
 * @param {Element} elem 要设置的节点。
 * @param {Function} [callback] 特效执行完成的回调。
 * @param {String} [duration=300] 特效的持续时间。
 * @param {String} [ease="ease-in"] 特效的渐变类型。
 */
Element.prototype.hide = function (fxName, callback, duration, ease) {

    // 执行特效。
    if (fxName = Element.toggleFx[fxName]) {
        this.animate('auto', fxName, function (elem) {
            elem._hide();
            callback && callback.call(this, elem);
        }, duration, ease, true);
    } else {
        this._hide();
    }

};
