/**
 * @author [作者]
 */

/**
 * 让当前元素支持触摸滚动。
 * @param {Object} options 支持的配置。
 */
$.fn.touchScroll = function (options) {

    options = {
        vertical: 0,
        property: 'transform',
        skip: 10,
        ratio: .5
    };

    return this.on('touchstart', function (e) {
        var me = $(this),
            
            // jQuery: e.originalEvent.touches
            // Zepto: e.touches
            touch = (e.touches || e.originalEvent.touches)[0];

        // 确保元素可偏移。
        //if (options.property === 'left' && me.css('position') === 'static') {
        //    me.css('position', 'relative');
        //}

        // 关闭滑动特效以跟随拖动。
        me.css({
            '-moz-transition': 'none',
            '-o-transition': 'none',
            '-webkit-transition': 'none',
            'transition': 'none'
        });

        var session = {
            startX: touch.clientX,
            startY: touch.clientY,
            currentX: 0,
            currentY: 0,
            state: 0, // 0: 未拖动，1：正在拖动，3：正在默认拖动
            touchEnd: function (e) {
                e.preventDefault();
                me.off('touchmove', session.touchMove).off('touchend', session.touchEnd);

                if (session.state === 1) {

                    // 确定当前实际需要显示的项。
                    var items = me.children(),
                        width = 0,
                        endX = -session.currentX;

                    for (var i = 0; i < items.length; i++) {

                        // 原始宽度。
                        var oldWidth = width;

                        // 计算新宽度。
                        width += items[i].offsetWidth + (parseFloat(items.eq(i).css('marginLeft')) || 0) + (parseFloat(items.eq(i).css('marginRight')) || 0);

                        // 宽度超过当前坐标，则最后显示坐落在当前帧内。
                        if (width > endX) {
                            endX = i < items.length - 1 && (endX > oldWidth + (width - oldWidth) / 2) ? width : oldWidth;
                            break;
                        }

                    }

                    // 开始恢复定位逻辑。
                    me.css({
                        '-moz-transition': '-webkit-transform .3s',
                        '-o-transition': '-webkit-transform .3s',
                        '-webkit-transition': '-webkit-transform .3s',
                        'transition': 'transform .3s',
                        'transform': 'translateX(' + -endX + 'px) translateZ(0)'
                    });
                    options.touchEnd && options.touchEnd(session);

                }

            },
            touchMove: function (e) {
                var touch = (e.touches || e.originalEvent.touches)[0],
                    deltaX = touch.clientX - session.startX,
                    deltaY = touch.clientY - session.startY;

                // 如果刚开始移动，则判断是否移动一段距离。
                if (session.state === 0) {

                    // 拖动范围太小，忽略拖动。
                    if (deltaX * deltaX + deltaY * deltaY < options.skip * options.skip) {
                        return;
                    }

                    session.state = (Math.abs(deltaY / deltaX) > options.ratio) == options.vertical ? 1 : 2;
                    options.touchStart && options.touchStart(session);

                }

                // 如果正在拖动。
                if (session.state === 1) {
                    e.preventDefault();

                    session.currentX = session.startLeft + touch.clientX - session.startX;
                    me.css('transform', 'translateX(' + session.currentX + 'px) translateZ(0)');

                    options.touchMove && options.touchMove(session);
                }

            }
        };

        // 保存开始触摸操作时的坐标。
        // "matrix(1, 0, 0, 1, -95, 0)"
        var transform = /(-?\d+),\s*(-?\d+)\)/.exec(me.css('transform'));
        if (!transform) {
            me.css('transform', 'translateX(0) translateY(0) translateZ(0)');
            transform = [0, 0, 0];
        }
        session.startLeft = +transform[1];

        // 开始监听滚动。
        me.on('touchend', session.touchEnd).on('touchmove', session.touchMove);

    });
};

