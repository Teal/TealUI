/**
 * @author xuld
 */

//#require dom/base.js

Dom.autoResize = function (elem) {
    elem.style.overflow = 'hidden';
    Dom.on(elem, 'keydown', autoResize);
    Dom.on(elem, 'keyup', autoResize);
    autoResize.call(elem);

    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }
};
