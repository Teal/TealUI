/**
 * @fileOverview 实现节点尺寸和位置计算。
 * @author xuld
 */

/**
 * 获取指定节点的区域。
 * @return {DOMRect} 返回所在区域。其包含 left, top, width, height 属性。
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
Document.prototype.getRect = Element.prototype.getRect = function () {
    var elem = this,
        doc = elem.ownerDocument || elem,
        html = doc.documentElement,
        htmlScroll = doc.getScroll(),
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
Element.prototype.setSize = function (value) {

    var elem = this,
        style = elem.style,
        borderBox = elem.getStyle('boxSizing') === 'border-box';

    if (value.width != null) {
        style.width = value.width - (borderBox ? 0 : elem.calcStyleExpression('borderLeftWidth+borderRightWidth+paddingLeft+paddingRight')) + 'px';
    }

    if (value.height != null) {
        style.height = value.height - (borderBox ? 0 : elem.calcStyleExpression('borderTopWidth+borderBottomWidth+paddingTop+paddingBottom')) + 'px';
    }

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
Element.prototype.setPosition = function (value) {

    var elem = this,
        style = elem.style,
        currentPosition,
        offset;

    // 确保对象可移动。
    if (!/^(?:abs|fix)/.test(elem.getStyle("position")))
        style.position = "relative";

    currentPosition = elem.getRect();
    offset = elem.getOffset();

    if (value.top != null) style.top = offset.top + value.top - currentPosition.top + 'px';
    if (value.left != null) style.left = offset.left + value.left - currentPosition.left + 'px';

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
Element.prototype.getOffset = function () {

    // 如果设置过 left top ，这是非常轻松的事。
    var elem = this,
        left = elem.getStyle('left'),
        top = elem.getStyle('top');

    // 如果未设置过。
    if ((!left || !top || left === 'auto' || top === 'auto') && elem.getStyle("position") === 'absolute') {

        // 绝对定位需要返回绝对位置。
        top = elem.getOffsetParent();
        left = elem.getRect();
        if (!/^(?:BODY|HTML|#document)$/i.test(top.nodeName)) {
            var t = top.getRect();
            left.left -= t.left;
            left.top -= t.top;
        }
        left.left -= elem.calcStyle('marginLeft') + top.calcStyle('borderLeftWidth');
        left.top -= elem.calcStyle('marginTop') + top.calcStyle('borderTopWidth');

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
Element.prototype.getOffsetParent = function () {
    var p = this;
    while ((p = p.offsetParent) && !/^(?:BODY|HTML|#document)$/i.test(p.nodeName) && p.getStyle("position") === "static");
    return p || this.ownerDocument.body;
};

/**
 * 获取文档的滚动位置。
 * @param {Document} doc 要计算的文档。
 * @return {Point} 返回的对象包含两个整型属性：left 和 top。
 */
Document.prototype.getScroll = function () {
    var doc = this, win = doc.defaultView;
    return 'pageXOffset' in win ? {
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
Element.prototype.getScroll = function () {
    var elem = this;
    return {
        left: elem.scrollLeft,
        top: elem.scrollTop
    };
};

/**
 * 获取文档的滚动位置。
 * @param {Point} value 要设置的包含 left、top 属性的对象。如果不设置，使用 null 。
 * @return {Point} 返回的对象包含两个整型属性：left 和 top。
 */
Document.prototype.setScroll = function (value) {
    var elem = this;
    elem.defaultView.scrollTo(
        value.left != null ? value.left : elem.getScroll().left,
        value.top != null ? value.top : elem.getScroll().top
    );
};

/**
 * 设置指定节点的滚动条位置。
 * @param {Point} value 要设置的包含 left、top 属性的对象。如果不设置，使用 null 。
 * @return this
 */
Element.prototype.setScroll = function (value) {
    var elem = this;
    if (value.left != null) {
        elem.scrollLeft = value.left;
    }
    if (value.top != null) {
        elem.scrollTop = value.top;
    }
};
