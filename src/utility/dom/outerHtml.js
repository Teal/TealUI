/**
 * @fileOverview 获取或设置外部 HTML。
 * @author xuld
 */

if (!('outerHTML' in Element.prototype)) {

    /**
     * 获取外部 HTML。
     */
    Element.prototype.__defineGetter__('outerHTML', function () {
        var p = this.ownerDocument.createElement(this.parentNode.tagName)
        p.appendChild(this.cloneNode(true));
        return p.innerHTML;
    });

    /**
     * 获取外部 HTML。
     */
    Element.prototype.__defineSetter__('outerHTML', function (value) {
        var p = this.ownerDocument.createElement(this.parentNode.tagName);
        p.innerHTML = value;
        while (p.firstChild)
            this.parentNode.insertBefore(p.firstChild, this);
        this.parentNode.removeChild(this);
    });

}
