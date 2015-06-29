/**
 * @fileOverview 文本域根据内容自动放大缩小。
 * @author xuld
 */

/**
 * 令当前文本框随输入内容自动调整高度。
 */
Element.prototype.autoResize = function () {
    var elem = this;
    elem.style.overflow = 'hidden';
    elem.addEventListener('keydown', autoResize, false);
    elem.addEventListener('keyup', autoResize, false);
    autoResize();

    function autoResize() {
        elem.style.height = 'auto';
        elem.style.height = elem.scrollHeight + 'px';
    }
};
