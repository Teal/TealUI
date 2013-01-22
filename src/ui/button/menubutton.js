/**
 * @author  xuld
 */


imports("Controls.Button.MenuButton");
using("Controls.Core.IDropDownOwner");
using("Controls.Button.Button");
using("Controls.Core.ListControl");



var MenuButton = Button.extend(IDropDownOwner).implement({
	
	xtype: 'menubutton',
	
	tpl: '<button class="x-button x-control" type="button"><span class="x-menubutton-arrow"></span></button>',
	
	createDropDown: function (existDom) {
		if(existDom && !existDom.hasClass('x-menu')){
			return existDom;
		}
		assert(window.Menu, "必须载入 Controls.Menu.Menu 组件才能初始化 x-menu 的菜单项。");
		return new Menu(existDom).on('click', this.onDropDownClick, this);
	},

	state: function (name, value) {
	    return this.toggleClass('x-button-' + name, value);
	},
	
	init: function () {
	    this.setDropDown(this.createDropDown(this.next('.x-dropdown')));
		this.on('click', this.toggleDropDown, this);
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

ListControl.aliasMethods(MenuButton, 'dropDown');
