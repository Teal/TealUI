/**
 * @fileOverview 对齐节点。
 * @author xuld 
 */

typeof include === "function" && include("dom");

/**
 * 设置当前节点列表每一项的位置使其依靠现有的节点布局。
 * @param {Dom} target 依靠的目标节点。
 * @param {String} align 依靠的位置。位置用 1、2 或 4 个字符表示。
 * 当使用 1-2 个字符表示时，可以使用的位置字符串分别如图：
 *      
 *           "tl"   "t"   "tr"
 *           ┌───────────────┐
 *       "lt"│               │ "rt"
 *           │               │
 *        "l"│      "c"      │ "r"
 *           │               │
 *       "lb"│               │ "rb"
 *           └───────────────┘
 *           "bl"   "b"   "br"
 *      
 * 当使用 4 个字符表示时，则前后两位各表示 X 和 Y 方向的定位。
 * 
 * 前两位表示 X 方向的定位，其意义为：
 *      
 *       "ll" │ "lr"    "cc"   "rl" │ "rr" 
 * 
 * 后两位表示 Y 方向的定位，其意义为：
 *      
 *        "tt" 
 *       ──────
 *        "tb"
 *          
 *        "cc" 
 *          
 *        "bt"
 *       ──────
 *        "bb" 
 *      
 * 比如："llbt" 表示 X 方向显示在左边之左，Y 方向显示在下边之上。最终效果同 "lb"。
 * 
 * 只当使用 1-2 个字符时，元素将根据容器范围自动切换位置以保证当前节点显示在可见范围内。
 * 
 * @param {Number} [offsetX=0] X 方向偏移距离。
 * @param {Number} [offsetY=0] Y 方向偏移距离。
 * @param {mixed} [container=document] 限制的显示区域或对应的容器节点。
 * @param {Number} [padding=10] 额外设置容器的内边距。
 * @param {Function} [callback] 定位完成后的回调。其参数为：
 * * @param {Object} rect 包含实际定位的结果。可能包含的字段有：
 * * * @param {Number} [offsetX] 为适应屏幕而导致位置发生的水平偏移量。
 * * * @param {Number} [offsetY] 为适应屏幕而导致位置发生的垂直偏移量。
 * * * @param {Number} [overflowX] 超过屏幕宽度而产生越界，对应的值表示容器的最大值。
 * * * @param {Number} [overflowY] 超过屏幕高度而产生越界，对应的值表示容器的最大值。
 * @returns this
 * @example $("#elem").pin("#target", "rb")
 */
Dom.prototype.pin = function (target, align, offsetX, offsetY, container, padding, callback) {

    var aligns = Dom._aligns || (Dom._aligns = {
        bl: "lrbb",
        lt: "lltb",
        l: "llcc",
        lb: "llbt",
        b: "ccbb",
        br: "rlbt",
        rb: "lrbb",
        r: "rrcc",
        rt: "rrtb",
        tr: "rltt",
        t: "cctt",
        tl: "lltt"
    });

    // 确定容器区域。
    var containerRect = container && container.top != null && container.width != null ? container : (Dom(container).valueOf() || Dom(document)).rect();
    padding = padding === undefined ? 10 : padding;
    containerRect.left += padding;
    containerRect.width -= padding * 2;
    containerRect.top += padding;
    containerRect.height -= padding * 2;

    // 确定目标区域。
    var targetRect = target instanceof Event ? {
        left: target.pageX,
        top: target.pageY,
        width: 0,
        height: 0
    } : Dom(target).rect();
    var fixType = align.length < 3 ? 1 : 0;

    // 处理允许翻转的水平位置。
    // pos：1 | 2     0     3 | 4
    // fixType: 0: 不允许修复， 1：允许修复   2：已进行修复，使用侧边值修复
    function proc(xOrY, leftOrTop, widthOrHeight, offset, pos, fixType, rect) {

        // 默认依靠左边开始计算。
        var result = targetRect[leftOrTop];

        // 如果居中，则加上宽度一半。
        if (pos === 0) {
            result += (targetRect[widthOrHeight] - rect[widthOrHeight]) / 2;

            // 如果超出屏幕，则修复到屏幕的边缘。
            if (fixType && (result < containerRect[leftOrTop] || result > containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight])) {
                fixType = result < containerRect[leftOrTop] ? containerRect[leftOrTop] : containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight];
                rect["offset" + xOrY] = fixType - result;
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
                    rect["overflow" + xOrY] = containerRect[widthOrHeight];
                    //// 考虑文档方向。
                    // return document.dir === "rtl" ? containerRect[leftOrTop] + containerRect[widthOrHeight] - rect[widthOrHeight] : containerRect[leftOrTop];
                    return containerRect[leftOrTop];
                }

                // 翻转位置重新定位。
                fixType = proc(xOrY, leftOrTop, widthOrHeight, offset, 5 - pos, 2, rect);
                rect["offset" + xOrY] = fixType - result;
                result = fixType;

            }

        }

        return rect[leftOrTop] = result;
    }

    // 确定实际位置。
    align = aligns[align] || align;

    return this.each(function (elem) {
        elem = Dom(elem);
        var rect = elem.rect();
        proc("X", "left", "width", offsetX || 0, align.charAt(0) === "c" ? 0 : (align.charAt(0) === "r" ? 3 : 1) + (align.charAt(1) === "r"), fixType, rect);
        proc("Y", "top", "height", offsetY || 0, align.charAt(2) === "c" ? 0 : (align.charAt(2) === "b" ? 3 : 1) + (align.charAt(3) === "b"), fixType, rect);

        // 设置节点位置。
        delete rect.width;
        delete rect.height;
        elem.rect(rect);

        // 调用回调。
        callback && callback.call(elem, rect);
    });

};