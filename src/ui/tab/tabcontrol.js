/**
 * @author 
 */

include("ui/tab/tabbable.css");
include("ui/core/tabbablecontrol.js");

/**
 * TAB 选项卡。
 */
var TabControl = TabbableControl.extend({
	
	xtype: 'tabcontrol',
	
	tpl: '<div class="x-tabcontrol">\
			<ul class="x-tabcontrol-header x-tabbable">\
			</ul>\
			<div class="x-tabcontrol-body">\
	        </div>\
        </div>',

	collapseDuration: undefined,
        
	header: function () {
	    return this.find('.x-tabbable');
	},
        
	body: function () {
	    return this.find('.x-tabcontrol-body');
	},
	
	item: function(index){
	    return this.header().child(index);
	},

	getContentOf: function (tab) {
	    var href = tab.getAttr('href');
	    return /^#/.test(href) && Dom.get(href.substr(1)) || this.body().child(tab.index());
	},

	init: function (options) {

	    var me = this;

	    // 委托头部选择信息。
	    this.header().delegate('>li', options.selectEvent || 'click', function (e) {
	        var href = e.getTarget().getAttr('href');
	        if (!href || href == '#' || href == 'javascript') {
	            e.preventDefault();
	        }
	        me.selectTab(this);
	    });

	    var tab = me.getSelectedTab() || me.item(0);

	    me.header().children().removeClass('x-tabbable-selected');

	    me.body().children().hide();

	    if (tab) {
	        tab.addClass('x-tabbable-selected');
	        var content = me.getContentOf(tab);
	        if (content) {
	            content.show();
	        }
	    }

	},

	onToggleTab: function (from, to) {
	    if (from) {
	        from.removeClass('x-tabbable-selected');
	        var content = this.getContentOf(from);
	        if (content) {
	            content.hide();
	        }
	    }

	    if (to) {
	        to.addClass('x-tabbable-selected');
	        var content = this.getContentOf(to);
	        if (content) {
	            content.show(this.collapseDuration);
	        }
	    }
	},
	
	addAt: function (index, title, content) {
	    var header = this.header();
	    var tab = header.insertBefore(Dom.parse('<li class="x-tabbable-item"><a href="javascript:;">' + title + '</a></li>'), header.child(index));
	    var body = this.body();
	    body.insertBefore(Dom.parse('<div class="x-tabpage">' + content + '</div>').hide(), body.child(index));
	    return tab;
	},
	
	removeAt: function (index) {
	    var tab = this.header().child(index);
	    if (tab) {
	        if (this.getSelectedIndex() === index) {
	            this.setSelectedIndex(index + 1);
	        }
	        var content = this.getContentOf(tab);
	        if (content) {
	            content.remove();
	        }

	        tab.remove();
	    }

	    return tab;
	},

	getSelectedTab: function () {
	    return this.header().find('.x-tabbable-selected');
	}

});


