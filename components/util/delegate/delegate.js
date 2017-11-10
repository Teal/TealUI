var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个委托。
     */
    var Delegate = /** @class */ (function (_super) {
        __extends(Delegate, _super);
        /**
         * 初始化新的委托。
         * @param funcs 所有委托的函数。
         */
        function Delegate() {
            var funcs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                funcs[_i] = arguments[_i];
            }
            return _super.call(this) || this;
        }
        /**
         * 添加一个委托函数。
         * @param func 要添加的函数。
         * @example
         * var del = new Delegate()
         * del.add(() => { console.log("teal") })
         * del() // 控制台输出 teal
         */
        Delegate.prototype.add = function (func) {
            this.funcs.push(func);
        };
        /**
         * 删除一个委托函数。
         * @param func 要删除的函数。
         * @example
         * var fn = () => { console.log("teal") }
         * var del = new Delegate()
         * del.add(fn)
         * del.remove(fn)
         * del() // 控制台不输出
         */
        Delegate.prototype.remove = function (func) {
            var index = this.funcs.indexOf(func);
            if (index >= 0) {
                this.funcs.splice(index, 1);
            }
        };
        /**
         * 删除所有委托函数。
         * var del = new Delegate()
         * del.add(() => { console.log("teal") })
         * del.clear()
         * del() // 控制台不输出
         */
        Delegate.prototype.clear = function () {
            this.funcs.length = 0;
        };
        return Delegate;
    }(Function));
    exports.default = Delegate;
    var prototype = Delegate.prototype;
    var func = exports.default = function Delegate() {
        var funcs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            funcs[_i] = arguments[_i];
        }
        var delegate = function () {
            for (var _i = 0, _a = delegate.funcs; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler.apply(this, arguments);
            }
        };
        if (delegate.__proto__) {
            delegate.__proto__ = func.prototype;
        }
        else {
            for (var key in func.prototype) {
                delegate[key] = func.prototype[key];
            }
        }
        delegate.funcs = funcs;
        return delegate;
    };
    func.prototype = prototype;
});
//# sourceMappingURL=delegate.js.map