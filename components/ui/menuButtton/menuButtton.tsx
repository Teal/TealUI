import { Control, VNode, bind } from "control";
import "./menuButtton.scss";

/**
 * 表示一个菜单按钮。
 */
export class MenuButtton extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-menubuttton"></div>;
    }

}

export default MenuButtton;
/**
 * @author  xuld
 */

/**
 * @author  xuld
 */

typeof include === "function" && include("../control/base");
typeof include === "function" && include("../control/dropDown");

var MenuButton = Control.extend({

    role: "menuButton",

    init: function () {
        var me = this;
        me.dropDown = (Dom(me.menu).valueOf() || me.dom.next('.x-popover, .x-dropdownmenu')).role('popover', {
            target: me.dom
        }).on('show', function() {
            me.dom.addClass('x-button-active');
        }).on('hide', function () {
            me.dom.removeClass('x-button-active');
        });
    }

});


using("Controls.Core.IDropDownOwner");
using("Controls.Button.Button");
using("Controls.Button.Menu");



var MenuButton = Button.extend(IDropDownOwner).implement({
	
	xtype: 'menubutton',
	
	tpl: '<button class="x-button x-control" type="button">&nbsp;<span class="x-button-menu"></span></button>',
	
	content: function(){
		return this.find('.x-button-menu').prev(true);
	},
	
	createDropDown: function(existDom){
		if(existDom && !existDom.hasClass('x-menu')){
			return existDom;
		}
		return new Menu(existDom).on('click', this.onDropDownClick, this);
	},
	
	init: function () {
		var next = this.next();
		this.setDropDown(this.createDropDown(next && next.hasClass('x-dropdown') ? next : null));
		this.on('click', this.toggleDropDown, this);
	},
	
	onDropDownShow: function(){
		this.actived(true);
		return IDropDownOwner.onDropDownShow.apply(this, arguments);
	},
	
	onDropDownHide: function(){
		this.actived(false);
		return IDropDownOwner.onDropDownHide.apply(this, arguments);
	},
	
	onDropDownClick: function(){
		this.hideDropDown();
	}
	
});

ListControl.aliasMethods(MenuButton, 'dropDown');
