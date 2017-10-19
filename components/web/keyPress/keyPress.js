define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var keys = {
        __proto__: null,
        esc: 27,
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        pageUp: 33,
        pageDown: 34,
        home: 36,
        end: 35,
        space: 32,
        tab: 9,
        backspace: 8,
        delete: 46
    };
    /**
     * 绑定指定元素的键盘按键事件。
     * @param elem 元素。
     * @param options 由键值和要绑定的事件函数组成的键值对。
     */
    function keyPress(elem, options) {
        var map = {};
        for (var key in options) {
            map[keys[key] || key] = options[key];
        }
        if (options.enter || options.ctrlEnter) {
            map["10"] = map["13"] = function (e) {
                if (options.ctrlEnter && (e.ctrlKey || e.metaKey)) {
                    return options.ctrlEnter(e);
                }
                if (options.enter) {
                    return options.enter(e);
                }
            };
        }
        elem.addEventListener("keydown", function (e) {
            var func = map[e.keyCode];
            if (func && func.call(this, e) !== false) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
        if (map.other) {
            elem.addEventListener("keyup", function (e) {
                // 忽略 Shift 等组合键。
                var keyCode = e.keyCode;
                if ((keyCode < 16 || keyCode > 18) && !map[keyCode]) {
                    map.other.call(this, e);
                }
            }, false);
        }
    }
    exports.default = keyPress;
});
//# sourceMappingURL=keyPress.js.map