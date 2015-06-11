/**
 * @author xuld
 */

// #require ../control/base
// #require ../dom/animate
// #require ../dom/scrollTo
// #require ../dom/rect

var ScrollToTop = Control.extend({
    
    /**
     * 渐变显示的特效时间。
     */
    toggleDuration: 100,

    scrollDuration: 100,

    minScroll: 130,
    
    init: function () {
        var me = this;
        window.addEventListener('scroll', function () {
            var isHidden = me.elem.isHidden();
            if (document.getScroll().top > me.minScroll) {
                isHidden && me.elem.show('opacity', null, me.toggleDuration);
            } else {
                !isHidden && me.elem.hide('opacity', null, me.toggleDuration);
            }
        }, false);
        me.elem.on('click', function (e) {
            e.preventDefault();
            document.scrollTo(null, 0, me.scrollDuration);
        });
    }

});
