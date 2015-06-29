/**
 * @author xuld
 */

// #require ../partial/mask
// #require ../partial/closeButton
// #require ../dom/animate
// #require ../control/base

/**
 * @class Dialog
 * @extends Control
 */
var Dialog = Control.extend({

	toggleDuration: 150,
	
	tpl: '<section class="x-panel x-dialog">\
            <header class="x-panel-header">\
                <a class="x-closebutton x-dialog-close">×</a>\
                <h4></h4>\
            </header>\
            <div class="x-panel-body"></div>\
        </section>',

	init: function () {
        if (!this.elem) {
            this.elem = document.parse(this.tpl);
        }
        this.elem.on('click', '.x-dialog-close', this.onCloseButtonClick, this);

        // 如果载入了拖动模块则自动启用拖动功能。
        this.elem.setDraggable && this.elem.setDraggable({
            handle: this.elem.querySelector('.x-panel-header h3, .x-panel-header h4, .x-panel-header h5')
        });
	},

	show: function (mask) {

        // 追加节点。
	    if (!this.elem.ownerDocument.body.contains(this.elem)) {
	        this.elem.ownerDocument.body.appendChild(this.elem);
	    }

        // 显示节点。
	    this.elem.show('scale', null, this.toggleDuration);
	    this.setMask(mask);

	    return this.center();
	},

	close: function () {
	    var me = this;
	    if (me.trigger('closing')) {
	        me.setMask(null);
	        me.elem.hide('scale', function () {
	            me.elem.removeSelf();
	            me.trigger('close');
	        }, me.toggleDuration);
	    }
	    return this;
	},

	setMask: function (opacity) {
	    if (opacity === null) {
	        this.maskElem && this.maskElem.hide('opacity', function() {
	            this.removeSelf();
	        }, this.toggleDuration);
	    } else {
	        var maskElem = this.maskElem || (this.maskElem = document.body.append('<div class="x-mask x-mask-dialog"></div>'));
	        if (!maskElem.ownerDocument.body.contains(maskElem)) {
	            maskElem.ownerDocument.body.appendChild(maskElem);
	        }

	        maskElem.animate({ opacity: 0 }, {
	            opacity: opacity === undefined ? .5 : opacity
	        }, null, this.toggleDuration);
	    }
		return this;
	},
	
	removeCloseButton: function () {
	    var closeButton = this.elem.querySelector('.x-dialog-close')
	    closeButton && closeButton.removeSelf();
	    return this;
	},

	getTitle: function () {
	    return this.elem.querySelector('.x-panel-header h3, .x-panel-header h4, .x-panel-header h5').innerHTML;
	},

	setTitle: function (value) {
	    this.elem.querySelector('.x-panel-header h3, .x-panel-header h4, .x-panel-header h5').innerHTML = value;
	    return this;
	},

	getContent: function () {
	    return this.elem.querySelector('.x-panel-body').innerHTML;
	},

	setContent: function (value) {
	    this.elem.querySelector('.x-panel-body').innerHTML = value;
		return this.center();
	},

	/**
	 * 重对齐当前对话框的位置以确保居中显示。
	 */
	center: function () {
		this.elem.setStyle('marginTop', -this.elem.offsetHeight / 2 + 'px');
		this.elem.setStyle('marginLeft', -this.elem.offsetWidth / 2 + 'px');
		return this;
	},

	onCloseButtonClick: function () {
	    this.close();
	}
	
});
