/** * @author xuld *//**
 * 设置当前节点的弹层。
 * @param {Object} [options] 弹层的配置。 
 * @returns this
 */Dom.prototype.popover = function (options) {
    var popover = {
        dom: this,
        delay: 30,
        isHidden: function () {
            return this.dom.isHidden();
        },        show: function () {
            var me = this;            me.dom.show("opacity", null, 100);
            me.onShow && me.onShow(e);
        },        hide: function () {
            var me = this;
            me.dom.hide("opacity", null, 100);
            me.onHide && me.onHide(e);
        }
    };    for (var key in options) {
        popover[key] = options[key];
    }    var target = popover.target = Dom(popover.target);
    switch (event) {
        case "click":
            target.on(event, function (e) {
                if (popover.isHidden()) {
                    var targetElem = this;
                    // 设置隐藏事件。
                    Dom(document).on("mousedown", function (e) {
                        // 不处理下拉菜单本身事件。
                        if (!popover.dom.contains(e.target)) {

                            // 如果在目标节点点击，则直接由目标节点调用 hide()。
                            if (!Dom.contains(targetElem, e.target)) {
                                popover.hide(e);
                            }

                            // 确保当前事件只执行一次。
                            Dom(document).off("mousedown", arguments.callee);
                        }
                    });
                    popover.target = Dom(targetElem);
                    popover.show(e);
                } else {
                    popover.hide(e);
                }
            });
            break;
        case "mouseover":
        case "hover":
            var openTimer;
            var closeTimer;
            var closeDelay = popover.delay;

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
                            popover.target = Dom(targetElem);
                        }
                        popover.show(e);
                    }, popover.delay);
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
                        popover.hide(e);
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
                popover.dom.on("mouseenter", openCallback, window).on("mouseleave", closeCallback);

            }
            break;
        case "focus":
            // 设置获取焦点后显示浮层，全局除浮层和目标外单击关闭。
            target.on(event, function (e) {
                // 不重复显示。
                if (popover.isHidden()) {

                    var targetElem = this;

                    // 设置全局点击之后隐藏浮层。
                    Dom(document).on("mousedown", function (e) {

                        // 不处理下拉菜单本身事件。
                        // 不处理目标本身。
                        if (!popover.dom.contains(e.target) && !Dom.contains(targetElem, e.target)) {

                            // 确保当前事件只执行一次。
                            Dom(document).off("mousedown", arguments.callee);

                            // 隐藏浮层。
                            popover.hide(e);

                        }

                    });

                    // 显示浮层。
                    popover.target = Dom(targetElem);
                    popover.show(e);

                }
            });
            break;
        case "active":
            target
                .on("focus", function (e) {
                    popover.target = Dom(this);
                    popover.show(e);
                })
                .on("blur", function (e) {
                    popover.hide(e);
                });
            break;
        case "contextmenu":
            target.on(event, function (e) {
                e.preventDefault();
                e.stopPropagation();
                // 设置隐藏事件。
                Dom(document).on("mousedown", function (e) {

                    // 当第二次右键菜单时，迅速隐藏右键菜单以重新显示。
                    if (e.which === 3) {
                        popover.dom.hide();
                    } else if (!popover.dom.contains(e.target)) {
                        popover.hide(e);
                    }

                    // 确保当前事件只执行一次。
                    Dom(document).off("mousedown", arguments.callee);
                });
                popover.target = Dom(this);
                popover.show(e);
            });
            break;
    }    return popover;
};