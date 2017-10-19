/**
 * @author xuld
 */

typeof include === "function" && include("control
");
typeof include === "function" && include("../../utility/dom/pin
");

/**
 * 表示一个浮层。
 * @abstract
 * @class
 * @extends Control
 * @remark 浮层指鼠标点击或滑过指定节点时弹出的层。
 */
var Popover = Control.extend({

    role: "popover",

    /**
     * 获取或设置当前浮层的目标。
     * @type {Dom}
     */
    target: null,

    /**
     * 触发当前浮层显示的事件。可能的值为：
     * - "mouseover" 鼠标移上后显示。
     * - "hover" 鼠标悬停时显示。
     * - "click" 点击后显示。
     * - "active" 拥有焦点时显示。
     * - "focus" 获取焦点后显示。
     * - "contextmenu" 右键菜单显示。
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
    pinEvent: false,

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

        var me = this;

        // 初始化节点。
        var target = me.target = Dom(me.target).valueOf() || me.dom.prev();
        me.pinTarget = Dom(me.pinTarget);
        me.pinContainer = Dom(me.pinContainer);

        var event = me.event;

        // 如果当前节点是自动创建的，则移动到节点相邻位置，
        // 以保证和当前节点属于相同的 offsetParent。
        if (me.generated) {
            me.target.after(me.dom);
        }

        switch (event) {
            case "click":
                target.on(event, function (e) {
                    if (me.isHidden()) {
                        var targetElem = this;
                        // 设置隐藏事件。
                        Dom(document).on("mousedown", function (e) {
                            // 不处理下拉菜单本身事件。
                            if (!me.dom.contains(e.target)) {

                                // 如果在目标节点点击，则直接由目标节点调用 hide()。
                                if (!Dom.contains(targetElem, e.target)) {
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
                target.on("mouseenter", openCallback).on("mouseleave", closeCallback);

                // 如果 event == "mouseover"
                if (event.length > 5) {

                    closeDelay *= 8;

                    // 移到当前节点则不再显示。
                    // 移出目标节点则倒计时隐藏。
                    me.dom.on("mouseenter", openCallback, window).on("mouseleave", closeCallback);

                }
                break;
            case "focus":
                // 设置获取焦点后显示浮层，全局除浮层和目标外单击关闭。
                target.on(event, function (e) {
                    // 不重复显示。
                    if (me.isHidden()) {

                        var targetElem = this;

                        // 设置全局点击之后隐藏浮层。
                        Dom(document).on("mousedown", function (e) {

                            // 不处理下拉菜单本身事件。
                            // 不处理目标本身。
                            if (!me.dom.contains(e.target) && !Dom.contains(targetElem, e.target)) {

                                // 确保当前事件只执行一次。
                                Dom(document).off("mousedown", arguments.callee);

                                // 隐藏浮层。
                                me.hide(e);

                            }

                        });

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
            case "contextmenu":
                me.pinEvent = true;
                me.pinAlign = 'rt';
                me.arrowDistance = 1;
                target.on(event, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // 设置隐藏事件。
                    Dom(document).on("mousedown", function (e) {

                        // 当第二次右键菜单时，迅速隐藏右键菜单以重新显示。
                        if (e.which === 3) {
                            me.dom.hide();
                        } else if (!me.dom.contains(e.target)) {
                            me.hide(e);
                        }

                        // 确保当前事件只执行一次。
                        Dom(document).off("mousedown", arguments.callee);
                    });
                    me.target = Dom(this);
                    me.show(e);
                });
                break;
        }

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
     * 显示当前浮层。
     * @param {Event} [e] 相关的事件对象。
     * @returns this
     */
    show: function (e) {
        var me = this;
        if (me.isHidden()) {
            me.dom.show("opacity", null, me.duration);
            me.onShow && me.onShow(e);
            me.trigger("show", e);
        }
        me.realign(e);
        return me;
    },

    /**
     * 隐藏当前浮层。
     * @param {Event} [e] 相关的事件对象。
     * @returns this
     */
    hide: function (e) {
        var me = this;
        if (!me.isHidden()) {
            me.dom.hide("opacity", null, me.duration);
            me.onHide && me.onHide(e);
            me.trigger("hide", e);
        }
        return me;
    },

    /**
     * 切换显示下拉菜单。
     * @param {Event} [e] 相关的事件对象。
     * @returns this
     */
    toggle: function (e) {
        return this.isHidden() ? this.show(e) : this.hide(e);
    },

    /**
     * 重新设置当前浮层的位置。
     * @param {Event} [e] 相关的事件对象。
     * @protected
     */
    realign: function (e) {

        var me = this;

        // 优先基于箭头定位。
        var arrowDom = me.dom.children(".x-arrow");
        if (arrowDom.length) {

            //             0         1         2       3
            var arrows = ["bottom", "right", "left", "top"];
            var arrow = 4;
            var pinTarget = me.pinTarget.valueOf() || me.target;

            function toggleArrow(to) {
                arrowDom.removeClass("x-arrow-" + arrows[3 - to]).addClass("x-arrow-" + arrows[to]);
            }

            // 如果上次显示时箭头发生移动，则恢复原始的箭头样式。
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
            me.dom.pin(me.pinEvent && e || me.pinTarget.valueOf() || me.target, me.pinAlign, 0, me.pinEvent ? me.arrowDistance : 0);
        }
    }

});