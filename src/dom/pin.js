/**
 * @author xuld 
 */

// #require base.js
// #require rect.js

/**
 * 设置指定节点的位置，使其依靠现有的其它节点。
 * @param {Element} elem 要设置的元素。
 * @param {Element} target 依靠的目标节点。
 * @param {String} align  依靠的位置。如 ll-bb 。完整的说明见备注。
 * @param {Number} [offsetX=0] 偏移的 X 大小。
 * @param {Number} [offsetY=0] 偏移的 Y 大小。
 * @param {Function} [repinCallback] 当设置的位置发生改变的回调。
 * @param {Element} [container=document] 如果设置此元素，则超过此区域后重置位置。
 */
Dom.pin = function (elem, target, position, offsetX, offsetY, repinCallback, container) {

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

    // position 意义：
    //     一共是八位数字，前四位是 X 轴，后四位是 Y 轴。
    //     四位之中，可能有以下 5 种可能。
    //     1000(8): 左边的左边。
    //     0100(4): 左边的右边。
    //     0010(2): 右边的左边。
    //     0001(1): 右边的右边。
    //     0000(0): 居中。

    // allowReset 意义：
    //     第一次：undefined, 根据 position 判断是否允许。
    //     第二次：true。
    //     第三次：false。

    var rect = Dom.getRect(elem),
        targetRect = target instanceof Event ? { left: target.pageX, top: target.pageY, width: 0, height: 0 } : Dom.getRect(target),
        containerRect = (container === undefined ? (container = document) : container) && container.nodeType ? Dom.getRect(container) : container;

    function proc(position, offset, leftOrTop, widthOrHeight, allowReset) {

        // 首先定位在容器左边。
        rect[leftOrTop] = targetRect[leftOrTop];

        // 测试是否居中。
        if (position & 15) {

            // 如果定位在右边则添加目标宽度。
            // 如果定位在边左边，则减去节点宽度。
            rect[leftOrTop] += (position & 3 ? targetRect[widthOrHeight] : 0) + (position & 5 ? offset : -rect[widthOrHeight] - offset);

            // 如果超出边界和进行重置。

            containerRect && (rect[leftOrTop] < containerRect[leftOrTop] || rect[leftOrTop] > containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight]) && (allowReset == undefined ? position & 9 : allowReset) && (!repinCallback || repinCallback(rect, position, offset, leftOrTop, widthOrHeight) !== false) && proc(position & 1 ? 8 : 1, offset, leftOrTop, widthOrHeight, !allowReset);

        } else {
            rect[leftOrTop] += (targetRect[widthOrHeight] - rect[widthOrHeight]) / 2;
        }

        // 只在第一次处理过程执行。
        if (allowReset == undefined) {

            if (containerRect) {
                rect[leftOrTop] = Math.max(containerRect[leftOrTop], Math.min(rect[leftOrTop], containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight]));
            }

            delete rect[widthOrHeight];
        }

    }

    position = Dom.pin.aligners[position] || position;
    proc(position >> 4, offsetX || 0, 'left', 'width');
    proc(position, offsetY || 0, 'top', 'height');

    Dom.setRect(elem, rect);

};

Dom.pin.aligners = {
    bl: 4 << 4 | 1,
    lt: 8 << 4 | 4,
    left: 8 << 4,
    lb: 8 << 4 | 2,
    bottom: 1,
    br: 2 << 4 | 1,
    rb: 1 << 4 | 2,
    right: 1 << 4,
    rt: 1 << 4 | 4,
    tr: 2 << 4 | 8,
    top: 8,
    tl: 4 << 4 | 8
};
