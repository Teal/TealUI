/**
 * @author xuld
 */

// #require ../partial/mask
// #require ../partial/closeButton
// #require ../control/base

/**
 * @class Dialog
 * @extends Control
 */
var Dialog = Control.extend({

    role: "dialog",

	toggleDuration: 150,
	
	tpl: '<section class="x-panel x-dialog">\
            <header class="x-panel-header">\
                <a class="x-closebutton x-dialog-close">×</a>\
                <h4></h4>\
            </header>\
            <div class="x-panel-body"></div>\
        </section>',

	init: function () {
        this.dom.on('click', '.x-dialog-close', this.onCloseButtonClick, this);

        // 如果载入了拖动模块则自动启用拖动功能。
        this.dom.draggable && this.dom.draggable({
            handle: this.dom.find('.x-panel-header h3, .x-panel-header h4, .x-panel-header h5')
        });
	},

	show: function (mask) {
        // 显示节点。
	    this.dom.show('scale', null, this.toggleDuration);
	    this.setMask(mask);
	    return this.center();
	},

	close: function () {
	    var me = this;
	    if (me.trigger('closing')) {
	        me.setMask(null);
	        me.dom.hide('scale', function () {
	            me.dom.remove();
	            me.trigger('close');
	        }, me.toggleDuration);
	    }
	    return this;
	},

	setMask: function (opacity) {
	    if (opacity === null) {
	        this.maskDom && this.maskDom.hide('opacity', function () {
	            Dom(this).remove();
	        }, this.toggleDuration);
	    } else {
	        var maskDom = this.maskDom || (this.maskDom = Dom(document.body).append('<div class="x-mask x-mask-dialog"></div>'));
	        maskDom.animate({ opacity: 0 }, {
	            opacity: opacity === undefined ? .5 : opacity
	        }, null, this.toggleDuration);
	    }
		return this;
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
