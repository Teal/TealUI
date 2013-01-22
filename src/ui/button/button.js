/**
 * @author  xuld
 */


imports("Controls.Button.Button");
using("Controls.Core.IInput");
using("Controls.Core.ContentControl");


var Button = ContentControl.extend({
	
	xtype: 'button',
	
	type: 'button',
	
	tpl: '<button class="x-control" type="button"></button>',
	
	create: function (options) {
	    this.tpl = this.tpl.replace('type="button"', 'type="' + (options.type || this.type) + '"');
	    return Control.prototype.create.call(this, options);
	}
	
}).implement(IInput);

