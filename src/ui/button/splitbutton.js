/**
 * @author xuld
 */

//#include ui/button/buttongroup.css
//#include ui/button/splitbutton.css
//#include ui/button/menubutton.js

var SplitButton = MenuButton.extend({

	cssClass: 'ui-splitbutton',

	tpl: '<span class="{cssClass} ui-buttongroup">\
				<button class="ui-button"></button>\
				<button class="ui-button"><span class="ui-menubutton-arrow ui-menubutton-arrow-down"></span></button>\
			</span>',

	content: function () {
		return Dom.find('.ui-button', this.elem);
	},

	input: function () {
		return this.content();
	},

	state: function (name, value) {
		if (name == "disabled") {
			Dom.query('.ui-button', this.elem).each(function (elem) {
				Dom.setAttr(elem, name, value);
				Dom.toggleClass(elem, 'ui-button-disabled', value);
			});
		} else if (name == "actived") {
			Dom.toggleClass(Dom.last(this.elem, '.ui-button'), 'ui-button-actived', value !== false);
		} else {
			MenuButton.prototype.state.call(this, name, value);
		}

	},

	init: function () {
		this.setDropDown(this.createDropDown(Dom.next(this.elem, '.ui-dropdown')));
		Dom.on(Dom.find('>.ui-button:last-child', this.elem), 'click', this.toggleDropDown, this);
	}

});
