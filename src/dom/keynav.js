/**
 * @author xuld
 */

//#include dom/base.js

/**
 * 常用键名的简写。
 */
Dom.keys = {
    '13': 'enter',
    '10': 'enter',
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    esc: 27,
    tab: 9,
    backspace: 8,
    'delete': 46,
    space: 32
};

Dom.keyNav = function (elem, options, scope) {
	var opt = {}, key;

	// 按照 Dom.keys 重新匹配键值。
	for (key in options) {
		opt[Dom.keys[key] || key] = options[key];
	}

	Dom.on(elem, 'keydown', function (e) {
		var keyCode = e.keyCode;

		// 如果绑定了指定的键值。
		if (opt[keyCode]) {
			return opt[keyCode].call(this, e) === true;
		}

	}, scope);

	// 如果绑定了回车事件。
	// IE 6 只能在 keypress 监听到回车事件。
	if (opt.enter || opt.ctrlEnter) {
		Dom.on(elem, 'keypress', function (e) {
			var keyCode = e.keyCode;
			if (keyCode === 13 || keyCode === 10) {
				return opt[opt.ctrlEnter && e.ctrlKey ? 'ctrlEnter' : 'enter'].call(this, e) === true;
			}
		}, scope);
	}

	if (opt.other) {
		Dom.on(elem, 'keyup', function (e) {
			var keyCode = e.keyCode;
			if (!opt[keyCode] && !(opt.enter && (keyCode === 13 || keyCode === 10))) {
				return opt.other.call(this, e);
			}
		}, scope);
	}
};

/**
 * 绑定某按键执行后的回调函数。
 * @param {Object} {keyCode: func} 形式的 JSON 对象。 keyCode 可以使用 Dom.keys 的简写。
 * @return this
 */
Dom.prototype.keyNav = function () {
	return this.iterate(Dom.keyNav, arguments);
};
