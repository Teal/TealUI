/**
 * @author xuld
 */


include("ui/part/icon.css");
include("ui/part/mask.css");
include("ui/part/closebutton.css");
include("ui/container/dialog.css");
include("fx/animate.js");
include("ui/core/containercontrol.js");


/**
 * @class Dialog
 * @extends ContainerControl
 */
var Dialog = ContainerControl.extend({

    _centerType: 1 | 2,
	
	xtype: 'dialog',

	showDuration: -1,
	
	// 基本属性
		
	headerTpl: '<div class="x-control-header"><a class="x-dialog-close x-closebutton">×</a><h4></h4></div>',

	onCloseButtonClick: function () {
	    this.close();
	},
	
	init: function(options){
		
		var t ;
		
		// 允许直接传入一个节点。
		if (!this.hasClass('x-dialog')) {
            
		    // 判断节点是否已渲染过。
		    t = this.parent();

		    if (t && t.hasClass('x-dialog-body')) {
		        this.node = t.node.parentNode;
		    } else {

		        // 保存当前节点。
		        t = this.node;
		        this.node = this.create(options);
		        this.body().append(t);

		    }
		}
		
		// 关闭按钮。
		this.delegate('.x-dialog-close', 'click', this.onCloseButtonClick.bind(this));

		this.setStyle('display', 'none');
		
		// 移除 script 脚本。
		this.query('script').remove();

	},
	
	mask: function(opacity){
		var mask = this.maskDom || (this.maskDom = Dom.find('.x-mask-dialog') || Dom.create('div', 'x-mask x-mask-dialog').appendTo());
		if (opacity === null) {
			mask.hide();
		} else {
			mask.show();
			mask.setSize(document.getScrollSize());
			if (opacity != null)
				mask.setStyle('opacity', opacity);
		}
		return this;
	},
	
	setOffset: function(p){
		if(p.x != null) {
			this._centerType &= ~2;
			this.setStyle('margin-left', 0);
		}
		
		if(p.y != null) {
			this._centerType &= ~1;
			this.setStyle('margin-top', 0);
		}
		
		return this.base('setOffset');
	},
	
	setWidth: function(){
		return this.base('setWidth').center();
	},
	
	setHeight: function(){
		return this.base('setHeight').center();
	},
	
	setContent: function () {
	    return this.base('setContent').center();
	},
	
	/**
	 * 重对齐当前对话框的位置以确保居中显示。
	 */
	center: function(){
		if(this._centerType & 1)
			this.setStyle('margin-top', - this.getHeight() / 2 + document.getScroll().y);
			
		if(this._centerType & 2)
			this.setStyle('margin-left', - this.getWidth() / 2 + document.getScroll().x);
			
		return this;
	},

	show: function(){
		
		if(!this.closest('body')){
			this.appendTo();	
		}
		
		return Dom.prototype.show.call(this, arguments, {
			duration: this.showDuration
		}).center();
		
	},
	
	showDialog: function(){
		return this.show.apply(this.mask(), arguments);
	},
	
	hide: function(){
		if (this.maskDom) this.maskDom.hide();
		return Dom.prototype.hide.call(this, arguments, {
			duration: this.showDuration
		});
	},
	
	setContentSize: function(x, y){
		this.setWidth('auto');
		this.body().setWidth(x).setHeight(y);
		return this.center();
	},
	
	close: function () {
	    var me = this;
	    if (this.trigger('closing'))
	        this.hide({
	        	callback: function () {
		            this.trigger('close');
		        }
		    });
		return this;
	}
	
});

