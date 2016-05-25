

typeof include === "function" && include("ajax");

/**
 * 返回一个表单的参数表示形式。
 * @param {HTMLFormElement} formElem 表单元素。
 * @returns {String} 返回表单是参数形式。
 * @example Ajax.paramForm(document.getElementById("form"))
 */
Ajax.paramForm = function (formElem) {
    typeof console === "object" && console.assert(formElem, "Ajax.paramForm(formElem: 不能为空)");
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
 * 通过 Ajax 提交一个表单。
 * @param {HTMLFormElement} formElem 表单元素。
 * @param {Function} [onsuccess] 成功回调函数。
 * @param {Function} [onerror] 错误回调函数。
 * @returns {Object} 返回请求对象。
 * @example Ajax.submit(document.getElementById("form"), function(data){alert("提交成功了, 返回数据" + data)}, function(errorCode){alert("提交失败了， 错误码" + errorCode)})
 */
Ajax.submit = function (formElem, onsuccess, onerror) {
    typeof console === "object" && console.assert(formElem, "Ajax.submit(formElem: 不能为空)");
	return Ajax.send({
	    type: formElem.method,
	    url: formElem.action,
		data: Ajax.paramForm(formElem),
		success: onsuccess,
		error: onerror
	});
};
