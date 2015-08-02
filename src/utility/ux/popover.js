/** * @author xuld *//**
 * 设置当前节点的弹层。
 * @param {Object} [options] 弹层的配置。 
 * @returns this
 */Dom.prototype.popover = function (options) {    options = options || {};    var event = options.event,        target = Dom(options.target);    return this.each(function(elem) {    });    // 鼠标事件。    if (event === "mouseover" || event === "hover") {        var openTimer,            closeTimer,            closeDelay = options.delay || 30,            openCallback = function(e) {                // 如果正在关闭，则不关闭保持打开状态。                if (closeTimer) {                    clearTimeout(closeTimer);                    closeTimer = 0;                } else {                    // 否则倒计时开始打开。                    openTimer = openTimer || setTimeout(function() {                        openTimer = 0;                        options.show && options.show(e);                    }, closeDelay);                }            },            closeCallback = function(e) {                // 如果正在打开，则不打开保持关闭状态。                if (openTimer) {                    clearTimeout(openTimer);                    openTimer = 0;                } else {                    // 否则倒计时开始关闭。                    closeTimer = closeTimer || setTimeout(function() {                        closeTimer = 0;                        options.hide && options.hide(e);                    }, closeDelay);                }            };        // 移到目标节点则显示浮层。        target.on("mouseenter", openCallback);        // 移出目标节点则倒计时隐藏。        target.on("mouseleave", closeCallback);        if (event !== "hover") {            closeDelay *= 8;            // 移到当前节点则不再显示。            me.elem.on("mouseenter", openCallback);            // 移出目标节点则倒计时隐藏。            me.elem.on("mouseleave", closeCallback);        }    } else if (triggerEvent === "focus") {
        // 设置获取焦点后显示浮层，全局除浮层和目标外单击关闭。
        target.on(triggerEvent, function (e) {

            // 不重复显示。
            if (me.isHidden()) {

                // 设置全局点击之后隐藏浮层。
                document.on("mousedown", function (e) {

                    // 不处理下拉菜单本身事件。
                    // 不处理目标本身。
                    if (!me.elem.contains(e.target) && (!target || !target.contains(e.target))) {

                        // 确保当前事件只执行一次。
                        document.off("mousedown", arguments.callee);

                        // 隐藏浮层。
                        me.hide(e);

                    }

                }, this);

                // 显示浮层。
                me.show(e);

            }
        });
    } else if (triggerEvent === "click") {
        // 设置点击后切换隐藏。
        target.on(triggerEvent, function (e) {

            if (me.isHidden()) {

                // 设置隐藏事件。
                document.on("mousedown", function (e) {

                    // 不处理下拉菜单本身事件。
                    if (!me.elem.contains(e.target)) {

                        // 如果在目标节点点击，则直接由目标节点调用 hide()。
                        if (!target || !target.contains(e.target)) {
                            me.hide(e);
                            trace("hided");
                        }

                        // 确保当前事件只执行一次。
                        document.off("mousedown", arguments.callee);
                    }

                }, this);

                me.show(e);

            } else {
                me.hide(e);
            }
        });
    } else if (triggerEvent === "active") {
        target.on("focus", this.show, this);
        target.on("blur", this.hide, this);
    }};