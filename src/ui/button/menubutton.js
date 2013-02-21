/**
 * @author  xuld
 */


//#include ui/button/menubutton.css
//#include ui/core/idropdownowner.js
//#include ui/button/button.js
//#include ui/core/listcontrol.js



var MenuButton = Button.extend(IDropDownOwner).implement({
	
	xtype: 'menubutton',
	
	tpl: '<button class="ui-button ui-control" type="button"><span class="ui-menubutton-arrow"></span></button>',
	
	createDropDown: function (existDom) {
		if(existDom && !existDom.hasClass('ui-menu')){
			return existDom;
		}
		//assert(window.Menu, "必须载入 Controls.Menu.Menu 组件才能初始化 ui-menu 的菜单项。");
		return new Menu(existDom).on('click', this.onDropDownClick, this);
	},

	state: function (name, value) {
	    return this.toggleClass('ui-button-' + name, value);
	},
	
	init: function () {
	    this.setDropDown(this.createDropDown(this.next('.ui-dropdown')));
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
