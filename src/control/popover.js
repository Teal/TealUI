/**
 * @author xuld
 */

// #require ../control/base
// #require ../dom/pin
// #require ../dom/animate

/**
 * 表示一个浮层。
 * @remark 浮层一般基于已有的节点，经过鼠标点击或滑动事件显示。
 */
var Popover = Control.extend({

    /**
     * 获取或设置当前浮层的目标。
     * @type {Element}
     */
    target: undefined,

    /**
     * 触发当前浮层显示的事件。
     * 可能的值为：
     * 'mouseover': 鼠标移上后显示。
     * 'hover': 鼠标悬停时显示。
     * 'click': 点击后显示。
     * 'active': 拥有焦点时显示。
     * 'focus': 获取焦点后显示。
     * null: 手动显示。
     */
    event: 'click',

    /**
     * 显示当前浮层的延时。（仅对鼠标事件有效）
     * @type Integer
     */
    delay: 30,

    /**
     * 渐变显示的特效时间。如果为 0 则不开启动画。
     */
    duration: 150,

    /**
     * 自动定位的目标节点。默认为 target。
     * @type {Boolean}
     */
    pinTarget: null,

    /**
     * 如果为 true 则根据鼠标事件定位。
     * @type {Boolean}
     */
    pinEvent: null,

    /**
     * 自动定位的位置。如果为 null 则不自动定位。默认为 null。
     * @type {Boolean}
     */
    pinAlign: null,

    /**
     * 如果包含箭头则设置其箭头的宽度。
     */
    arrowDistance: 10,

    init: function () {
        var targets = this.target === undefined ? [this.elem.previousElementSibling] : document.queryAll(this.target);
        targets && NodeList.each(targets, function (target) {
            this.setPopover(target);
        }, this);
    },

    /**
     * 设置指定元素的弹出菜单。
     * @param {Element} target 要设置的目标节点。
     * @param {String} triggerEvent 要设置的触发事件。默认为当前触发事件源。
     */
    setPopover: function (target, triggerEvent) {
        this.target = target;
        if (target) {
            var me = this;
            triggerEvent = triggerEvent || this.event;
            if (triggerEvent === 'mouseover' || triggerEvent === 'hover') {
                var openTimer,
                    closeTimer,
                    closeDelay = me.delay,
                    openCallback = function (e) {
                        // 如果正在关闭，则不关闭保持打开状态。
                        if (closeTimer) {
                            clearTimeout(closeTimer);
                            closeTimer = 0;
                        } else {
                            // 否则倒计时开始打开。
                            openTimer = openTimer || setTimeout(function () {
                                openTimer = 0;
                                me.show(e);
                            }, me.delay);
                        }
                    },
                    closeCallback = function (e) {
                        // 如果正在打开，则不打开保持关闭状态。
                        if (openTimer) {
                            clearTimeout(openTimer);
                            openTimer = 0;
                        } else {
                            // 否则倒计时开始关闭。
                            closeTimer = closeTimer || setTimeout(function () {
                                closeTimer = 0;
                                me.hide(e);
                            }, closeDelay);
                        }
                    };

                // 移到目标节点则显示浮层。
                target.on('mouseenter', openCallback);

                // 移出目标节点则倒计时隐藏。
                target.on('mouseleave', closeCallback);

                if (triggerEvent !== 'hover') {

                    closeDelay *= 8;

                    // 移到当前节点则不再显示。
                    me.elem.on('mouseenter', openCallback);

                    // 移出目标节点则倒计时隐藏。
                    me.elem.on('mouseleave', closeCallback);

                }

            } else if (triggerEvent === 'focus') {
                // 设置获取焦点后显示浮层，全局除浮层和目标外单击关闭。
                target.on(triggerEvent, function (e) {
                    // 不重复显示。
                    if (me.isHidden()) {

                        // 设置全局点击之后隐藏浮层。
                        document.on('mousedown', function (e) {

                            // 不处理下拉菜单本身事件。
                            // 不处理目标本身。
                            if (!me.elem.contains(e.target) && (!target || !target.contains(e.target))) {

                                // 确保当前事件只执行一次。
                                document.off('mousedown', arguments.callee);

                                // 隐藏浮层。
                                me.hide(e);

                            }

                        }, this);

                        // 显示浮层。
                        me.show(e);

                    }
                });
            } else if (triggerEvent === 'click') {
                // 设置点击后切换隐藏。
                target.on(triggerEvent, function (e) {
                    if (me.isHidden()) {

                        // 设置隐藏事件。
                        document.on('mousedown', function (e) {

                            // 不处理下拉菜单本身事件。
                            if (!me.elem.contains(e.target)) {

                                // 如果在目标节点点击，则直接由目标节点调用 hide()。
                                if (!target || !target.contains(e.target)) {
                                    me.hide(e);
                                }

                                // 确保当前事件只执行一次。
                                document.off('mousedown', arguments.callee);
                            }

                        }, this);

                        me.show(e);

                    } else {
                        me.hide(e);
                    }
                });
            } else if (triggerEvent === 'active') {
                target.on('focus', this.show, this);
                target.on('blur', this.hide, this);
            }
        }
    },

    /**
     * 重新设置当前浮层的位置。
     */
    realign: function(e) {

        // 实现箭头定位。
        var me = this,
            arrowNode = me.elem.queryChild('.x-arrow');
        if (arrowNode) {

            //             0       1        2       3
            var arrows = ['bottom', 'right', 'left', 'top'],
                arrow = 4,
                rect,
                pinTarget = me.pinTarget || me.target;

            function toggleArrow(to) {
                arrowNode.classList.remove('x-arrow-' + arrows[3 - to]);
                arrowNode.classList.add('x-arrow-' + arrows[to]);
            }

            function proc(offsetXorY, offsetYorX, leftOrTop, widthOrHeight) {

                // Y 发生改变说明箭头发生改变。
                if (rect[offsetYorX]) {
                    toggleArrow(3 - arrow);
                }

                // X 发生改变箭头横调。
                if (rect[offsetXorY]) {
                    var targetRect = pinTarget.getRect(),
                        value = targetRect[leftOrTop] - me.elem.getRect()[leftOrTop] + targetRect[widthOrHeight] / 2;
                    if (value > 0) {
                        arrowNode.style[leftOrTop] = value + 'px';
                    } else {
                        arrowNode.style.display = 'none';
                    }
                }

            }

            // 清空之前的覆盖样式。
            if (me._orignalArrow) {
                arrowNode.style.left = arrowNode.style.top = arrowNode.style.display = '';
                toggleArrow(me._orignalArrow - 1);
                delete me._orignalArrow;
            }

            // 找到当前的实际箭头。
            while (--arrow > 0 && !arrowNode.classList.contains('x-arrow-' + arrows[arrow]))
                ;

            // 根据箭头决定定位。
            rect = me.elem.pin(pinTarget, arrows[3 - arrow].charAt(0), me.arrowDistance, me.arrowDistance);

            // 如果位置发生偏移则重新设置箭头。
            if (rect.offsetX || rect.offsetY) {
                // 记录当前箭头。
                me._orignalArrow = arrow + 1;
                if (arrow > 0 && arrow < 3) {
                    // 水平方向。
                    proc('offsetY', 'offsetX', 'top', 'height');
                } else {
                    // 垂直方向。
                    proc('offsetX', 'offsetY', 'left', 'width');
                }

            }

            // 实现自动定位逻辑。
        } else if (me.pinAlign) {
            me.elem.pin(me.pinEvent && e || me.pinTarget || me.target, me.pinAlign, 0, me.pinEvent ? 10 : 0);
        }
    },

    /**
     * 显示当前浮层。
     * @return this
     */
    show: function (e) {
        var me = this;
        me.elem.show('opacity', null, me.duration);
        me.realign(e);
        me.onShow && me.onShow(e);
        me.trigger('show', e);
        return me;
    },

    /**
     * 隐藏当前浮层。
     * @return this
     */
    hide: function (e) {
        var me = this;
        me.elem.hide('opacity', null, me.duration);
        me.onHide && me.onHide(e);
        me.trigger('hide', e);
        return me;
    },

    /**
     * 判断当前浮层是否被隐藏。
     * @return {Boolean} 如果浮层已经被隐藏，则返回 true。
     * @protected virtual
     */
    isHidden: function () {
        return this.elem.isHidden();
    },

    /**
     * 切换显示下拉菜单。
     * @return this
     */
    toggle: function (e) {
        return this.isHidden() ? this.show(e) : this.hide(e);
    }

});
