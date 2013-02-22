/**
 * @author xuld
 */

//#include dom/base.js

Dom.implement({
	
	/**
	 * 设置当文本框空的时候，显示的文本。
	 */
	placeholder: function (value) {

		return this.each(function (elem) {

			if (elem.form) {
				Dom.on(elem.form, 'submit', function () {
					hidePlaceHolder.call(elem);
				}, this);
			}

			Dom.on(elem, 'focus', hidePlaceHolder);
			Dom.on(elem, 'blur', showPlaceHolder);

			hidePlaceHolder.call(elem);
			showPlaceHolder.call(elem);

		});

		function hidePlaceHolder() {
			if (Dom.getText(this) === value) {
				Dom.removeClass(this, 'placeholder');
				Dom.setText(this, '');
			}
		}

		function showPlaceHolder() {
			if (!Dom.getText(this)) {
				Dom.setText(this, value);
				Dom.addClass(this, 'placeholder');
			}
		}
	}

});
