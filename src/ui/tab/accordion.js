/**
 * @author xuld
 */

//#include ui/tab/accordion.css
//#include ui/core/tabbablecontrol.js

var Accordion = TabbableControl.extend({

	/**
	 * xtype
	 * @type String
	 */
	cssClass: 'x-accordion',

	tpl: '<div class="{cssClass}"></div>',

	itemTpl: '<div class="{cssClass}-panel {cssClass}-collapsed">\
                    <div class="{cssClass}-header">\
                        <a href="javascript:;">{title}</a>\
                    </div>\
                    <div class="{cssClass}-body">\
                        <div class="{cssClass}-content">{content}</div>\
                    </div>\
                </div>',

	getSelectedTab: function () {
		return Dom.find('>.' + this.cssClass + '-panel:not(.' + this.cssClass + '-collapsed)', this.elem);
	},

	init: function (options) {
		var me = this,
            selecedTab = this.getSelectedTab();

		Dom.on(me.elem, options.selectEvent || 'click', function (e) {
			var target = Dom.closest(e.target, '.' + this.cssClass + '-header');
			if (target && target.parentNode.parentNode === this.elem) {
				e.preventDefault();
				this.select(Dom.index(target.parentNode));
			}
		}, me);

		Dom.query('>.' + this.cssClass + '-panel', me.elem).iterate(Dom.addClass, [this.cssClass + '-collapsed']);

		if (selecedTab)
			Dom.removeClass(selecedTab, this.cssClass + '-collapsed');

	},

	getSelectedIndex: function () {
		var elem = this.getSelectedTab();
		return elem ? Dom.index(elem) : -1;
	},

	setSelectedIndex: function (to) {

		var me = this, cssClass = this.cssClass, trigger = 2;

		var from = this.getSelectedTab();
		to = Dom.child(this.elem, to);

		if (from) {
			if (to && from === to) {
				return;
			}

			Dom.removeClass(from, this.cssClass + '-collapsed');
			Dom.hide(Dom.last(from), {
				effect: 'height',
				duration: this.collapseDuration,
				callback: finish
			});
		} else
			finish();

		if (to) {
			Dom.removeClass(to, this.cssClass + '-collapsed')
			Dom.show(Dom.last(to), {
				effect: 'height',
				duration: this.collapseDuration,
				callback: finish
			});
		} else
			finish();

		function finish() {
			if (from && --trigger <= 0) {
				Dom.addClass(from, cssClass + '-collapsed');
			}
		}

	},
	
	addAt: function (index, title, content) {
		Dom.render(Dom.parseNode(String.format(this.itemTpl.replace("{title}", title).replace("{content}", content), this)), this.elem, Dom.child(this.elem, index));
		return this;
	}

});
