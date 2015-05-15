/**
 * @author xuld
 * @fileOverview 提供 DOM 操作的辅助函数。
 */

/**
 * 获取指定节点的可视区域大小。包括 border 大小。
 * @param {Element} elem 要计算的元素。
 * @return {Point} 大小。
 * @remark
 * 此方法对可见和隐藏元素均有效。
 * 获取元素实际占用大小（包括内边距和边框）。
 * @example
 * 获取第一段落实际大小。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.getSize(Dom.find("p:first"));</pre>
 * #####结果:
 * <pre lang="htm" format="none">{x=200,y=100}</pre>
 */
Dom.getSize = function (elem) {
    return elem.nodeType === 9 ? {
        width: elem.documentElement.clientWidth,
        height: elem.documentElement.clientHeight,
    } : {
        width: elem.offsetWidth,
        height: elem.offsetHeight
    };
};

/**
 * 设置指定节点的可视区域大小。
 * @param {Element} elem 要设置的元素。
 * @param {Number/Point} x 要设置的宽或一个包含 x、y 属性的对象。如果不设置，使用 null 。
 * @param {Number} y 要设置的高。如果不设置，使用 null 。
 * @return this
 * @remark
 * 设置元素实际占用大小（包括内边距和边框，但不包括滚动区域之外的大小）。
 * 此方法对可见和隐藏元素均有效。
 * @example
 * 设置 id=myP 的段落的大小。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p id="myP"&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.setSize(Dom.get("myP"), {x:200,y:100});</pre>
 */
Dom.setSize = function (elem, value) {
    if (value.width != null) {
        elem.style.width = value.width - Dom.calcStyle(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
    }
    if (value.height != null) {
        elem.style.height = value.height - Dom.calcStyle(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
    }
};

/**
 * 获取指定节点的滚动区域大小。
 * @param {Element} elem 要计算的元素。
 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
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
 * trace( "left: " + offset.x + ", top: " + offset.y );
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
        left = Dom.getPosition(elem);
        if (!/^(?:BODY|HTML|#document)$/i.test(top.nodeName)) {
            var t = Dom.getPosition(top);
            left.left -= t.left;
            lefy.top -= t.top;
        }
        left.left -= Dom.getStyleNumber(elem, 'marginLeft') + Dom.getStyleNumber(top, 'borderLeftWidth');
        left.top -= Dom.getStyleNumber(elem, 'marginTop') + Dom.getStyleNumber(top, 'borderTopWidth');

        return left;
    }

    // 碰到 auto ， 空 变为 0 。
    return {
        left: parseFloat(left) || 0,
        top: parseFloat(top) || 0
    };

};

/**
 * 设置指定节点相对父元素的偏移。
 * @param {Element} elem 要设置的元素。
 * @param {Point} value 要设置的 x, y 对象。
 * @return this
 * @remark
 * 此函数仅改变 CSS 中 left 和 top 的值。
 * 如果当前对象的 position 是static，则此函数无效。
 * 可以通过 {@link #setPosition} 强制修改 position, 或先调用 {@link Dom.movable} 来更改 position 。
 *
 * @example
 * 设置第一段的偏移。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>
 * Dom.query("p:first").setOffset({ x: 10, y: 30 });
 * </pre>
 * #####结果:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
 */
Dom.setOffset = function (elem, value) {
    elem = elem.style;
    if (value.top != null) {
        elem.top = value.top + 'px';
    }
    if (value.left != null) {
        elem.left = value.left + 'px';
    }
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
 * 获取指定节点的绝对位置。
 * @param {Element} elem 要计算的元素。
 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
 * @remark
 * 此方法只对可见元素有效。
 * @example
 * 获取第二段的偏移
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>
 * var p = Dom.query("p").item(1);
 * var position = p.getPosition();
 * trace( "left: " + position.x + ", top: " + position.y );
 * </pre>
 * #####结果:
 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 0, top: 35&lt;/p&gt;</pre>
 */
Dom.getPosition = function (elem) {

    // 对于 document，返回 scroll 。
    if (elem.nodeType === 9) {
        return Dom.getDocumentScroll(elem);
    }

    var bound = elem.getBoundingClientRect !== undefined ? elem.getBoundingClientRect() : { left: 0, top: 0 },
        doc = Dom.getDocument(elem),
        html = doc.documentElement,
        htmlScroll = Dom.getDocumentScroll(doc);
    return {
        left: bound.left + htmlScroll.left - html.clientLeft,
        top: bound.top + htmlScroll.top - html.clientTop
    };
};

/**
 * 设置指定节点的绝对位置。
 * @param {Element} elem 要设置的元素。
 * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
 * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
 * @return this
 * @remark
 * 如果对象原先的position样式属性是static的话，会被改成relative来实现重定位。
 * @example
 * 设置第二段的位置。
 * #####HTML:
 * <pre lang="htm" format="none">
 * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;
 * </pre>
 * #####JavaScript:
 * <pre>
 * Dom.query("p:last").setPosition({ x: 10, y: 30 });
 * </pre>
 */
Dom.setPosition = function (elem, value) {

    // 确保对象可移动。
    Dom.movable(elem);

    var currentPosition = Dom.getPosition(elem),
        offset = Dom.getOffset(elem);

    offset.left = value.left == null ? null : offset.left + value.left - currentPosition.left;
    offset.top = value.top == null ? null : offset.top + value.top - currentPosition.top;

    Dom.setOffset(elem, offset);

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
 * 获取文档的滚动位置。
 * @param {Document} doc 要计算的文档。
 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
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
 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
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
 * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
 * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
 * @return this
 */
Dom.setScroll = function (elem, value) {
    if (elem.nodeType === 9) {
        (elem.defaultView || elem.parentWindow).scrollTo(
            value.left != null ? value.left : Dom.getDocumentScroll(elem).left,
            value.top != null ? value.top : Dom.getDocumentScroll(elem).top
        );
    } else {
        if (value.left != null) {
            elem.scrollLeft = value.left;
        }
        if (value.top != null) {
            elem.scrollTop = value.top;
        }
    }
};
