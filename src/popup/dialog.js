/**
 * @author xuld
 */

//#include ui/part/mask.css
//#include ui/part/closebutton.css
//#include ui/container/dialog.css
//#include fx/animate.js
//#include ui/core/containercontrol.js

/**
 * @class Dialog
 * @extends ContainerControl
 */
var Dialog = ContainerControl.extend({

    _centerType: 1 | 2,
	
	cssClass: 'x-dialog',

	showDuration: -1,
	
	// 基本属性
		
	headerTpl: '<div class="{cssClass}-header"><a class="{cssClass}-close x-closebutton">×</a><h4></h4></div>',

	onCloseButtonClick: function () {
	    this.close();
	},
	
	init: function(options){
		
		// 如果用户传入了一个已经存在的节点，并且这个节点不是 x-dialog 。
		// 那么创建新的对话框容器，并且将节点作为这个对话框的内容。
		if (!Dom.hasClass(this.elem, 'x-dialog')) {

			// 如果这个节点已经调用过 new Dialog, 则其父元素就是 x-dialog-body  了。
			if (Dom.parent(this.elem, '.x-dialog-body')) {
				this.elem = Dom.parent(Dom.parent(this.elem));
			} else {

				// 保存当前节点。
				var t = this.elem;

				// 创建新的对话框。
				this.elem = this.create(options);

				// 将节点加入到 body 中。
				Dom.append(this.body(), t);

		    }
		}
		
		// 关闭按钮。
		// 默认隐藏对话框。
		// 移除 script 脚本, 防止重复执行。
		Dom.on(this.elem, 'click', '.x-dialog-close', this.onCloseButtonClick, this);
		Dom.setStyle(this.elem, 'display', 'none');
		Dom.query('script', this.elem).forEach(Dom.remove);

	},
	
	mask: function(opacity){
		var mask = this.maskElem || (this.maskElem = Dom.find('.x-mask-dialog') || Dom.append(document.body, '<div class="x-mask x-mask-dialog"></div>'));

		if (opacity === null) {
			Dom.hide(mask);
		} else {
			Dom.show(mask);
			Dom.setSize(mask, Dom.getScrollSize(document));
			if (opacity != null)
				Dom.setStyle(mask, 'opacity', opacity);
		}
		return this;
	},
	
	setPosition: function(value){
		if (value.x != null) {
			this._centerType &= ~2;
			Dom.setStyle(this.elem, 'margin-left', 0);
		}
		
		if (value.y != null) {
			this._centerType &= ~1;
			Dom.setStyle(this.elem, 'margin-top', 0);
		}
		
		Dom.setPosition(this.elem, value);
		return this;
	},

	setSize: function (value) {
		Dom.setSize(this.elem, value);
		return this.center();
	},

	setContentSize: function (value) {
		Dom.setWidth(this.elem, 'auto');

		var body = this.body();
		Dom.setWidth(body, value.x)
		Dom.setHeight(body, value.y);
		return this.center();
	},

	removeCloseButton: function () {
	    Dom.remove(Dom.find(".x-closebutton", this.elem));
	    return this;
	},

	setContent: function () {
		return ContainerControl.prototype.setContent.apply(this, arguments).center();
	},
	
	/**
	 * 重对齐当前对话框的位置以确保居中显示。
	 */
	center: function(){
		if(this._centerType & 1)
			Dom.setStyle(this.elem, 'margin-top', -Dom.getHeight(this.elem) / 2 + Dom.getScroll(document).y);
			
		if(this._centerType & 2)
			Dom.setStyle(this.elem, 'margin-left', -Dom.getWidth(this.elem) / 2 + Dom.getScroll(document).x);
			
		return this;
	},

	show: function (duration) {
		Dom.render(this.elem);

		Dom.show(this.elem, {
			args: duration,
			duration: this.showDuration
		});
		return this.center();
	},
	
	showDialog: function(){
		return this.show.apply(this.mask(), arguments);
	},
	
	close: function (duration) {
	    var me = this;
	    if (this.trigger('closing')) {
	    	if (this.maskElem) Dom.hide(this.maskElem);
	    	Dom.hide(this.elem, {
	    		args: duration,
	    		duration: this.showDuration,
	    		callback: function () {
	    			me.trigger('close');
	    		}
	    	});
	    }
		return this;
	}
	
});
