/**
 * @fileOverview 对齐节点。
 * @author xuld 
 */

// #require base
// #require rect

/**
 * 设置当前节点的位置，使其依靠现有的其它节点。
 * @param {Element} target 依靠的目标节点。
 * @param {String} align 依靠的位置。位置使用 4 个字符或 1-2 个字符组成。
 * 当使用 1-2 个字符时，可以使用的位置字符串分别如图：
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
 * 当使用 4 个字符时，
 * 
 * 前两位表示 X 方向的定位，其意义为：
 * ll │ lr    c   rl │ rr 
 * 
 * 后两位表示 Y 方向的定位，其意义为：
 * 
 *   tt 
 *  ────
 *   tb
 *     
 *   c 
 *     
 *   bt
 *  ────
 *   bb 
 * 
 * 合法的例子比如：'llbt'，其意义同 'lb'。 
 * 
 * 只当使用 1-2 个字符时，元素将根据容器范围自动切换位置以保证容器是完全可见范围内的。
 * 
 * @param {Number} [offsetX=0] 偏移的 X 大小。
 * @param {Number} [offsetY=0] 偏移的 Y 大小。
 * @param {Element} [container=document] 如果设置此元素，则超过此区域后重置位置。
 * @param {Number} [padding=10] 容器的内边距。
 * @returns {Object} 返回实际定位的位置。
 * 其中，offsetX 和 offsetY 表示为适应屏幕而导致位置发生的偏移量。如果未偏移则为 undefined。
 * 其中，overflowX 和 overflowY 表示为超过屏幕大小而产生越界，对应的值表示容器的最大值。如果未越界则为 undefined。
 */
Element.prototype.pin = function (target, align, offsetX, offsetY, container, padding) {

    // allowReset 意义：
    //     第一次：undefined, 根据 align 判断是否允许。
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
        fixType = align.length < 3 ? 1 : 0;

    // 处理允许翻转的水平位置。
    // pos：1 | 2     0     3 | 4
    // fixType: 0: 不允许修复， 1：允许修复   2：已进行修复，使用侧边值修复
    function proc(xOrY, leftOrTop, widthOrHeight, offset, pos, fixType) {

        // 默认依靠左边开始计算。
        var result = targetRect[leftOrTop];

        // 如果居中，则加上宽度一半。
        if (pos === 0) {
            result += (targetRect[widthOrHeight] - rect[widthOrHeight]) / 2;

            // 如果超出屏幕，则修复到屏幕的边缘。
            if (fixType && (result < containerRect[leftOrTop] || result > containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight])) {
                fixType = result < containerRect[leftOrTop] ? containerRect[leftOrTop] : containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight];
                rect['offset' + xOrY] = fixType - result;
                result = fixType;
            }

        } else {

            // 3 & 4 依靠右边计算。
            if (pos > 2) {
                result += targetRect[widthOrHeight];
            }

            // 1 & 3 需要减去自身宽度。
            // 1 & 3 需要加上偏移度否则需要减去偏移度。
            result += pos & 1 ? -rect[widthOrHeight] - offset : offset;

            // 如果超出屏幕，则翻转到另一边。
            // 如果翻转之后超出屏幕，则不翻转并修复到屏幕的边缘。
            if (fixType && (
                ((pos & 1) && result < containerRect[leftOrTop]) ||
                (!(pos & 1) && result > containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight]))
            ) {

                // 如果 fixType === 2，表示之前已经超出，重新布局后仍然超出，说明左右都超出，这时布局到左边并设置超出距离。
                if (fixType > 1) {
                    rect['overflow' + xOrY] = containerRect[widthOrHeight];
                    //// 考虑文档方向。
                    // return document.dir === "rtl" ? containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight] : containerRect[leftOrTop];
                    return containerRect[leftOrTop];
                }

                // 翻转位置重新定位。
                fixType = proc(xOrY, leftOrTop, widthOrHeight, offset, 5 - pos, 2);
                rect['offset' + xOrY] = fixType - result;
                result = fixType;

            }

        }

        return rect[leftOrTop] = result;
    }

    align = Element.pinAligners[align] || align;
    padding = padding === undefined ? 10 : padding;
    containerRect.left += padding;
    containerRect.width -= padding * 2;
    containerRect.top += padding;
    containerRect.height -= padding * 2;
    proc('X', 'left', 'width', offsetX || 0, align.charAt(0) === 'c' ? 0 : (align.charAt(0) === 'r' ? 3 : 1) + (align.charAt(1) === 'r'), fixType);
    proc('Y', 'top', 'height', offsetY || 0, align.charAt(2) === 'c' ? 0 : (align.charAt(2) === 'b' ? 3 : 1) + (align.charAt(3) === 'b'), fixType);

    elem.setPosition(rect);

    return rect;

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
