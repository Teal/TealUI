/**
 * @fileOverview 绑定键盘上下左右等常用事件。
 * @author xuld
 */

/**
 * 绑定键盘上下左右等常用事件。
 * @param {Object} options 绑定各个事件的处理器。
 * @param {Object} [scope] 设置回调函数中 this 的指向。
 */
Element.prototype.keyNav = function (options, scope) {
    var elem = this,
        keyMap = {},
        key;

    // 按照 Dom.keys 重新匹配键值。
    for (key in options) {
        keyMap[Element.keyMap[key] || key] = options[key];
    }

    elem.addEventListener('keydown', function (e) {
        var keyCode = e.keyCode;
        // 如果绑定了指定的键值。
        if (keyMap[keyCode] && keyMap[keyCode].call(scope || this, e) !== true) {
            e.preventDefault();
        }
    }, false);

    // 如果绑定了回车事件。
    // IE 6 只能在 keypress 监听到回车事件。
    if (keyMap.enter || keyMap.ctrlEnter) {
        elem.addEventListener('keypress', function (e) {
            var keyCode = e.keyCode;
            if ((keyCode === 13 || keyCode === 10) && keyMap[keyMap.ctrlEnter && e.ctrlKey ? 'ctrlEnter' : 'enter'].call(scope || this, e) !== true) {
                e.preventDefault();
            }
        }, false);
    }

    if (keyMap.other) {
        elem.addEventListener('keyup', function (e) {
            var keyCode = e.keyCode;
            if (!keyMap[keyCode] && !(keyMap.enter && (keyCode === 13 || keyCode === 10)) && keyMap.other.call(scope || this, e) !== true) {
                e.preventDefault();
            }
        }, false);
    }
};

/**
 * 常用键名的简写。
 */
Element.keyMap = {
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
