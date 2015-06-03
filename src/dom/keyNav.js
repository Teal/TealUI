/**
 * @author xuld
 */

// #require dom/base.js

Dom.keyNav = function (elem, options) {
	var keyMap = {}, key;

	// 按照 Dom.keys 重新匹配键值。
	for (key in options) {
	    keyMap[Dom.keyNav.keys[key] || key] = options[key];
	}

	Dom.on(elem, 'keydown', function (e) {
		var keyCode = e.keyCode;
		// 如果绑定了指定的键值。
		if (keyMap[keyCode] && keyMap[keyCode].call(this, e) !== true) {
		    e.preventDefault();
		}
	});

	// 如果绑定了回车事件。
	// IE 6 只能在 keypress 监听到回车事件。
	if (keyMap.enter || keyMap.ctrlEnter) {
		Dom.on(elem, 'keypress', function (e) {
			var keyCode = e.keyCode;
			if ((keyCode === 13 || keyCode === 10) && keyMap[keyMap.ctrlEnter && e.ctrlKey ? 'ctrlEnter' : 'enter'].call(this, e) !== true) {
			    e.preventDefault();
			}
		});
	}

	if (keyMap.other) {
		Dom.on(elem, 'keyup', function (e) {
			var keyCode = e.keyCode;
			if (!keyMap[keyCode] && !(keyMap.enter && (keyCode === 13 || keyCode === 10)) && keyMap.other.call(this, e) !== true) {
			    e.preventDefault();
			}
		});
	}
};

/**
 * 常用键名的简写。
 */
Dom.keyNav.keys = {
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
