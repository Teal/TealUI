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
 * @param {Function} [repinXCallback] 当水平设置的位置发生翻转的回调。
 * @param {Function} [repinYCallback] 当垂直设置的位置发生翻转的回调。
 * @param {Element} [container=document] 如果设置此元素，则超过此区域后重置位置。
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
Element.prototype.pin = function (target, position, offsetX, offsetY, reverseCallback, reoffsetCallback, container) {

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
        posX,
        posY;

    // 处理允许翻转的水平位置。
    // posX：1 | 2     3     4 | 5
    // fixType: 0: 不允许修复， 1：允许修复   2：已进行修复，使用侧边值修复
    function proc(targertLeftOrTop, targetWidthOrHeight, containerLeftOrTop, containerWidthOrHeight, widthOrHeight, offsetXOrY, posX, posY, fixType) {
        
        // 默认依靠左边开始计算。
        var result = targertLeftOrTop;

        // 如果居中，则加上宽度一半。
        if (posX === 3) {
            result += (targetWidthOrHeight - widthOrHeight) / 2;

            if (posY === 1 || posY === 5) {
                if (result < containerLeftOrTop) {
                    reoffsetCallback && reoffsetCallback.call(elem, containerLeftOrTop - result);
                    return containerLeftOrTop;
                }
                if (result > (fixType = containerLeftOrTop + containerWidthOrHeight - widthOrHeight)) {
                    reoffsetCallback && reoffsetCallback.call(elem, fixType - result);
                    return fixType;
                }
            }

        } else {

            // 4 & 5 依靠右边计算。
            if (posX > 3) {
                result += targetWidthOrHeight;
            }

            // 1 & 4 需要减去自身宽度。
            if (posX === 1 || posX === 4) {
                result -= widthOrHeight;
            }

            // 1 & 5 需要加上偏移度否则需要减去偏移度。
            result += posX === 1 || posX === 5 ? offsetXOrY : -offsetXOrY;

            // 超出左屏则显示在右屏。
            if (fixType) {
                if (posX === 1 && result < containerLeftOrTop) {
                    return fixType === 2 ? containerLeftOrTop + containerWidthOrHeight - widthOrHeight : proc(targertLeftOrTop, targetWidthOrHeight, containerLeftOrTop, containerWidthOrHeight, widthOrHeight, offsetXOrY, 5, posY, 2);
                }
                if (posX === 5 && result > containerLeftOrTop + containerWidthOrHeight - widthOrHeight) {
                    return fixType === 2 ? containerLeftOrTop : proc(targertLeftOrTop, targetWidthOrHeight, containerLeftOrTop, containerWidthOrHeight, widthOrHeight, offsetXOrY, 1, posY, 2);
                }

                // 如果当前已经执行了翻转修复且没有再溢出，则必须调用回调。
                fixType === 2 && reverseCallback && reverseCallback.call(elem);

            }

        }

        return result;
    }

    position = Element.pinAligners[position] || position;

    posX = position.charAt(0) === 'c' ? 3 : position.charAt(0) === 'l' ? (position.charAt(1) === 'l' ? 1 : 2) : (position.charAt(1) === 'l' ? 4 : 5);
    posY = position.charAt(2) === 'c' ? 3 : position.charAt(2) === 't' ? (position.charAt(3) === 't' ? 1 : 2) : (position.charAt(3) === 't' ? 4 : 5);

    rect.left = proc(targetRect.left, targetRect.width, containerRect.left, containerRect.width, rect.width, offsetX || 0, posX, posY, 1);
    rect.top = proc(targetRect.top, targetRect.height, containerRect.top, containerRect.height, rect.height, offsetY || 0, posY, posX, 1);

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
