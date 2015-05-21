/**
 * @author  xuld
 */

// #require ui/button/menubutton.css
// #require ui/core/idropdownowner.js
// #require ui/button/button.css
// #require ui/core/iinput.js
// #require ui/core/contentcontrol.js
// #require ui/core/listcontrol.js

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
