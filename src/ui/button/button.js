/**
 * @author  xuld
 */


include("ui/button/button.css");
include("ui/core/iinput.js");
include("ui/core/contentcontrol.js");


var Button = ContentControl.extend({
	
	xtype: 'button',
	
	type: 'button',
	
	tpl: '<button class="ui-control" type="button"></button>',
	
	create: function (options) {
	    this.tpl = this.tpl.replace('type="button"', 'type="' + (options.type || this.type) + '"');
	    return Control.prototype.create.call(this, options);
	}
	
}).implement(IInput);

