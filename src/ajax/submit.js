

//#include ajax/base.js

/**
 * 返回一个表单的参数表示形式。
 * @param {HTMLFormElement} formElem 表单元素。
 * @return {String} 参数形式。
 */
Ajax.paramForm = function(formElem) {
	//assert(formElem && formElem.tagName == "FORM", "HTMLFormElement.param(formElem): 参数 {formElem} 不是合法的 表单 元素", formElem);
	var s = [], input, e = encodeURIComponent, value, name;
	for (var i = 0, len = formElem.length; i < len; i++) {
		input = formElem[i];
		
		// 如果存在名字。
		if (!input.disabled && (name = input.name)) {
		
			// 增加多行列表。
			if (input.type == "select-multiple") {
				
				// 多行列表  selectedIndex 返回第一个被选中的索引。
				// 遍历列表，如果 selected 是 true， 表示选中。
			
				var j = input.selectedIndex;
				if (j != -1) {
					input = input.options;
					for (var l = input.length; j < l; j++) {
						if (input[j].selected) {
							s.push(e(name) + "=" + e(input[j].value));
						}
					}
				}
				
			} else if (!/checkbox|radio/.test(input.type) || input.checked !== false){
				s.push(e(name) + "=" + e(input.value));
			}
		}
	}
	
	return s.join('&');

};

/**
 * 通过 ajax 提交一个表单。
 * @param {HTMLFormElement} formElem 表单元素。
 * @param {Function} [onsuccess] 成功回调函数。
 * @param {Function} [onerror] 错误回调函数。
 * @param {Object} timeouts=-1 超时时间， -1 表示不限。
 * @param {Function} [ontimeout] 超时回调函数。
 */
Ajax.submit = function(formElem, onsuccess, onerror) {
	return Ajax.send({
		type: form.method,
		url: form.action,
		data: Ajax.paramForm(formElem),
		success: onsuccess,
		error: onerror
	});
};
