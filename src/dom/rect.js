/**
 * @author xuld
 * @fileOverview 提供 DOM 操作的辅助函数。
 */

/**
 * 获取指定节点的区域。
 * @param {Element} elem 要计算的元素。
 * @return {DOMRect} 返回所在区域。其包含 left, top, width, height, top, right, bottom, left 属性。
 * @remark
 * 此方法对可见和隐藏元素均有效。
 * 获取元素实际占用大小（包括内边距和边框）。
 * @example
 * 获取第一段落实际大小。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.getRect(Dom.find("p:first"));</pre>
 * #####结果:
 * <pre lang="htm" format="none">{left=200,top=100}</pre>
 */
Dom.getRect = function (elem) {
    var doc = Dom.getDocument(elem),
        html = doc.documentElement,
        htmlScroll = Dom.getDocumentScroll(doc),
        result = {
            left: htmlScroll.left,
            top: htmlScroll.top
        }, rect;

    // 对于 document，返回 scroll 。
    if (elem.nodeType === 9) {
        result.width = html.clientWidth;
        result.height = html.clientHeight;
    } else {
        rect = elem.getBoundingClientRect();
        result.left += rect.left - html.clientLeft;
        result.top += rect.top - html.clientTop;
        result.width = rect.width;
        result.height = rect.height;
    }
    return result;
};

/**
 * 设置指定节点的可视区域大小。
 * @param {Element} elem 要设置的元素。
 * @param {DOMRect} value 要设置的宽或一个包含 left、top、width、height 属性的对象。
 * @remark
 * 设置元素实际占用大小（包括内边距和边框，但不包括滚动区域之外的大小）。
 * 此方法对可见和隐藏元素均有效。
 * @example
 * 设置 id=myP 的段落的大小。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p id="myP"&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.setRect(Dom.get("myP"), {left:200,top:100});</pre>
 */
