/** * @author xuld */

// #require base.js

/**
 * 滑动元素事件。
 * @param {Element} elem 滑动的元素。
 * @param {Options} options 各个方向滑动的处理函数。
 */
Dom.swipe = function (elem, options) {

    var swippable = {

        /**
         * 设置当前拖动的节点。
         */
        elem: elem,

        /**
         * 当前滑动的状态。0：未滑动；1：水平滑动；2：垂直滑动。
         */
        state: 0,

        /**
         * 产生滑动事件的最少步长。
         */
        step: 10,

        /**
         * 区分垂直滑动或水平滑动的角度。
         */
        ratio: .5,

        /**
         * 处理 mousedown 事件。
         * 初始化拖动，当单击时，执行这个函数，但不触发 dragStart。
         * 只有鼠标移动时才会继续触发 dragStart。
         * @param {Event} e 事件参数。
         */
        handlerMouseDown: function (e) {

            // 只处理左键拖动。
            if (e.which === 1) {

                swippable.state = 0;
                swippable.startX = e.pageX;
                swippable.startY = e.pageY;

                // 绑定拖动和停止拖动事件。
                var doc = Dom.getDocument(swippable.elem);
                Dom.on(doc, 'mouseup', swippable.handlerMouseUp);
                Dom.on(doc, 'mousemove', swippable.handlerMouseMove);

            }

        },

        /**
         * 处理 mousemove 事件。
         * @param {Event} e 事件参数。
         */
        handlerMouseMove: function (e) {

            swippable.endX = e.pageX;
            swippable.endY = e.pageY;

            if (swippable.state === 0) {

                var deltaX = swippable.endX - swippable.startX,
                    deltaY = swippable.endY - swippable.startY;

                // 滑动范围太小，忽略滑动。
                if (deltaX * deltaX + deltaY * deltaY < swippable.step * swippable.step) {
                    return;
                }

                // 开始进入滑动状态。
                swippable.state = Math.abs(deltaY / deltaX) < swippable.ratio ? 1 : 2;

                // 开始滑动事件。
                swippable.onSwipeStart && swippable.onSwipeStart(e);

            } else {
                swippable.onSwipeMove && swippable.onSwipeMove(e);
            }

        },

        /**
         * 处理 mouseup 事件。
         * @param {Event} e 事件参数。
         * 这个函数调用 onDragEnd 和 afterDrag
         */
        handlerMouseUp: function (e) {

            // 只有鼠标左键松开， 才认为是停止拖动。
            if (e.which === 1) {

                // 绑定拖动和停止拖动事件。
                var doc = Dom.getDocument(swippable.elem);
                Dom.off(doc, 'mousemove', swippable.handlerMouseMove);
                Dom.off(doc, 'mouseup', swippable.handlerMouseUp);

                swippable.onSwipeEnd && swippable.onSwipeEnd(e);
            }


        }

    };

    // 使用用户自定义配置覆盖默认配置。
    for (var key in options) {
        swippable[key] = options[key];
    }

    Dom.on(swippable.elem, 'mousedown', swippable.handlerMouseDown);

    return swippable;

};
