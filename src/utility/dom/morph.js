/** * @author  *//**
 * 动态改变当前列表每一项的大小和位置到指定容器。
 * @param {mixed} container 要转换的容器节点或区域。
 * @returns this
 * @example $("#elem").morph()
 */Dom.prototype.morph = function(container) {
    // 获取容器区域。
    container = container && container.top != null && container.width != null ? container : (Dom(container).valueOf() || Dom(document)).rect();    return this.each(function (elem) {        elem = Dom(elem);
        // 获取当前节点区域。
        var rect = elem.rect();

        // 获取当前节点区域。
        var offset = elem.offset();        offset.width = parseFloat(elem.css('width'));        offset.height = parseFloat(elem.css('height'));        offset.left += container.left - rect.left;        offset.top += container.top - rect.top;        offset.width += container.width - rect.width;        offset.height += container.height - rect.height;                return elem.rect(rect).animate(offset);    });};