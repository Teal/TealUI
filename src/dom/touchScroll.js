/**
 * @author [作者]
 */

/**
 * 让当前元素支持触摸滚动。
 */
$.fn.touchScroll = function (options) {

    options = {
        horizonal: 1,
        vertical: 0,
        property: 'transform'
    };

    return this.on('touchstart', function (e) {
        var me = $(this);

        // 确保元素可偏移。
        //if (options.property === 'left' && me.css('position') === 'static') {
        //    me.css('position', 'relative');
        //}
        me.css({
            '-moz-transition': 'none',
            '-o-transition': 'none',
            '-webkit-transition': 'none',
            'transition': 'none'
        });

        // jQuery: e.originalEvent.touches
        // Zepto: e.touches
        var touch = (e.touches || e.originalEvent.touches)[0];
        var session = {
            startX: touch.clientX,
            startY: touch.clientY,
            touchEnd: function (e) {
                e.preventDefault();
                me.off('touchmove', session.touchMove).off('touchend', session.touchEnd);

                // 获取触摸完成操作时的坐标。
                var transform = /(-?\d+),\s*(-?\d+)\)/.exec(me.css('transform')) || [0, 0, 0];

                // 确定当前实际需要显示的项。
                var items = me.children(),
                    width = 0,
                    endX = -transform[1];

                for (var i = 0; i < items.length; i++) {

                    // 原始宽度。
                    var oldWidth = width;

                    // 计算新宽度。
                    width += items[i].offsetWidth + (parseFloat(items.eq(i).css('marginLeft')) || 0) + (parseFloat(items.eq(i).css('marginRight')) || 0);

                    // 宽度超过当前坐标，则最后显示坐落在当前帧内。
                    if (width > endX) {
                        endX = i < items.length - 1 && (endX > oldWidth + (width - oldWidth) / 4) ? width : oldWidth;
                        break;
                    }

                }

                // 开始恢复定位逻辑。
                me.css({
                    '-moz-transition': '-webkit-transform .6s',
                    '-o-transition': '-webkit-transform .6s',
                    '-webkit-transition': '-webkit-transform .6s',
                    'transition': 'transform .6s'
                });
                me.css('transform', 'translateX(' + -endX + 'px) translateZ(0)');

            },
            touchMove: function (e) {
                var touch = (e.touches || e.originalEvent.touches)[0];
                var ratio = Math.abs((touch.clientY - session.startY) / (touch.clientX - session.startX));

                // 如果滚动方向是垂直滚动，作为屏幕滚动。
                if (ratio <= .5) {
                    e.preventDefault();
                    me.css('transform', 'translateX(' + (session.startLeft + (touch.clientX - session.startX)) + 'px) translateZ(0)');
                }

            }
        };

        // 保存开始触摸操作时的坐标。
        // "matrix(1, 0, 0, 1, -95, 0)"
        var transform = /(-?\d+),\s*(-?\d+)\)/.exec(me.css('transform')) || [0, 0, 0];
        session.startLeft = +transform[1];

        me.on('touchend', session.touchEnd).on('touchmove', session.touchMove);

    });
};

