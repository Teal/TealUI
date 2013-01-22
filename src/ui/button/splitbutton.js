/**
 * @author xuld
 */


include("ui/button/buttongroup.css");
include("ui/button/splitbutton.css");
include("ui/button/menubutton.js");


var SplitButton = MenuButton.extend({
	
	xtype: 'splitbutton',
	
	tpl: '<span class="ui-splitbutton ui-buttongroup">\
				<button class="ui-button"></button>\
				<button class="ui-button"><span class="ui-menubutton-arrow ui-menubutton-arrow-down"></span></button>\
			</span>',
			
	content: function(){
		return this.find('.ui-button');
	},

	input: function(){
	    return this.content();
	},

	state: function (name, value) {
	    if (name == "disabled") {
	        this.query('.ui-button').setAttr(name, value).toggleClass('ui-button-disabled', value);
	    } else if (name == "actived") {
	        this.last('.ui-button').toggleClass('ui-button-actived', value !== false);
	    } else {
	        this.base('state');
	    }

	    return this;
	},
	
	init: function () {
	    this.setDropDown(this.createDropDown(this.next('.ui-dropdown')));
		this.find('>.ui-button:last-child').on('click', this.toggleDropDown, this);
	}
	
});
