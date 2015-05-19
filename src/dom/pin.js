/**
 * @author xuld 
 */

// #require base.js
// #require offset.js

/**
 * 设置指定节点的位置，使其依靠现有的其它节点。
 * @param {Element} elem 要设置的元素。
 * @param {Element} target 依靠的目标节点。
 * @param {String} align  依靠的位置。如 ll-bb 。完整的说明见备注。
 * @param {Number} [offsetX=0] 偏移的 X 大小。
 * @param {Number} [offsetY=0] 偏移的 Y 大小。
 * @param {Element} [container=document] 如果设置此元素，则超过此区域后重置位置。
 */
Dom.pin = function (elem, target, position, offsetX, offsetY, container) {

    /*
	 *      tl    t   tr
	 *      ------------
	 *   lt |          | rt
	 *      |          |
	 *   l  |     c    | r
	 *      |          |
	 *   lb |          | rb
	 *      ------------
	 *      bl    b   br
	 */

    var rect = Dom.getSize(elem);
    var targetSize = Dom.getSize(target);
    var targetPosition = Dom.getPosition(target);

    function proc(position, r, offset, left, width) {

        // 首先定位在左边。
        rect[left] = targetPosition[left];

        // 定位于中间。
        if (position === 'c') {
            rect[left] += (targetSize[width] - rect[width]) / 2;
        } else {

            // 如果定位在右边则添加目标宽度。
            if (position.charAt(0) === r) {
                rect[left] += targetSize[width];
            }

            // 如果定位在左边，则减去节点宽度。
            if (position.charAt(1) === r) {
                rect[left] += offset;
            } else {
                rect[left] -= rect[width] - offset;
            }

        }

    }

    // 开始定位。
    if (position = Dom.pin.aligners[position] || position) {
        position = position.split('-');
        proc(position[0] || '', 'r', offsetX || 0, 'left', 'width');
        proc(position[1] || '', 'b', offsetY || 0, 'top', 'height');
    } else {
        position = Dom.getPosition(elem);
        rect.left = position.left;
        rect.top = position.top;
    }
    
    // 处理容器大小。
    if (container === undefined) {
        container = document;
    }
    if (container) {
        var containerPosition, containerSize;
        if (container.nodeType) {
            containerPosition = Dom.getPosition(container);
            containerSize = Dom.getSize(container);
        } else {
            containerPosition = containerSize = container;
        }

        var max = containerPosition.left + containerSize.width - rect.width;
        if (rect.left > max) {
            rect.left = max;
        } else if (rect.left < 0) {
            rect.left = 0;
        }

        max = containerPosition.top + containerSize.height - rect.height;
        if (rect.top > max) {
            rect.top = max;
        } else if (rect.top < 0) {
            rect.top = 0;
        }
    }

    Dom.setPosition(elem, rect);

};

Dom.pin.aligners = {
    lt: 'll-tb',
    left: 'll-c',
    lb: 'll-bt',
    bl: 'lr-bb',
    bottom: 'c-bb',
    br: 'rl-bb',
    rb: 'rr-bt',
    right: 'rr-c',
    rt: 'rr-tb',
    tr: 'rl-tt',
    top: 'c-tt',
    tl: 'lr-tt'
};
