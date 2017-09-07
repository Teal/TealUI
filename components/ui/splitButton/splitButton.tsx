// import { Control, VNode, bind } from "control";
// import "./splitButton.scss";

// /**
//  * 表示一个分隔按钮。
//  */
// export class SplitButton extends Control {

//     /**
//      * 当被子类重写时负责渲染当前控件。
//      * @return 返回一个虚拟节点。
//      */
//     protected render() {
//         return <div class="x-splitbutton"></div>;
//     }

// }
// /**
//  * @author xuld@vip.qq.com
//  */

// typeof include === "function" && include("ui/button/buttongroup.css
// ");
// typeof include === "function" && include("ui/button/splitbutton.css
// ");
// typeof include === "function" && include("ui/button/menubutton.js
// ");

// var SplitButton = Control.extend({

//     role: "splitButton",

//     init: function () {
//         var me = this;
//         me.dropDown = (Dom(me.menu).valueOf() || me.dom.next('.x-popover, .x-dropdownmenu')).role('popover', {
//             target: me.dom.find('.x-button:last-child'),
//             pinTarget: me.dom
//         }).on('show', function () {
//             me.dom.find('.x-button:last-child').addClass('x-button-active');
//         }).on('hide', function () {
//             me.dom.find('.x-button:last-child').removeClass('x-button-active');
//         });
//     }

// });

// export default SplitButton;
// /**
//  * @author xuld
//  */



// imports("Controls.Button.SplitButton");
// using("Controls.Button.MenuButton");


// var SplitButton = MenuButton.extend({
	
// 	xtype: 'splitbutton',
	
// 	tpl: '<span class="x-splitbutton x-buttongroup">\
// 				<button class="x-button">&nbsp;</button>\
// 				<button class="x-button"><span class="x-button-menu x-button-menu-down"></span></button>\
// 			</span>',
			
// 	content: function(){
// 		return this.find('.x-button').last(true);
// 	},
	
// 	disabled: function(value) {
// 		value = value !== false;
// 		this.query('x-button').setAttr('disabled', value).toggleClass('x-button-active', value);
// 		return this;
// 	},
	
// 	actived: function(value){
// 		return this.last('.x-button').toggleClass('x-button-active', value !== false);
// 	},
	
// 	init: function () {
// 		var next = this.next();
// 		this.setDropDown(this.createDropDown(next && next.hasClass('x-dropdown') ? next : null));
// 		this.find('>.x-button:last-child').on('click', this.toggleDropDown, this);
// 	}
	
// });
