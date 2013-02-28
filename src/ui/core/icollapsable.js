/**
 * @author  xuld
 */

//#include fx/animate.js
//#include ui/core/base.js

/**
 * 表示一个可折叠的控件接口。
 * @interface ICollapsable
 * @remark ICollapsable 会对 #body() 节点（如果存在）进行折叠和展开效果。
 */
var ICollapsable = {

    /**
	 * 折叠效果的默认使用时间。如果为 0 表示无效果。
	 * @type {Integer} 
	 * @virtual
	 */
    collapseDuration: -1,

    /**
	 * 当控件已经被折叠时执行。
	 * @protected virtual
	 */
    onCollapsing: function () {
        return this.trigger('collapsing');
    },

    /**
	 * 当控件已经被折叠时执行。
	 * @protected virtual
	 */
    onCollapse: function () {
        return this.trigger('collapse');
    },

    /**
	 * 当控件已经被折叠时执行。
	 * @protected virtual
	 */
    onExpanding: function () {
        return this.trigger('expanding');
    },

    /**
	 * 当控件即将被展开时执行。
	 * @protected virtual
	 */
    onExpand: function () {
        return this.trigger('expand');
    },

    /**
	 * 获取目前是否折叠。
	 * @return {Boolean} 获取一个值，该值指示当前面板是否折叠。
	 * @virtual
	 */
    isCollapsed: function () {
    	var body = this.body ? this.body() : this.elem;
    	return body && Dom.isHidden(body);
    },

    /**
	 * 切换面板的折叠。
	 * @param {Integer} duration=#collapseDuration 折叠效果使用的时间。如果为 0 表示无效果。
     * @return this
	 */
    toggleCollapse: function (duration) {
        return this[this.isCollapsed() ? 'expand' : 'collapse'](duration);
    },

    /**
	 * 折叠面板。
	 * @param {Integer} duration=#collapseDuration 折叠效果使用的时间。如果为 0 表示无效果。
     * @return this
	 */
    collapse: function (duration) {
        var me = this,
			body,
			callback;

        // 如果允许折叠，则继续执行。
        if (me.onCollapsing() !== false && (body = me.body ? me.body() : me.elem)) {
            
        	Dom.hide(body, {
				args: duration,
				effect: 'height', 
				duration: me.collapseDuration, 
				callback: function () {
					Dom.addClass(me.elem, me.cssClass + '-collapsed');
	                me.onCollapse();
	            }, 
	            link: 'ignore'
	        });

        }
        return me;
    },

    /**
	 * 展开面板。
	 * @param {Integer} duration=#collapseDuration 折叠效果使用的时间。如果为 0 表示无效果。
     * @return this
	 */
    expand: function (duration) {

        var me = this,
            body;

        // 如果允许展开，则继续执行。
        // 获取主体内容。
        // 仅当存在主体内容时才执行操作。
        if (me.onExpanding() !== false && (body = me.body ? me.body() : me.elem)) {

			Dom.removeClass(me.elem, me.cssClass + '-collapsed');
			
            Dom.show(body, {
				args: duration,
				effect: 'height', 
				duration: me.collapseDuration, 
				callback: function () {
					//   body.style.height = 'auto';
	            	me.onExpand(); 
	            }, 
	            link: 'ignore'
	        });

        }

        return me;
    }

};