Dom.setRect = function (elem, value) {

    var style = elem.style;

    // 设置宽度。
    if (value.width != null || value.height != null) {
        var borderBox = Dom.getStyle(elem, 'boxSizing') === 'border-box';
        if (value.width != null) {
            style.width = value.width - (borderBox ? 0 : Dom.calcStyleExpression(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight')) + 'px';
        }
        if (value.height != null) {
            style.height = value.height - (borderBox ? 0 : Dom.calcStyleExpression(elem, 'borderTopWidth+borderBottomWidth+paddingTop+paddingBottom')) + 'px';
        }
    }

    // 设置位置。
    if (value.left != null || value.top != null) {

        // 确保对象可移动。
        Dom.movable(elem);

        var currentPosition = Dom.getRect(elem),
            offset = Dom.getOffset(elem);

        if (value.top != null) {
            style.top = offset.top + value.top - currentPosition.top + 'px';
        }

        if (value.left != null) {
            style.left = offset.left + value.left - currentPosition.left + 'px';
        }

    }

};

/**
 * 获取指定节点的相对位置。
 * @param {Element} elem 要计算的元素。
 * @return {Point} 返回的对象包含两个整型属性：left 和 top。
 * @remark
 * 此方法只对可见元素有效。
 * 
 * 获取匹配元素相对父元素的偏移。
 * @example
 * 获取第一段的偏移
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
 * #####JavaScript:<pre>
 * var p = Dom.query("p").item(0);
 * var offset = p.getOffset();
 * trace( "left: " + offset.left + ", top: " + offset.top );
 * </pre>
 * #####结果:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
 */
Dom.getOffset = function (elem) {

    // 如果设置过 left top ，这是非常轻松的事。
    var left = Dom.getStyle(elem, 'left'),
        top = Dom.getStyle(elem, 'top');

    // 如果未设置过。
    if ((!left || !top || left === 'auto' || top === 'auto') && Dom.getStyle(elem, "position") === 'absolute') {

        // 绝对定位需要返回绝对位置。
        top = Dom.getOffsetParent(elem);
        left = Dom.getRect(elem);
        if (!/^(?:BODY|HTML|#document)$/i.test(top.nodeName)) {
            var t = Dom.getRect(top);
            left.left -= t.left;
            left.top -= t.top;
        }
        left.left -= Dom.calcStyle(elem, 'marginLeft') + Dom.calcStyle(top, 'borderLeftWidth');
        left.top -= Dom.calcStyle(elem, 'marginTop') + Dom.calcStyle(top, 'borderTopWidth');

        return left;
    }

    // 碰到 auto ， 空 变为 0 。
    return {
        left: parseFloat(left) || 0,
        top: parseFloat(top) || 0
    };

};

/**
 * 获取用于让指定节点定位的父对象。
 * @param {Element} elem 要设置的元素。
 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
 */
Dom.getOffsetParent = function (elem) {
    var p = elem;
    while ((p = p.offsetParent) && !/^(?:BODY|HTML|#document)$/i.test(p.nodeName) && Dom.getStyle(p, "position") === "static");
    return p || elem.ownerDocument.body;
};

/**
 * 设置一个元素可移动。
 * @param {Element} elem 要处理的元素。
 * @static
 */
Dom.movable = function (elem) {
    if (!/^(?:abs|fix)/.test(Dom.getStyle(elem, "position")))
        elem.style.position = "relative";
};

/**
 * 获取指定节点的滚动区域大小。
 * @param {Element} elem 要计算的元素。
 * @return {Point} 返回的对象包含两个整型属性：left 和 top。
 * @remark
 * getScrollSize 获取的值总是大于或的关于 getSize 的值。
 * 此方法对可见和隐藏元素均有效。
 */
Dom.getScrollSize = function (elem) {
    return elem.nodeType === 9 ? {
        width: Math.max(elem.documentElement.scrollWidth, elem.body.scrollWidth, elem.clientWidth),
        height: Math.max(elem.documentElement.scrollHeight, elem.body.scrollHeight, elem.clientHeight)
    } : {
        width: elem.scrollWidth,
        height: elem.scrollHeight
    };
};

/**
 * 获取文档的滚动位置。
 * @param {Document} doc 要计算的文档。
 * @return {Point} 返回的对象包含两个整型属性：left 和 top。
 */
Dom.getDocumentScroll = function (doc) {
    var win;
    return 'pageXOffset' in (win = doc.defaultView || doc.parentWindow) ? {
        left: win.pageXOffset,
        top: win.pageYOffset
    } : {
        left: doc.documentElement.scrollLeft,
        top: doc.documentElement.scrollTop
    };
};

/**
 * 获取指定节点的滚动条的位置。
 * @param {Element} elem 要计算的元素。
 * @return {Point} 返回的对象包含两个整型属性：left 和 top。
 * @remark
 * 此方法对可见和隐藏元素均有效。
 *
 * @example
 * 获取第一段相对滚动条顶部的偏移。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>
 * var p = Dom.query("p").item(0);
 * trace( "scrollTop:" + p.getScroll() );
 * </pre>
 * #####结果:
 * <pre lang="htm" format="none">
 * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;scrollTop: 0&lt;/p&gt;
 * </pre>
 */
Dom.getScroll = function (elem) {
    return elem.nodeType === 9 ? Dom.getDocumentScroll(elem) : {
        left: elem.scrollLeft,
        top: elem.scrollTop
    };
};

/**
 * 设置指定节点的滚动条位置。
 * @param {Element} elem 要设置的元素。
 * @param {Number/Point} left 要设置的水平坐标或一个包含 left、top 属性的对象。如果不设置，使用 null 。
 * @param {Number} top 要设置的垂直坐标。如果不设置，使用 null 。
 * @return this
 */
Dom.setScroll = function (elem, value) {
    if (elem.nodeType === 9) {
        (elem.defaultView || elem.parentWindow).scrollTo(
            value.left != null ? value.left : Dom.getDocumentScroll(elem).left,
            value.top != null ? value.top : Dom.getDocumentScroll(elem).top
        );
    } else {
        if (value.t != null) {
            elem.scrollLeft = value.left;
        }
        if (value.top != null) {
            elem.scrollTop = value.top;
        }
    }
};
