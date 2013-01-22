/**
 * @author xuld
 */


include("dom/pin.js");


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
	
	menuTpl: '<span>\
	    <span class="ui-arrow-fore">◆</span>\
        <span class="ui-arrow-back">◆</span>\
    </span>',

    /**
	 * 显示时使用的特效持续时间。
	 */
	showDuration: -2,

	show: function () {
	    if (!this.closest('body')) {
	        this.appendTo();
	    }

	    return Dom.prototype.show.call(this, arguments, {
	    	duration: this.showDuration
	    });
	},

	hide: function () {
	    return Dom.prototype.hide.call(this, arguments, {
	    	duration: this.showDuration
	    });
	},

	showAt: function (x, y) {
	    return this.show().setPosition(x, y);
	},

	showBy: function (ctrl, offsetX, offsetY, e) {
		
	    var configs = ({
	        left: ['rr-yc', 15, 0],
	        right: ['ll-yc', 15, 0],
	        top: ['xc-bb', 0, 15],
	        bottom: ['xc-tt', 0, 15],
	        'null': ['xc-bb', 0, 5, 1]
	    }[this.getArrow()]);

	    this.show().pin(ctrl, configs[0], offsetX === undefined ? configs[1] : offsetX, offsetY === undefined ? configs[2] : offsetY, false);
		
		if(configs[3] && e){
			this.setPosition(e.pageX + (offsetX || 0));
		}

		return this;

	},

	setArrow: function (value) {
	    var arrow = this.find('.ui-arrow') || this.append(this.menuTpl);
	    if (value) {
	        arrow.node.className = 'ui-arrow ui-arrow-' + value;
	    } else {
	        arrow.remove();
	    }
	    return this;
	},

	getArrow: function () {
	    var arrow = this.find('.ui-arrow'), r = null;

	    if (arrow) {
	        r = (/\bui-arrow-(top|bottom|left|right)/.exec(arrow.node.className) || [0, r])[1];
	    }
	    return r;
	},
	
    /**
     * 设置某个控件工具提示。
     */
	setToolTip: function (ctrl, caption, offsetX, offsetY) {
	    ctrl = Dom.get(ctrl);

	    var me = this;
	    ctrl.on('mouseover', function (e) {
	        var waitTimeout = me.isHidden() ? me.initialDelay : me.reshowDelay;
	        if (me.showTimer)
	            clearTimeout(me.showTimer);

	        me.showTimer = setTimeout(function () {
	            me.showTimer = 0;

	            if (caption)
	                me.setText(caption);

	            me.showBy(ctrl, offsetX, offsetY, e);
	        }, waitTimeout);

	    }, this);
		
	    ctrl.on('mouseout', function () {
	        if (me.showTimer) {
	            clearTimeout(me.showTimer);
	        }

	        this.hide();
	    }, this);
		
		
	    return this;
		
	}
	
};
