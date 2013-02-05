/**
 * @author sun
 */

Dom.getSelectionRange = function (elem) {

	var s, e, range, stored_range;
	if (elem.selectionStart == undefined) {
		var selection = document.selection;
		if (elem.tagName.toLowerCase() != "textarea") {
			var val = Dom.getText(elem),
			range = selection.createRange().duplicate();
			range.moveEnd("character", val.length);
			s = (range.text == "" ? val.length : val.lastIndexOf(range.text));
			range = selection.createRange().duplicate();
			range.moveStart("character", -val.length);
			e = range.text.length;
		} else {
			range = selection.createRange();
			stored_range = range.duplicate();
			stored_range.moveToElementText(elem);
			stored_range.setEndPoint('EndToEnd', range);
			s = stored_range.text.length - range.text.length;
			e = s + range.text.length;
		}
	} else {
		s = elem.selectionStart;
		e = elem.selectionEnd;
	}
	var te = elem.value.substring(s, e);
	return {
		start: s,
		end: e,
		text: te
	}

};

Dom.setSelectionRange = function (elem, range) {

	if (elem.createTextRange) {

		var range = elem.createTextRange();
		range.moveStart("character", 0)
		range.moveEnd("character", 0);
		range.collapse(true);
		range.moveEnd("character", range.end);
		range.moveStart("character", range.start);
		range.select();

	} else if (elem.selectionStart) {

		elem.focus();
		elem.setSelectionRange(range.start, range.end);

	}

};

Dom.setCursor = function (elem, pos) {

	if (elem.createTextRange) {
		var range = elem.createTextRange();
		range.move("character", pos);
		range.select();
	} else if (elem.selectionStart) {
		elem.focus();
		elem.setSelectionRange(pos, pos);
	}

};

Dom.implement({

	/**
	 * 获取选区区域范围
	 * @return {Object} 返回 {start: 0, end: 3}  对象。
	 */
	getSelectionRange: function () {
		return this.length ? Dom.getSelectionRange(this[0]) : null;
	},

	/**
	 * 设置选区区域范围
	 * @param {Object} {start: 0, end: 3} 对象。
	 */
	setSelectionRange: function (rangeObj) {
		return Dom.iterate(this, Dom.setSelectionRange, rangeObj);
	},

	/**
	 * 获取选区文本
	 * @return {String} 选中的文本
	 */
	getSelectedText: function () {
		return this.length ? Dom.getSelectionRange(this[0]).text : null;
	},

	/**
	 * 设置选区文本
	 * @param {String} 文本
	 * @param {Boolean} true代表选中插入文本 false表示不选中
	 */
	setSelectedText: function (text, isSelect) {
		return Dom.iterate(this, function (elem) {
			var val = Dom.getText(elem);

			var s = Dom.getSelectionRange(elem);

			var a = val.substring(0, s.start);
			var b = val.substring(s.end);

			Dom.setText(elem, a + text + b);

			s.end = s.start + text.length;
			if (isSelect) {
				Dom.setSelectionRange(elem, s);
			} else {
				Dom.setCursor(elem, s.end);
			}

		});
	}

});
