/**
 * @fileOverview 文本域根据内容自动放大缩小。
 * @author xuld
 */

/**
 * 令当前文本框随输入内容自动调整高度。
 */
Dom.prototype.autoResize = function () {
    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }
    this.each(function (elem) { autoResize.call(elem); });
    return this.css('overflow', 'hidden').on('keydown', autoResize).on('keyup', autoResize)
};
