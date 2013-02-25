/**
 * @author 
 */

//#include ui/tab/tabbable.css
//#include ui/core/tabbablecontrol.js

/**
 * TAB 选项卡。
 */
var TabControl = TabbableControl.extend({
	
	cssClass: 'ui-tabcontrol',
	
	tpl: '<div class="{cssClass}">\
			<ul class="{cssClass}-header ui-tabbable">\
			</ul>\
			<div class="{cssClass}-body">\
	        </div>\
        </div>',

	collapseDuration: undefined,
        
	header: function () {
		return Dom.find('.' + this.cssClass + '-header', this.elem);
	},
        
	body: function () {
		return Dom.find('.' + this.cssClass + '-body', this.elem);
	},

	contentOf: function (tab) {
		var href = Dom.getAttr(tab, 'href');
		return /^#/.test(href) && Dom.get(href.substr(1)) || Dom.child(this.body(), Dom.index(tab));
	},

	getSelectedTab: function () {
		return Dom.find('.ui-tabbable-selected', this.header());
	},

	init: function (options) {

	    var me = this;

	    // 委托头部选择信息。
	    Dom.on(this.header(), options.selectEvent || 'click', 'li', function (e) {
			
	    	var href = Dom.getAttr(e.target, 'href');
	        if (!href || /^(javascript|#)/.test(href)) {
	            e.preventDefault();
	        }
	        me.select(Dom.index(this));
	    });

	    var tab = this.getSelectedTab() || Dom.first(this.header());

	    Dom.children(me.header()).iterate(Dom.removeClass, ['ui-tabbable-selected']);

	    Dom.children(me.body()).hide();

	    if (tab) {
	    	Dom.addClass(tab, 'ui-tabbable-selected');
	        var content = me.contentOf(tab);
	        if (content) {
	        	Dom.show(content);
	        }
	    }

	},

	getSelectedIndex: function () {
		var elem = this.getSelectedTab();
		return elem ? Dom.index(elem) : -1;
	},

	setSelectedIndex: function (to) {

		var from = this.getSelectedTab();

	    if (from) {
	    	Dom.removeClass(from, 'ui-tabbable-selected');
	    	var content = this.contentOf(from);
	        if (content) {
	        	Dom.hide(content);
	        }
	    }

	    to = Dom.child(this.header(), to);

	    if (to) {
	    	Dom.addClass(to, 'ui-tabbable-selected');
	        var content = this.contentOf(to);
	        if (content) {
	        	Dom.show(content, this.collapseDuration);
	        }
	    }
	},
	
	addAt: function (index, title, content) {
	    var header = this.header();
	    var tab = Dom.render(Dom.parseNode('<li class="ui-tabbable-item"><a href="javascript:;">' + title + '</a></li>'), header, Dom.child(header, index));
	    var body = this.body();
	    var tab = Dom.parseNode('<div class="ui-tabpage">' + content + '</div>');
	    Dom.hide(tab);
	    Dom.render(tab, body, Dom.child(body, index));
	    return this;
	},
	
	removeAt: function (index) {
		var tab = Dom.child(this.header(), index);
	    if (tab) {
	        if (this.getSelectedIndex() === index) {
	            this.setSelectedIndex(index + 1);
	        }
	        var content = this.contentOf(tab);
	        if (content) {
	        	Dom.remove(content);
	        }

	        Dom.remove(tab);
	    }

	    return this;
	}

});
