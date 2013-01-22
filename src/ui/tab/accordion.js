/**
 * @author xuld
 */



include("ui/tab/accordion.css");
include("ui/core/tabbablecontrol.js");


var Accordion = TabbableControl.extend({
	
	/**
	 * xtype
	 * @type String
	 */
	xtype: 'accordion',
	
	tpl: '<div class="x-control"></div>',

	itemTpl: '<div class="x-accordion-panel x-accordion-collapsed">\
                    <div class="x-accordion-header">\
                        <a href="javascript:;">{title}</a>\
                    </div>\
                    <div class="x-accordion-body">\
                        <div class="x-accordion-content">{content}</div>\
                    </div>\
                </div>',

	addAt: function (index, title, content) {
	    return this.insertBefore(Dom.parse(this.itemTpl.replace("{title}", title).replace("{content}", content)), this.child(index));
	},
	
	onToggleTab: function (from, to) {
		
		var me = this, trigger = 2;
		
		if(from) {
			if(to && from.node === to.node) {
				return;
			}
			
			from.removeClass('x-accordion-collapsed').last().hide({
		    	effect: 'height',
		    	duration: this.collapseDuration,
		    	callback: finish
		    });
		} else
		    finish();
		
		if(to)
		    to.removeClass('x-accordion-collapsed').last().show({
		    	effect: 'height',
		    	duration: this.collapseDuration,
		    	callback: finish
		    });
		else
		    finish();
			
		function finish(){
			if(--trigger <= 0 && from){
				from.addClass('x-accordion-collapsed');
			}
		}
		
	},
	
	getSelectedTab: function(){
		return this.find('.x-accordion-panel:not(.x-accordion-collapsed)');
	},
	
	init:function(options){
	    var me = this,
            selecedTab = me.getSelectedTab();

	    me.delegate('>.x-accordion-header', options.selectEvent || 'click', function (e) {
	        e.preventDefault();
		    me.selectTab(this.parent());
		});

		me.query('>.x-accordion-panel').addClass('x-accordion-collapsed');

		if (selecedTab)
		    selecedTab.removeClass('x-accordion-collapsed');
			
	}
	
});