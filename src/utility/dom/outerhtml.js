/**
 * @fileOverview 获取或设置外部 HTML。
 * @author xuld
 */

// #require base

if (!('outerHTML' in Element.prototype)) {

    /**
     * 获取外部 HTML。
     */
    Element.prototype.__defineGetter__('outerHTML', function() {
        var div = this.ownerDocument.createElement('div')
        div.appendChild(elem.cloneNode(true));
        return div.innerHTML;
    });

    /**
     * 获取外部 HTML。
     */
    Element.prototype.__defineSetter__('outerHTML', function (value) {
        this.before(value);
        Element.prototype.remove.call(this);
    });

}
