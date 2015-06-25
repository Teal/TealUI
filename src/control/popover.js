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
    event: 'mouseover',

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
     * 自动定位的位置。如果为 null 则不自动定位。默认为 null。
     * @type {Boolean}
     */
    pinPosition: null,

    /**
     * 自动定位时的距离。
     */
    pinDistance: 10,

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
     * 显示当前浮层。
     * @return this
     */
    show: function (e) {
        this.elem.show('opacity', null, this.duration);

        // 实现箭头定位。
        if (this.elem.classList.contains('x-arrow')) {

            var reverseMap = {
                'top': 'bottom',
                'bottom': 'top',
                'right': 'left',
                'left': 'right'
            }, arrow, t;

            // 测试当前的箭头。
            for (t in reverseMap) {
                if (this.elem.classList.contains('x-arrow-' + t)) {
                    arrow = t;
                    break;
                }
            }

            // 恢复之前的箭头。
            if (this._orignalArrow) {
                this.elem.classList.remove('x-arrow-' + arrow);
                this.elem.classList.add('x-arrow-' + this._orignalArrow);
                delete this._orignalArrow;
            }

            // 根据箭头决定定位。
            me.elem.pin(this.pinTarget || this.target, align, me.distance, me.distance, function (rect, position, offset, leftOrTop, widthOrHeight) {
                me._align = align;
                me.elem.className = me.elem.className.replace(/\bx-arrow-\w+\b/, 'x-arrow-' + align);
            });
        }

        // 实现自动定位逻辑。
        if (this.pinPosition) {
            
            this.elem.pin(this.pinPosition)

        }

        // 实现自动定位逻辑。
        //var me = this,
        //        align = me.getAlign();

        //// 恢复默认的定位。
        //if (me._align && me._align !== align) {
        //    me.setAlign(align = me._align);
        //    delete me._align;
        //}

        //if (align) {
        //    me.elem.pin(this.target, align, me.distance, me.distance, function () {
        //        me._align = align;
        //        me.elem.className = me.elem.className.replace(/\bx-arrow-\w+\b/, 'x-arrow-' + align);
        //    });
        //} else if (e) {
        //    me.elem.pin(e, 'bl', 0, me.distance * 2);
        //}

        this.onShow && this.onShow(e);
        this.trigger('show', e);
        return this;
    },

    /**
     * 隐藏当前浮层。
     * @return this
     */
    hide: function (e) {
        this.elem.hide('opacity', null, this.duration);
        this.onHide && this.onHide(e);
        this.trigger('hide', e);
        return this;
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
    },

    /**
     * 获取当前工具提示的位置。
     */
    getAlign: function () {
        var classList = this.elem.classList, key;
        for (key in Popover._aligners) {
            if (classList.contains(Popover._aligners[key])) {
                return key;
            }
        }
        return null;
    },

    /**
     * 设置当前工具提示的位置。
     * @param {String} align 要设置的位置。可以是 null、'left'、'top'、'bottom'、'right'。
     */
    setAlign: function (align) {
        var classList = this.elem.classList;
        classList.remove(Popover._aligners[this.getAlign()]);
        if (align) {
            classList.remove('x-arrow');
        } else {
            classList.add('x-arrow');
            classList.add(Popover._aligners[align]);
        }
        return this;
    }

});

Popover._aligners = {
    'top': 'x-arrow-bottom',
    'bottom': 'x-arrow-top',
    'right': 'x-arrow-left',
    'left': 'x-arrow-right'
};
