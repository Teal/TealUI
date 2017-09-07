/**
 * preventMaskScroll 
 * @statable
 */
/**
 * createPreventMaskScroll
 * @fileOverview 阻止浮层滚动穿透问题
 * @param  {Element} maskContent 滚动内容容器，必须是指定overflow:scroll的元素
 * @param  {Element} maskLayer 滚动蒙版
 * ==================1===================
 * <div role="maskLayer">
 *     <div role="maskContent"></div>
 * </div>
 * ==================2===================
 * <div role="maskContent & maskLayer"></div>
 * <div class="mask"></div>
 * @example
 * var preventScroll = createPreventMaskScroll()
 */
function createPreventMaskScroll (maskContent, maskLayer) {

    maskLayer = maskLayer || maskContent;
    var touchesStart = {};

    var onTouchStart = function (e) {
        touchesStart.x = e.targetTouches[0].pageX;
        touchesStart.y = e.targetTouches[0].pageY;
    }

    var onTouchMove = function (e) {
        var pageX = e.targetTouches[0].pageX;
        var pageY = e.targetTouches[0].pageY;
        var touchDiffY = pageY - touchesStart.y;
        var isScrollBottom = touchDiffY < 0 && maskLayer.scrollHeight - maskLayer.scrollTop == maskLayer.offsetHeight;
        var isScrollTop = touchDiffY > 0 && maskLayer.scrollTop <= 0;
        if (isScrollBottom || isScrollTop) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function bind () {
        maskContent.addEventListener('touchstart', onTouchStart, false);
        maskContent.addEventListener('touchmove', onTouchMove, false);
    }

    function unbind () {
        maskContent.removeEventListener('touchstart', onTouchStart, false);
        maskContent.removeEventListener('touchmove', onTouchMove, false);
    }

    return {
        bind: bind,
        unbind: unbind
    }
}

module.exports = createPreventMaskScroll()
module.exports.createPreventMaskScroll = createPreventMaskScroll
