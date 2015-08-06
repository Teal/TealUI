/**
 * @author xuld
 */

// #require ../control/base
// #require ../dom/pin

/**
 * 表示一个浮层。
 * @remark 浮层指鼠标点击或滑过指定节点时弹出的层。
 */
var Popover = Control.extend({

    /**
     * 获取当前组件的角色。
     * @type {String}
     * @example alert($("#elem").role().role)
     * @inner
     */
    role: "popover",

    /**
     * 获取或设置当前浮层的目标。
     * @type {Dom}
     */
    target: 0,

    target: Control.prop(Dom, function() {
        this.setPopover(this.target);
    }),

    /**
     * 触发当前浮层显示的事件。可能的值为：
     * - "mouseover" 鼠标移上后显示。
     * - "hover" 鼠标悬停时显示。
     * - "click" 点击后显示。
     * - "active" 拥有焦点时显示。
     * - "focus" 获取焦点后显示。
     * - null 手动显示。
     */
    event: "click",

    /**
     * 显示当前浮层的延时。（仅对鼠标事件有效）
     * @type {Number}
     */
    delay: 30,

    /**
     * 自动定位的位置。如果为 @null 则不自动定位。默认为 @null。
     * @type {Boolean}
     */
    pinAlign: null,

    /**
     * 自动定位的目标节点。默认为 @target。
     * @type {Boolean}
     */
    pinTarget: null,

    /**
     * 如果为 @true，则自动对齐事件。
     * @type {Boolean}
     */
    pinEvent: null,

    /**
     * 自动定位时的容器。如果为 @null 则为文档。
     */
    pinContainer: null,

    /**
     * 自动定位时的容器内边距。
     */
    pinContainerPadding: 7,

    /**
     * 如果包含箭头则设置其箭头的宽度。
     */
    arrowDistance: 10,

    init: function () {
        this.target = Dom(this.target);
        this.setPopover(this.target, this.event);
    },

    /**
     * 设置指定元素的弹出菜单。
     * @param {Dom} [target] 要设置的目标节点。
     * @param {String} [triggerEvent] 要设置的触发事件。默认为当前触发事件源。
     */
    setPopover: function (target, triggerEvent) {

        var me = this;

        if (target !== null) {

            me.target = target = target ? Dom(target) : this.dom.prev();

            if (me.created) {
                me.target.parent().append(me.dom);
            }

            switch (triggerEvent) {
                case "click":
                    target.on(triggerEvent, function (e) {
                        var targetElem = this;
                        if (me.isHidden()) {

                            // 设置隐藏事件。
                            Dom(document).on("mousedown", function (e) {

                                // 不处理下拉菜单本身事件。
                                if (!me.dom.contains(e.target)) {

                                    // 如果在目标节点点击，则直接由目标节点调用 hide()。
                                    if (!Dom(targetElem).contains(e.target)) {
                                        me.hide(e);
                                    }

                                    // 确保当前事件只执行一次。
                                    Dom(document).off("mousedown", arguments.callee);
                                }

                            });

                            me.target = Dom(targetElem);
                            me.show(e);
                        } else {
                            me.hide(e);
                        }
                    });
                    break;
                case "mouseover":
                case "hover":
                    var openTimer;
                    var closeTimer;
                    var closeDelay = me.delay;

                    function openCallback(e) {
                        var targetElem = this;
                        // 如果正在关闭，则不关闭保持打开状态。
                        if (closeTimer) {
                            clearTimeout(closeTimer);
                            closeTimer = 0;
                        } else {
                            // 否则倒计时开始打开。
                            openTimer = openTimer || setTimeout(function () {
                                openTimer = 0;
                                if (targetElem !== window) {
                                    me.target = Dom(targetElem);
                                }
                                me.show(e);
                            }, me.delay);
                        }
                    }

                    function closeCallback(e) {
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
                    }

                    // 移到目标节点则显示浮层。
                    // 移出目标节点则倒计时隐藏。
                    target
                        .on("mouseenter", openCallback)
                        .on("mouseleave", closeCallback);

                    if (triggerEvent !== "hover") {

                        closeDelay *= 8;

                        // 移到当前节点则不再显示。
                        // 移出目标节点则倒计时隐藏。
                        me.dom
                            .on("mouseenter", openCallback, window)
                            .on("mouseleave", closeCallback);

                    }
                    break;
                case "focus":
                    // 设置获取焦点后显示浮层，全局除浮层和目标外单击关闭。
                    target.on(triggerEvent, function (e) {
                        // 不重复显示。
                        if (me.isHidden()) {

                            var targetElem = this;

                            // 设置全局点击之后隐藏浮层。
                            Dom(document).on("mousedown", function (e) {

                                // 不处理下拉菜单本身事件。
                                // 不处理目标本身。
                                if (!me.dom.contains(e.target) && !Dom(targetElem).contains(e.target)) {

                                    // 确保当前事件只执行一次。
                                    Dom(document).off("mousedown", arguments.callee);

                                    // 隐藏浮层。
                                    me.hide(e);

                                }

                            }, this);

                            // 显示浮层。
                            me.target = Dom(targetElem);
                            me.show(e);

                        }
                    });
                    break;
                case "active":
                    target
                        .on("focus", function (e) {
                            me.target = Dom(this);
                            me.show(e);
                        })
                        .on("blur", function (e) {
                            me.hide(e);
                        });
                    break;
            }

        }

    },

    /**
     * 显示当前浮层。
     * @returns this
     */
    show: function (e) {
        debugger
        var me = this;
        me.dom.show("opacity", null, me.duration);
        me.onShow && me.onShow(e);
        me.trigger("show", e);
        me.realign(e);
        return me;
    },

    /**
     * 隐藏当前浮层。
     * @returns this
     */
    hide: function (e) {
        var me = this;
        me.dom.hide("opacity", null, me.duration);
        me.onHide && me.onHide(e);
        me.trigger("hide", e);
        return me;
    },

    /**
     * 判断当前浮层是否被隐藏。
     * @returns {Boolean} 如果浮层已经被隐藏，则返回 @true。
     * @protected virtual
     */
    isHidden: function () {
        return this.dom.isHidden();
    },

    /**
     * 切换显示下拉菜单。
     * @returns this
     */
    toggle: function (e) {
        return this.isHidden() ? this.show(e) : this.hide(e);
    },

    /**
     * 重新设置当前浮层的位置。
     */
    realign: function (e) {

        // 实现箭头定位。
        var me = this;
        var arrowDom = me.dom.children(".x-arrow");
        if (arrowDom.length) {

            //             0       1        2       3
            var arrows = ["bottom", "right", "left", "top"],
                arrow = 4,
                rect,
                pinTarget = me.pinTarget || me.target;

            function toggleArrow(to) {
                arrowDom.removeClass("x-arrow-" + arrows[3 - to]).addClass("x-arrow-" + arrows[to]);
            }

            // 恢复原始的箭头样式。
            if (me._orignalArrow) {
                arrowDom.css('left', null).css('top', null).css('display', null);
                toggleArrow(me._orignalArrow - 1);
                delete me._orignalArrow;
            }

            // 找到当前的实际箭头。
            while (--arrow > 0 && !arrowDom.is(".x-arrow-" + arrows[arrow]));

            // 根据箭头决定定位。
            me.dom.pin(pinTarget, arrows[3 - arrow].charAt(0), me.arrowDistance, me.arrowDistance, me.pinContainer, me.pinContainerPadding, function (rect) {

                // 如果位置发生偏移则重新设置箭头。
                if (rect.offsetX || rect.offsetY) {

                    // 记录当前箭头。
                    me._orignalArrow = arrow + 1;

                    var x = arrow > 0 && arrow < 3;

                    // Y 发生改变说明箭头发生改变。
                    if (x ? rect.offsetX : rect.offsetY) {
                        toggleArrow(3 - arrow);
                    }

                    // X 发生改变箭头横调。
                    if (x ? rect.offsetY : rect.offsetX) {
                        var targetRect = pinTarget.rect();
                        var leftOrTop = x ? "top" : "left";
                        var value = targetRect[leftOrTop] - me.dom.rect()[leftOrTop] + targetRect[x ? "height" : "width"] / 2;
                        if (value > 0) {
                            arrowDom.css(leftOrTop, value);
                        } else {
                            arrowDom.css("display", "none");
                        }
                    }

                }

            });

            // 实现自动定位逻辑。
        } else if (me.pinAlign) {
            me.dom.pin(me.pinEvent && e || me.pinTarget || me.target, me.pinAlign, 0, me.pinEvent ? 10 : 0);
        }
    }

});