


using('System.Dom.Base')


Dom.implement({
	
	/**
	 * 设置当文本框空的时候，显示的文本。
	 */
	placeholder: function (value) {
		var dom = this.node.form;

		function hidePlaceHolder() {
			if (this.getText() === value) {
				this.removeClass('placeholder');
				this.setText('');
			}
		}

		function showPlaceHolder() {
			if (!this.getText()) {
				this.setText(value);
				this.addClass('placeholder');
			}
		}

		this.on('focus', hidePlaceHolder);
		this.on('blur', showPlaceHolder);

		if (dom) {
			Dom.get(dom).on('submit',hidePlaceHolder, this);
		}



		hidePlaceHolder.call(this);
		showPlaceHolder.call(this);
	}

});
