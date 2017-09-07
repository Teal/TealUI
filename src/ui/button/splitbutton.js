/**
 * @author xuld
 */

//#include ui/button/buttongroup.css
//#include ui/button/splitbutton.css
//#include ui/button/menubutton.js

var SplitButton = MenuButton.extend({

	cssClass: 'x-splitbutton',

	tpl: '<span class="{cssClass} x-buttongroup">\
				<button class="x-button"></button>\
				<button class="x-button"><span class="x-menubutton-arrow x-menubutton-arrow-down"></span></button>\
			</span>',

	content: function () {
		return Dom.find('.x-button', this.elem);
	},

	input: function () {
		return this.content();
	},

	state: function (name, value) {
		if (name == "disabled") {
			Dom.query('.x-button', this.elem).forEach(function (elem) {
				Dom.setAttr(elem, name, value);
				Dom.toggleClass(elem, 'x-button-disabled', value);
			});
		} else if (name == "actived") {
			Dom.toggleClass(Dom.last(this.elem, '.x-button'), 'x-button-actived', value !== false);
		} else {
			MenuButton.prototype.state.call(this, name, value);
		}

	},

	init: function () {
		this.setDropDown(this.createDropDown(Dom.next(this.elem, '.x-dropdown')));
		Dom.on(Dom.find('>.x-button:last-child', this.elem), 'click', this.toggleDropDown, this);
	}

});
