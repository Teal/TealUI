/**
 * @author xuld
 */


using('System.Fx.Animate');
using('Controls.Core.Base');


var ScrollToTop = Control.extend({

    tpl: '<a href="#" class="x-scrolltotop" title="返回顶部">返回顶部</a>',

    showDuration: -1,

    scrollDuration: -1,

    minScroll: 130,

    onClick: function (e) {
        e.preventDefault();
        Dom.document.animate({scrollTop: 0}, this.scrollDuration);
    },

    init: function (options) {
        var me = this;
        document.on('scroll', function () {
            if (document.getScroll().y > me.minScroll) {
                me.show(me.showDuration);
            } else {
                me.hide(me.showDuration);
            }
        });
        this.on('click', this.onClick);
		
		if(!this.closest('body')){
			this.appendTo();
		}
    }

});