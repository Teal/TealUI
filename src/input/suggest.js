/**
 * @author xuld
 */

//#include ui/core/idropdownowner.js
//#include ui/suggest/dropdownmenu.js

/**
 * 智能提示组件。
 * @extends Control
 */
var Suggest = Control.extend(IDropDownOwner).implement({

	/**
	 * 创建当前 Suggest 的菜单。
	 * @return {Dom} 下拉菜单。
	 * @protected virtual
	 */
	createDropDown: function (existDom) {
		var dropDown = new DropDownMenu({
			elem: existDom,
			owner: this,
			selectMethod: 'selectItem',
			updateMethod: 'showDropDown'
		});

		Dom.addClass(dropDown.elem, 'x-suggest');


		return dropDown;
	},

	/**
	 * 当下拉菜单被显示时执行。
     * @protected override
	 */
	onDropDownShow: function () {

		var text = Dom.getText(this.elem);
		var items = this.getSuggestItems(text);

		// 如果智能提示的项为空或唯一项就是当前的项，则不提示。
		if (!items || !items.length || (items.length === 1 && (items[0] === text || items[0] === "<strong>" + text + "</strong>"))) {

			// 隐藏菜单。
			this.hideDropDown();
		} else {

			this.dropDown.set(items);

			// 默认选择当前值。
			this.dropDown.hovering(this.dropDown.item(0));

		}

		IDropDownOwner.onDropDownShow.apply(this, arguments);
	},

	init: function (options) {

		var inSuggest;

		// 关闭原生的智能提示。
		Dom.setAttr(this.elem, 'autocomplete', 'off');

		// 创建并设置提示的下拉菜单。
		this.setDropDown(this.createDropDown(Dom.next(this.elem, 'x-suggest')))

		// 获取焦点后更新智能提示显示状态。
		Dom.on(this.elem, 'focus', this.showDropDown, this);

		var me = this;

		// 失去焦点后隐藏菜单。
		Dom.on(this.elem, 'blur', function () {
			setTimeout(function () {
				if (!inSuggest) {
					me.hideDropDown();
				}
			}, 20);
		});

		Dom.setStyle(this.dropDownNode, 'outline', 'none');
		Dom.setStyle(this.dropDownNode, 'tabindex', -1);
		Dom.on(this.dropDownNode, 'mousedown', function () {
			inSuggest = true;
		});
		Dom.on(this.dropDownNode, 'mouseleave', function () {
			inSuggest = false;
		});

	},

	/**
     * 根据当前的文本框值获取智能提示的项。
     */
	getSuggestItems: function (text) {
		if (!text) {
			return this.suggestItems;
		}

		text = text.toLowerCase();

		var r = [];
		for (var i = 0; i < this.suggestItems.length; i++) {
			var value = this.suggestItems[i];
			var index = value.toLowerCase().indexOf(text);
			if (index === 0) {
				r.push("<strong>" + value.substr(0, text.length) + "</strong>" + value.substr(text.length));
			}
		}

		return r;
	},

	/**
     * 强制设置当前选中的项。
     */
	setSuggestItems: function (value) {
		this.suggestItems = value || [];
		return this;
	},

	/**
     * 模拟用户选择一项。
     */
	selectItem: function (item) {
		if (item) {
			Dom.setText(this.elem, Dom.getText(item));
			this.elem.focus();
		}
		return this.hideDropDown();
	}

});
