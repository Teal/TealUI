/** * @author [作者] */

Dom.hover = function (elem, mouseEnter, mouseLeave) {

    var mouseEnterFilter;
    
    // 为浏览器添加 mouseenter 事件。
    if (!document.documentElement.onmouseenter) {
        mouseEnterFilter = function(e) {
            return !e.target.contains(e.relatedTarget);
        }
    }

};
