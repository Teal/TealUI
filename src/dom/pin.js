/**
 * @fileOverview 对齐节点。
 * @author xuld 
 */

// #require base
// #require rect

/**
 * 设置指定节点的位置，使其依靠现有的其它节点。
 * @param {Element} elem 要设置的元素。
 * @param {Element} target 依靠的目标节点。
 * @param {String} align  依靠的位置。如 ll-bb 。完整的说明见备注。
 * @param {Number} [offsetX=0] 偏移的 X 大小。
 * @param {Number} [offsetY=0] 偏移的 Y 大小。
 * @param {Element} [container=document] 如果设置此元素，则超过此区域后重置位置。
 * @returns {Object} 返回实际定位的位置。其中，offsetX 和 offsetY 表示为适应屏幕而导致位置发生的偏移量。
 * @remark 
 * 位置由 1-4 个字符组成。
 * 如果使用 4 个字符表示，则四个字符的意义分别是：
 * 1) X 基轴：左边： l 或右边： r
 * 2) 相对于 X 基轴的位置：左边： l 或右边： r
 * 3) Y 基轴：上边： l 或下边： b
 * 4) 相对于 Y 基轴的位置：上边： l 或下边： b
 * 如果使用 3 个字符表示，则三个字符的意义分别是：
 * 
 * 如果使用 1-2 个字符表示，则意义如下图：
 * 
 *      tl    t   tr
 *      ┌──────────┐
 *   lt │          │ rt
 *      │          │
 *   l  │     c    │ r
 *      │          │
 *   lb │          │ rb
 *      └──────────┘
 *      bl    b   br
 * 
 * 位置重载策略：
 * 当使用 1-2 个字符表示时，位置将支持自动更新以确保显示在可视范围内。
 * 对于第一个字符指代的位置，当显示不下时，pin 将负责自动旋转为另一个方向。
 * 对于 t, r, b, l 来说，还将调整其另一个维度的位置以保证整体可见。
 */
Element.prototype.pin = function (target, position, offsetX, offsetY, container) {

    // allowReset 意义：
    //     第一次：undefined, 根据 position 判断是否允许。
    //     第二次：true。
    //     第三次：false。

    var elem = this,
        rect = elem.getRect(),
        targetRect = target instanceof Event ? {
            left: target.pageX,
            top: target.pageY,
            width: 0,
            height: 0
        } : target.getRect(),
        containerRect = (container === undefined ? (container = document) : container) && container.nodeType ? container.getRect() : container,
        pos,
        posY;

    // 处理允许翻转的水平位置。
    // pos：1 | 2     0     4 | 5
    // fixType: 0: 不允许修复， 1：允许修复   2：已进行修复，使用侧边值修复
    function proc(xOrY, leftOrTop, widthOrHeight, offset, pos, fixType) {
        
        // 默认依靠左边开始计算。
        var result = targetRect[leftOrTop];

        // 如果居中，则加上宽度一半。
        if (pos === 0) {
            result += (targetWidthOrHeight - widthOrHeight) / 2;

            // 如果超出屏幕，则修复到屏幕的边缘。
            if (fixType && (result < containerRect[leftOrTop] || result > containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight])) {
                fixType = result < containerRect[leftOrTop] ? containerRect[leftOrTop] : containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight];
                rect['offset' + xOrY] = fixType - result;
                result = fixType;
            }

        } else {

            // 4 & 5 依靠右边计算。
            if (pos > 3) {
                result += targetRect[widthOrHeight];
            }

            // 1 & 4 需要减去自身宽度。
            if (pos === 1 || pos === 4) {
                result -= rect[widthOrHeight];
            }

            // 1 & 5 需要加上偏移度否则需要减去偏移度。
            result += pos === 1 || pos === 5 ? offset : -offset;

            // 如果超出屏幕，则翻转到另一边。
            // 如果翻转之后超出屏幕，则不翻转并修复到屏幕的边缘。
            if (fixType && (
                ((pos === 1 || pos === 4) && result < containerRect[leftOrTop]) ||
                ((pos === 2 || pos === 5) && result > containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight]))
            ) {

                // 如果 fixType === 2，表示之前已经超出，重新布局后仍然超出，说明左右都超出，这时布局到左边并设置超出距离。
                if (fixType === 2) {
                    rect['overflow' + xOrY] = containerRect[widthOrHeight];
                    return containerRect[leftOrTop];
                }

                // 翻转位置重新定位。
                fixType = proc(xOrY, leftOrTop, widthOrHeight, offset, 6 - pos, 2);
                rect['offset' + xOrY] = fixType - result;
                result = fixType;

            }

        }

        return result;
    }

    position = Element.pinAligners[position] || position;

    pos = position.charAt(0) === 'c' ? 3 : position.charAt(0) === 'l' ? (position.charAt(1) === 'l' ? 1 : 2) : (position.charAt(1) === 'l' ? 4 : 5);
    posY = position.charAt(2) === 'c' ? 3 : position.charAt(2) === 't' ? (position.charAt(3) === 't' ? 1 : 2) : (position.charAt(3) === 't' ? 4 : 5);

    rect.left = proc(targetRect.left, targetRect.width, containerRect.left, containerRect.width, rect.width, offsetX || 0, pos, posY, 1);
    rect.top = proc(targetRect.top, targetRect.height, containerRect.top, containerRect.height, rect.height, offsetY || 0, posY, pos, 1);

    elem.setPosition(rect);

};

Element.pinAligners = {
    bl: 'lrbb',
    lt: 'lltb',
    l: 'llcc',
    lb: 'llbt',
    b: 'ccbb',
    br: 'rlbt',
    rb: 'lrbb',
    r: 'rrcc',
    rt: 'rrtb',
    tr: 'rltt',
    t: 'cctt',
    tl: 'lltt'
};
