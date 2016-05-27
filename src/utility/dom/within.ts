//===========================================
//  判断元素是否在制定原元素范围   within.js    A
//===========================================

/**
 * 判断当前节点列表第一项是否在指定节点或区域中。
 * @param {mixed} container 要判断的容器节点或区域。
 * @returns {Boolean} 如果当前节点和目标容器有任一交集，则返回 @true，否则返回 @false。
 * @example 
 * $("#elem").within("body")
 * 
 * $("#elem").within({ left:0, top:0, width: 400, height: 500 }) 
 */
Dom.prototype.within = function (container) {

    // 获取容器区域。
    container = container && container.top != null && container.width != null ? container : (Dom(container).valueOf() || Dom(document)).rect();

    // 获取当前节点区域。
    var rect = this.rect();

    // 比较是否存在交集。
    return (rect.left <= container.left + containerRect.width && rect.left + rect.width >= containerRect.left) && (rect.top <= containerRect.top + containerRect.height && rect.top + rect.height >= containerRect.top);
};
