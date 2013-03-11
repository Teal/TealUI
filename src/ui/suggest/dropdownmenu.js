/**
 * @author xuld
 */

//#include ui/form/listbox.css
//#include dom/keynav.js
//#include ui/core/listcontrol.js
//#include ui/core/idropdownowner.js

/**
 * 表示一个下拉菜单。用于 Suggest 和 ComboBox 组件。
 * @extends ListControl
 */
var DropDownMenu = ListControl.extend({

	cssClass: "x-listbox",

	owner: null,

	selectMethod: null,

	updateMethod: null,

    /**
	 * 处理上下按键。
     * @private
	 */
    _handleUpDown: function (next) {

        // 如果菜单未显示。
    	if (this.owner.isDropDownHidden()) {

            // 显示菜单。
    		this.owner.showDropDown();
        }
    	var item = this._hovering;

    	if (item) {
    		item = Dom[next ? 'next' : 'prev'](item);
    	}

    	if (!item) {
    		item = Dom[next ? 'first' : 'last'](this.elem);
    	}

    	this.hovering(item);
    },

    /**
	 * 处理回车键。
     * @private
	 */
    _handleEnter: function (next) {
        if (this.owner.isDropDownHidden()) {
            return true;
        }

    	// 交给下列菜单处理。 
        return this.onItemClick(this._hovering);
    },

    onItemClick: function (item) {
    	if (this.selectMethod) {
    		this.owner[this.selectMethod](item);
    	}
        return false;
    },

    /**
     * 设置当前下拉菜单的所有者。绑定所有者的相关事件。
     */
    init: function (options) {

    	//assert(options && options.owner && options.selectMethod, "DropDownMenu#constructor(options): {options} 必须有 owner 和 selectMethod 字段", options);

    	var me = this;

    	// 设置鼠标移到某项后高亮某项。
    	me.itemOn('mouseover', me.hovering);
        
        // 绑定下拉菜单的点击事件
    	me.itemOn('mousedown', me.onItemClick);
		
    	Dom.keyNav(options.owner.elem, {

            up: function () {
                me._handleUpDown(false);
            },

            down: function () {
                me._handleUpDown(true);
            },

            enter: me._handleEnter.bind(me),

            esc: function(){
            	me.owner.hideDropDown();
            },

            other: options.updateMethod && function () {
            	me.owner[me.updateMethod]();
            }

        });
		
	},

    /**
     * 重新设置当前高亮项。
     */
	hovering: function (item) {
	    var clazz = this.cssClass + '-hover';

	    if (this._hovering) {
	    	Dom.removeClass(this._hovering, clazz);
	    }

	    if (item) {
	    	Dom.addClass(item, clazz);
	    }

	    this._hovering = item;
	    return this;
	}

});