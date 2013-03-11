/**
 * @author xuld
 */

//#include ui/core/base.js
//#include dom/pin.js
//#include fx/animate.js

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
	    <span class="x-arrow-fore">◆</span>\
        <span class="x-arrow-back">◆</span>\
    </span>',

    /**
	 * 显示时使用的特效持续时间。
	 */
	toggleArgs: -2,

	show: function () {
		Dom.render(this.elem);
		Dom.show(this.elem, this.toggleArgs);
	    return this;
	},

	hide: function () {
		Dom.hide(this.elem, this.toggleArgs);
		return this;
	},

	showAt: function (position) {
		this.show();
		Dom.setPosition(this.elem, position);
		return dom;
	},

	showBy: function (target, offsetX, offsetY, e) {
		
	    var configs = ({
	        left: ['rr-yc', 15, 0],
	        right: ['ll-yc', 15, 0],
	        top: ['xc-bb', 0, 15],
	        bottom: ['xc-tt', 0, 15],
	        'null': ['xc-bb', 0, 5, 1]
	    }[this.getArrow()]);

	    Dom.pin(this.show().elem, target, configs[0], offsetX === undefined ? configs[1] : offsetX, offsetY === undefined ? configs[2] : offsetY, false);
		
		if(configs[3] && e){
			Dom.setPosition(this.elem, { x: e.pageX + (offsetX || 0) });
		}

		return this;

	},

	setArrow: function (value) {
		var arrow = Dom.find('.x-arrow', this.elem) || Dom.append(this.elem, this.arrowTpl);

	    if (value) {
	        arrow.className = 'x-arrow x-arrow-' + value;
	    } else {
	    	Dom.remove(arrow);
	    }
	    return this;
	},

	getArrow: function () {
		var arrow = Dom.find('.x-arrow', this.elem), r = null;

	    if (arrow) {
	        r = (/\bui-arrow-(top|bottom|left|right)/.exec(arrow.className) || [0, r])[1];
	    }
	    return r;
	},
	
    /**
     * 设置某个控件工具提示。
     */
	setToolTip: function (dom, caption, offsetX, offsetY) {
		var me = this;
		Dom.query(dom).forEach(function (elem) {
			Dom.on(elem, 'mouseover', function (e) {
				var waitTimeout = Dom.isHidden(me.elem) ? me.initialDelay : me.reshowDelay;
				if (me.showTimer)
					clearTimeout(me.showTimer);

				me.showTimer = setTimeout(function () {
					me.showTimer = 0;

					if (caption) {
						if (me.setContent) {
							me.setContent(caption);
						} else {
							Dom.setText(me.elem);
						}
					}

					me.showBy(elem, offsetX, offsetY, e);
				}, waitTimeout);

			});

			Dom.on(elem, 'mouseout', function () {
				if (me.showTimer) {
					clearTimeout(me.showTimer);
				}

				me.hide();
			});

		});


	    return this;
		
	}
	
};
