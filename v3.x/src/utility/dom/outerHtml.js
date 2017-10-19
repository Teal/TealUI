/**
 * @fileOverview 获取或设置外部 HTML。
 * @author xuld
 */

if (!("outerHTML" in Element.prototype)) {

    /**
     * 获取或设置当前元素的外部 HTML。
     * @param {String} value 要设置的外部 HTML。
     * @returns {String} 返回外部 HTML。
     * @memberOf Element.prototype
     * @property outerHTML
     * @example document.body.outerHTML = "a";
     */
    Element.prototype.__defineGetter__("outerHTML", function() {
        var p = this.ownerDocument.createElement(this.parentNode.tagName);
        p.appendChild(this.cloneNode(true));
        return p.innerHTML;
    });

    Element.prototype.__defineSetter__("outerHTML", function(value) {
        var p = this.ownerDocument.createElement(this.parentNode.tagName);
        p.innerHTML = value;
        while (p.firstChild) {
            this.parentNode.insertBefore(p.firstChild, this);
        }
        this.parentNode.removeChild(this);
    });

}