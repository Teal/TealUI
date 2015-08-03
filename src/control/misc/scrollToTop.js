/**
 * @author xuld
 */

// #require ../control/base
// #require ../dom/animate
// #require ../dom/scrollTo
// #require ../dom/rect

Control.extend({

    role: "scrollToTop",

    scrollDuration: 100,

    minScroll: 130,
    
    init: function () {
        var me = this;
        window.addEventListener('scroll', function () {
            var isHidden = me.dom.isHidden();
            if (Dom(document).scroll().top > me.minScroll) {
                isHidden && me.dom.show('opacity', null, me.duration);
            } else {
                !isHidden && me.dom.hide('opacity', null, me.duration);
            }
        }, false);
        me.dom.on('click', function (e) {
            e.preventDefault();
            Dom(document).scrollTo(null, 0, me.scrollDuration);
        });
    }

});
