/**
 * @author xuld
 */

typeof include === "function" && include("../partial/mask");
typeof include === "function" && include("../partial/closeButton");
typeof include === "function" && include("../control/base");

/**
 * @class Dialog
 * @extends Control
 */
var Dialog = Control.extend({

    role: "dialog",

	tpl: '<section class="x-panel x-dialog">\
            <header class="x-panel-header">\
                <a class="x-closebutton x-dialog-close" title="关闭">×</a>\
                <h4></h4>\
            </header>\
            <div class="x-panel-body"></div>\
        </section>',

	init: function () {
	    var me = this;
	    me.dom.on('click', '.x-dialog-close', function() {
	        me.onCloseButtonClick();
	    });

        // 如果载入了拖动模块则自动启用拖动功能。
	    me.dom.draggable && me.dom.draggable({
	        handle: me.dom.find('.x-panel-header h3, .x-panel-header h4, .x-panel-header h5')
        });
	},

	show: function (mask) {
	    var me = this;
	    if (!Dom("body").contains(me.dom)) {
	        Dom("body").append(me.dom);
	    }
	    if (me.dom.isHidden()) {
	        // 显示节点。
	        me.dom.show('scale', null, me.duration);
	        me.mask(mask);
	    }
	    return me.center();
	},

	close: function () {
	    var me = this;
	    if (me.trigger('closing')) {
	        me.mask(null);
	        me.dom.hide('scale', function () {
	            me.dom.remove();
	            me.trigger('close');
	        }, me.duration);
	    }
	    return me;
	},

	mask: function (opacity) {
	    var me = this;
	    var maskDom = me.maskDom;
	    if (opacity === null) {
	        maskDom.hide('opacity', function () {
	            Dom(me).remove();
	        }, me.duration);
	    } else {
	        if (!maskDom) {
	            me.maskDom = maskDom = Dom('<div class="x-mask x-mask-dialog"></div>');
	        }
	        if (!Dom("body").contains(maskDom)) {
	            Dom("body").append(maskDom);
	        }
	        maskDom.show().animate({ opacity: 0 }, {
	            opacity: opacity === undefined ? .5 : opacity
	        }, null, me.duration);
	    }
	    return me;
	},
	
	removeCloseButton: function () {
	    this.dom.find('.x-dialog-close').remove();
	    return this;
	},

	title: function (value) {
	    var header = this.dom.find('.x-panel-header h3, .x-panel-header h4, .x-panel-header h5').html(value);
	    return value !== undefined ? this : header;
	},

	content: function (value) {
	    var content = this.dom.find('.x-panel-body').html(value);
        return value !== undefined ? this.center() : content;
	},

	/**
	 * 重对齐当前对话框的位置以确保居中显示。
	 */
	center: function () {
	    this.dom.css('marginTop', -this.dom[0].offsetHeight / 2);
	    this.dom.css('marginLeft', -this.dom[0].offsetWidth / 2);
		return this;
	},

	onCloseButtonClick: function () {
	    this.close();
	}
	
});
