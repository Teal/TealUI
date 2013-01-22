/**
 * @author xuld
 */


include("ui/button/buttongroup.css");
include("ui/button/splitbutton.css");
include("ui/button/menubutton.js");


var SplitButton = MenuButton.extend({
	
	xtype: 'splitbutton',
	
	tpl: '<span class="x-splitbutton x-buttongroup">\
				<button class="x-button"></button>\
				<button class="x-button"><span class="x-menubutton-arrow x-menubutton-arrow-down"></span></button>\
			</span>',
			
	content: function(){
		return this.find('.x-button');
	},

	input: function(){
	    return this.content();
	},

	state: function (name, value) {
	    if (name == "disabled") {
	        this.query('.x-button').setAttr(name, value).toggleClass('x-button-disabled', value);
	    } else if (name == "actived") {
	        this.last('.x-button').toggleClass('x-button-actived', value !== false);
	    } else {
	        this.base('state');
	    }

	    return this;
	},
	
	init: function () {
	    this.setDropDown(this.createDropDown(this.next('.x-dropdown')));
		this.find('>.x-button:last-child').on('click', this.toggleDropDown, this);
	}
	
});
