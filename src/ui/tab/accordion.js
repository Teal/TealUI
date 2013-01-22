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
	
	tpl: '<div class="ui-control"></div>',

	itemTpl: '<div class="ui-accordion-panel ui-accordion-collapsed">\
                    <div class="ui-accordion-header">\
                        <a href="javascript:;">{title}</a>\
                    </div>\
                    <div class="ui-accordion-body">\
                        <div class="ui-accordion-content">{content}</div>\
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
			
			from.removeClass('ui-accordion-collapsed').last().hide({
		    	effect: 'height',
		    	duration: this.collapseDuration,
		    	callback: finish
		    });
		} else
		    finish();
		
		if(to)
		    to.removeClass('ui-accordion-collapsed').last().show({
		    	effect: 'height',
		    	duration: this.collapseDuration,
		    	callback: finish
		    });
		else
		    finish();
			
		function finish(){
			if(--trigger <= 0 && from){
				from.addClass('ui-accordion-collapsed');
			}
		}
		
	},
	
	getSelectedTab: function(){
		return this.find('.ui-accordion-panel:not(.ui-accordion-collapsed)');
	},
	
	init:function(options){
	    var me = this,
            selecedTab = me.getSelectedTab();

	    me.delegate('>.ui-accordion-header', options.selectEvent || 'click', function (e) {
	        e.preventDefault();
		    me.selectTab(this.parent());
		});

		me.query('>.ui-accordion-panel').addClass('ui-accordion-collapsed');

		if (selecedTab)
		    selecedTab.removeClass('ui-accordion-collapsed');
			
	}
	
});