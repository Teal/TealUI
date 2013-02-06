/**
 * @author xuld
 */

include("ui/core/base.js");
include("dom/pin.js");
include("fx/animate.js");

/**
 * 表示一个工具提示应该实现的接口。
 */
var IToolTip = {

    /**
     * 工具提示显示之前经过的时间。
     * @type Integer
     */
    initialDelay: 500,

    /**
     * 指针从一个控件移到另一控件时，必须经过多长时间才会出现后面的工具提示窗口。
     * @type Integer
     */
    reshowDelay: 100,
	
	arrowTpl: '<span>\
	    <span class="ui-arrow-fore">◆</span>\
        <span class="ui-arrow-back">◆</span>\
    </span>',

    /**
	 * 显示时使用的特效持续时间。
	 */
	toggleArgs: -2,

	show: function () {
	    if (!this.dom.closest('body').length) {
	        this.dom.appendTo();
	    }

	    this.dom.show(this.toggleArgs);
	    return this;
	},

	hide: function () {
		return this.dom.hide(this.toggleArgs);
	},

	showAt: function (p) {
		this.show()
		this.dom.setPosition(p);
		return dom;
	},

	showBy: function (ctrl, offsetX, offsetY, e) {
		
	    var configs = ({
	        left: ['rr-yc', 15, 0],
	        right: ['ll-yc', 15, 0],
	        top: ['xc-bb', 0, 15],
	        bottom: ['xc-tt', 0, 15],
	        'null': ['xc-bb', 0, 5, 1]
	    }[this.getArrow()]);

	    this.show().dom.pin(ctrl, configs[0], offsetX === undefined ? configs[1] : offsetX, offsetY === undefined ? configs[2] : offsetY, false);
		
		if(configs[3] && e){
			this.dom.setPosition({ x: e.pageX + (offsetX || 0) });
		}

		return this;

	},

	setArrow: function (value) {
		var arrow = this.dom.find('.ui-arrow');
		if(!arrow.length){
			arrow = Dom.parse(this.arrowTpl).appendTo(this.dom);
		}

	    if (value) {
	        arrow[0].className = 'ui-arrow ui-arrow-' + value;
	    } else {
	        arrow.remove();
	    }
	    return this;
	},

	getArrow: function () {
	    var arrow = this.dom.find('.ui-arrow'), r = null;

	    if (arrow.length) {
	        r = (/\bui-arrow-(top|bottom|left|right)/.exec(arrow[0].className) || [0, r])[1];
	    }
	    return r;
	},
	
    /**
     * 设置某个控件工具提示。
     */
	setToolTip: function (dom, caption, offsetX, offsetY) {
		dom = Dom.query(dom);

	    var me = this;
	    dom.on('mouseover', function (e) {
	        var waitTimeout = Dom.isHidden(me.dom[0]) ? me.initialDelay : me.reshowDelay;
	        if (me.showTimer)
	            clearTimeout(me.showTimer);

	        me.showTimer = setTimeout(function () {
	            me.showTimer = 0;

	            if (caption)
	                me.content().setText(caption);

	            me.showBy(dom, offsetX, offsetY, e);
	        }, waitTimeout);

	    });
		
	    dom.on('mouseout', function () {
	        if (me.showTimer) {
	            clearTimeout(me.showTimer);
	        }

	        me.hide();
	    });
		
		
	    return this;
		
	}
	
};
