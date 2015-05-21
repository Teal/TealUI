/**
 * @author xuld
 */

// #require base.js

Dom.getOuterHtml = function(elem) {
    if ("outerHTML" in elem) {
        return elem.outerHTML;
    } else {
        var div = Dom.getDocument(elem).createElement('div')
        div.appendChild(elem.cloneNode(true));
        return div.innerHTML;
    }
};

Dom.setOuterHtml = function (elem, value) {
    if ("outerHTML" in elem && !/<(?:script|style|link)/i.test(value)) {
        elem.outerHTML = value;
    } else {
        Dom.before(elem, value);
        Dom.remove(elem);
    }
};
