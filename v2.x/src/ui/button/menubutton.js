/**
 * @author  xuld
 */

//#include ui/button/menubutton.css
//#include ui/core/idropdownowner.js
//#include ui/button/button.css
//#include ui/core/iinput.js
//#include ui/core/contentcontrol.js
//#include ui/core/listcontrol.js

var MenuButton = Control.extend(IDropDownOwner).implement(IInput).implement({
	
	cssClass: 'x-menubutton',
	
	tpl: '<button class="x-button {cssClass}" type="button"><span class="{cssClass}-arrow"></span></button>',
	
	createDropDown: function (existDom) {
		if(existDom && !Dom.hasClass(existDom, 'x-menu')){
			return existDom;
		}
		//assert(window.Menu, "必须载入 Controls.Menu.Menu 组件才能初始化 x-menu 的菜单项。");
		existDom = new Menu(existDom);
		Dom.on(existDom.elem, 'click', this.onDropDownClick, this);
		return existDom;

	},
	
	init: function () {
	    this.setDropDown(this.createDropDown(Dom.next(this.elem, '.x-dropdown')));
	    Dom.on(this.elem, 'click', this.toggleDropDown, this);
	},
	
	onDropDownShow: function(){
	    this.state('actived', true);
	    IDropDownOwner.onDropDownShow.apply(this, arguments);
	},
	
	onDropDownHide: function(){
	    this.state('actived', false);
	    IDropDownOwner.onDropDownHide.apply(this, arguments);
	},
	
	onDropDownClick: function(){
		this.hideDropDown();
	}
	
});

ListControl.alias(MenuButton, 'getDropDown');
