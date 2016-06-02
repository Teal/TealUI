// #todo

/**
 * @author xuld@vip.qq.com
 */

/**
 * ���õ�ǰ�ڵ��ĵ��㡣
 * @param {Object} [options] ���������á� 
 * @returns this
 */
Dom.prototype.popover = function (options) {

    var popover = {
        dom: this,
        delay: 30,
        isHidden: function () {
            return this.dom.isHidden();
        },
        show: function () {
            var me = this;
            me.dom.show("opacity", null, 100);
            me.onShow && me.onShow(e);
        },
        hide: function () {
            var me = this;
            me.dom.hide("opacity", null, 100);
            me.onHide && me.onHide(e);
        }
    };

    for (var key in options) {
        popover[key] = options[key];
    }

    var target = popover.target = Dom(popover.target);

    switch (event) {
        case "click":
            target.on(event, function (e) {
                if (popover.isHidden()) {
                    var targetElem = this;
                    // ���������¼���
                    Dom(document).on("mousedown", function (e) {
                        // �����������˵������¼���
                        if (!popover.dom.contains(e.target)) {

                            // ������Ŀ���ڵ���������ֱ����Ŀ���ڵ����� hide()��
                            if (!Dom.contains(targetElem, e.target)) {
                                popover.hide(e);
                            }

                            // ȷ����ǰ�¼�ִֻ��һ�Ρ�
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
                // �������ڹرգ��򲻹رձ��ִ���״̬��
                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = 0;
                } else {
                    // ���򵹼�ʱ��ʼ�򿪡�
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
                // �������ڴ򿪣��򲻴򿪱��ֹر�״̬��
                if (openTimer) {
                    clearTimeout(openTimer);
                    openTimer = 0;
                } else {
                    // ���򵹼�ʱ��ʼ�رա�
                    closeTimer = closeTimer || setTimeout(function () {
                        closeTimer = 0;
                        popover.hide(e);
                    }, closeDelay);
                }
            }

            // �Ƶ�Ŀ���ڵ�����ʾ���㡣
            // �Ƴ�Ŀ���ڵ��򵹼�ʱ���ء�
            target.on("mouseenter", openCallback).on("mouseleave", closeCallback);

            // ���� event == "mouseover"
            if (event.length > 5) {

                closeDelay *= 8;

                // �Ƶ���ǰ�ڵ���������ʾ��
                // �Ƴ�Ŀ���ڵ��򵹼�ʱ���ء�
                popover.dom.on("mouseenter", openCallback, window).on("mouseleave", closeCallback);

            }
            break;
        case "focus":
            // ���û�ȡ��������ʾ���㣬ȫ�ֳ�������Ŀ���ⵥ���رա�
            target.on(event, function (e) {
                // ���ظ���ʾ��
                if (popover.isHidden()) {

                    var targetElem = this;

                    // ����ȫ�ֵ���֮�����ظ��㡣
                    Dom(document).on("mousedown", function (e) {

                        // �����������˵������¼���
                        // ������Ŀ�걾����
                        if (!popover.dom.contains(e.target) && !Dom.contains(targetElem, e.target)) {

                            // ȷ����ǰ�¼�ִֻ��һ�Ρ�
                            Dom(document).off("mousedown", arguments.callee);

                            // ���ظ��㡣
                            popover.hide(e);

                        }

                    });

                    // ��ʾ���㡣
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
                // ���������¼���
                Dom(document).on("mousedown", function (e) {

                    // ���ڶ����Ҽ��˵�ʱ��Ѹ�������Ҽ��˵���������ʾ��
                    if (e.which === 3) {
                        popover.dom.hide();
                    } else if (!popover.dom.contains(e.target)) {
                        popover.hide(e);
                    }

                    // ȷ����ǰ�¼�ִֻ��һ�Ρ�
                    Dom(document).off("mousedown", arguments.callee);
                });
                popover.target = Dom(this);
                popover.show(e);
            });
            break;
    }

    return popover;

};
