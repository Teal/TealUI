/**
 * @author xuld
 */

//#include fx/animate.js
//#include ui/core/base.js

var ScrollToTop = Control.extend({

    tpl: '<a href="#" class="x-scrolltotop" title="返回顶部">返回顶部</a>',

    showDuration: -1,

    scrollDuration: -1,

    minScroll: 130,

    onClick: function (e) {
    	e.preventDefault();
    	Dom.animate(document, { scrollTop: 0 }, this.scrollDuration);
    },

    init: function (options) {
        
        Dom.on(document, 'scroll', function () {
        	if (Dom.getScroll(document).y > this.minScroll) {
        		Dom.show(this.elem, this.showDuration);
            } else {
        		Dom.hide(this.elem, this.showDuration);
            }
        }, this);
        Dom.on(this.elem, 'click', this.onClick, this);
		
        Dom.render(this.elem);
    }

});
