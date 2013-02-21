/**
 * @author 
 */

//#include ui/tab/tabbable.css
//#include ui/core/tabbablecontrol.js

/**
 * TAB 选项卡。
 */
var TabControl = TabbableControl.extend({
	
	xtype: 'tabcontrol',
	
	tpl: '<div class="ui-tabcontrol">\
			<ul class="ui-tabcontrol-header ui-tabbable">\
			</ul>\
			<div class="ui-tabcontrol-body">\
	        </div>\
        </div>',

	collapseDuration: undefined,
        
	header: function () {
	    return this.find('.ui-tabbable');
	},
        
	body: function () {
	    return this.find('.ui-tabcontrol-body');
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

	    me.header().children().removeClass('ui-tabbable-selected');

	    me.body().children().hide();

	    if (tab) {
	        tab.addClass('ui-tabbable-selected');
	        var content = me.getContentOf(tab);
	        if (content) {
	            content.show();
	        }
	    }

	},

	onToggleTab: function (from, to) {
	    if (from) {
	        from.removeClass('ui-tabbable-selected');
	        var content = this.getContentOf(from);
	        if (content) {
	            content.hide();
	        }
	    }

	    if (to) {
	        to.addClass('ui-tabbable-selected');
	        var content = this.getContentOf(to);
	        if (content) {
	            content.show(this.collapseDuration);
	        }
	    }
	},
	
	addAt: function (index, title, content) {
	    var header = this.header();
	    var tab = header.insertBefore(Dom.parse('<li class="ui-tabbable-item"><a href="javascript:;">' + title + '</a></li>'), header.child(index));
	    var body = this.body();
	    body.insertBefore(Dom.parse('<div class="ui-tabpage">' + content + '</div>').hide(), body.child(index));
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
	    return this.header().find('.ui-tabbable-selected');
	}

});


