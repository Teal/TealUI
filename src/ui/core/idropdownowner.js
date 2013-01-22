/** * @author [作者] */
/**
 * 所有支持下拉菜单的组件实现的接口。
 * @interface IDropDownOwner
 */
var IDropDownOwner = {

	/**
	 * 获取或设置当前实际的下拉菜单。
	 * @protected
	 * @type {Dom}
	 */
	dropDown: null,

	/**
	 * 下拉菜单的宽度。
	 * @config {String}
	 * @defaultValue 'auto'
	 * @return 如果值为 -1, 则和下拉菜单目标节点有同样的宽度。如果值为 'auto'， 表示根据内容自动决定。
	 */
	dropDownWidth: -1,

	///**
	// * 下拉菜单的最小宽度。
	// * @config {Integer}
	// * @defaultValue 100
	// * @return 如果值为 Infinity, 则表示不限制最小宽度。
	// * @remark 也可以通过 css 的 min-width 属性设置此值。
	// */
	//dropDownMinWidth: 100,

	/**
	 * 当下拉菜单被显示时执行。
     * @protected virtail
	 */
	onDropDownShow: function () {
		this.trigger('dropdownshow');
	},

	/**
	 * 当下拉菜单被隐藏时执行。
     * @protected virtail
	 */
	onDropDownHide: function () {
		this.trigger('dropdownhide');
	},

	attach: function (parentNode, refNode) {
		var dropDown = this.dropDown;
		if (dropDown && !dropDown.closest('body')) {
			dropDown.attach(parentNode, refNode);
		}
		Dom.prototype.attach.call(this, parentNode, refNode);
	},

	detach: function (parentNode) {
		Dom.prototype.detach.call(this, parentNode);
		if (this.dropDown) {
			this.dropDown.detach(parentNode);
		}
	},

	/**
	 * 设置当前控件的下拉菜单。
     * @param {Dom} dom 要设置的下拉菜单节点。
	 * @return {Dom} 
     * @protected virtual
	 */
	setDropDown: function (dom) {

		if (dom) {

			// 修正下拉菜单为 Dom 对象。
			dom = dom instanceof Dom ? dom : Dom.get(dom);

			// 初始化并保存下拉菜单。
			this.dropDown = dom.addClass('x-dropdown').hide();

			// 如果下拉菜单未添加到 DOM 树，则添加到当前节点后。
			if (!dom.closest('body')) {

				// 添加下拉菜单到 DOM 树。
				this.after(dom);

				// IE6/7 无法自动在父节点无 z-index 时处理 z-index 。
				if (navigator.isQuirks && (dom = dom.parent()) && dom.getStyle('zIndex') === 0) {
					dom.setStyle('zIndex', 1);
				}
			}

			// dom = null 表示清空下拉菜单。
		} else if (dom = this.dropDown) {
			dom.remove();
			this.dropDown = null;
		}

		return this;
	},

	/**
	 * 获取当前控件的下拉菜单。
	 * @return {Dom} 
     * @protected virtual
	 */
	getDropDown: function () {
		return this.dropDown;
	},

	/**
     * 判断当前下拉菜单是否被隐藏。
     * @return {Boolean} 如果下拉菜单已经被隐藏，则返回 true。
     * @protected virtual
     */
	isDropDownHidden: function () {
		return this.dropDown && Dom.isHidden(this.dropDown.node);
	},

	/**
     * 切换下拉菜单的显示状态。
     * @return this
     */
	toggleDropDown: function (e) {

		// 如果菜单已经隐藏，则使用 showDropDown 显示，否则，强制关闭菜单。
		return this.isDropDownHidden() ? this.showDropDown(e) : this.hideDropDown();
	},

	/**
     * 显示下拉菜单。
     * @return this
     */
	showDropDown: function (e) {

		var me = this;

		// 如果是因为 DOM 事件而切换菜单，则测试是否为 disabled 状态。
		if (!e || !me.getAttr('disabled') && !me.getAttr('readonly')) {

			// 如果下拉菜单被隐藏，则先重设大小、定位。
			if (me.isDropDownHidden()) {

				// 重新设置位置。
				var dropDown = me.dropDown.show().pin(me, 'b', 0, -1),
	                dropDownWidth = me.dropDownWidth;

				// 重新修改宽度。

				if (dropDownWidth < 0) {

					// 在当前目标元素的宽、下拉菜单的 min-width 属性、下拉菜单自身的宽度中找一个最大值。
					dropDownWidth = Math.max(me.getSize().x, Dom.styleNumber(dropDown.node, 'min-width'), dropDown.getScrollSize().x);

				}

				if (dropDownWidth !== 'auto') {
					dropDown.setSize(dropDownWidth);
				}

				// 设置 mouseup 后自动隐藏菜单。
				document.on('mouseup', me.hideDropDown, me);

			}

			me.onDropDownShow();

		}

		return this;
	},

	/**
     * 隐藏下拉菜单。
     * @return this
     */
	hideDropDown: function (e) {

		var dropDown = this.dropDown;

		// 仅在本来已显示的时候操作。
		if (dropDown && !this.isDropDownHidden()) {

			// 如果是来自事件的关闭，则检测是否需要关闭菜单。
			if (e) {
				e = e.target;

				// 如果事件源是来自下拉菜单自身，则不操作。
				if (dropDown.node == e || this.node === e || Dom.has(dropDown.node, e) || Dom.has(this.node, e))
					return this;
			}

			dropDown.hide();

			// 删除 mouseup 回调。
			document.un('mouseup', this.hideDropDown);

		}

		this.onDropDownHide();

		return this;
	}

};