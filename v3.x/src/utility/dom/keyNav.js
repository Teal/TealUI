/**
 * @fileOverview 绑定键盘上下左右等常用事件。
 * @author xuld
 */

typeof include === "function" && include("base");

/**
 * 绑定键盘上下左右等常用事件。
 * @param {Object} options 绑定各个事件的处理器。
 */
Dom.prototype.keyNav = function (options, scope) {

    var keys = Dom._keys || (Dom._keys = {
        '13': 'enter',
        '10': 'enter',
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        home: 36,
        end: 35,
        pageUp: 33,
        pageDown: 34,
        esc: 27,
        tab: 9,
        backspace: 8,
        'delete': 46,
        space: 32
    }),
        keyMap = {};

    // 按照 Dom.keys 重新匹配键值。
    for (var key in options) {
        keyMap[keys[key] || key] = options[key];
    }

    if (keyMap.enter || keyMap.ctrlEnter) {
        keyMap['10'] = keyMap['13'] = function (e) {
            if (keyMap.ctrlEnter && e.ctrlKey) {
                return keyMap.ctrlEnter.call(this, e);
            }
            return keyMap.enter.call(this, e);
        };
    }

    this.on('keydown', function (e) {
        var keyCode = e.keyCode;
        // 如果绑定了指定的键值。
        keyMap[keyCode] && keyMap[keyCode].call(this, e) !== true && e.preventDefault();
    });

    if (keyMap.other) {
        this.on('keyup', function (e) {
            var keyCode = e.keyCode;
            !keyMap[e.keyCode] && (keyCode > 18 || keyCode < 16) && keyMap.other.call(this, e) !== true && e.preventDefault();
        });
    }

    return this;
};
