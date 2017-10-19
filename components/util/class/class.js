define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个类。
     */
    var Class = /** @class */ (function () {
        function Class() {
        }
        /**
         * 继承当前类创建新的子类。
         * @param prototype 子类实例成员。其中 `contructor` 表示子类的构造函数。
         * @return 返回一个新类。
         * @desc
         * - 只支持单继承。
         * - 子类的构造函数会覆盖父类构造函数。
         * - 定义的引用成员会被所有实例共用，引用类型的字段应在构造函数中赋初始值。
         * @example
         * var MyClass = Class.extend({name: "xuld"});  // 创建子类。
         * var obj = new MyClass();                     // 创建子类的实例。
         * console.log(obj.name);
         */
        Class.extend = function (prototype) {
            // 未指定函数则使用默认构造函数(Object.prototype.constructor)。
            prototype = prototype || {};
            var subClass;
            // 生成缺省构造函数：直接调用父类构造函数 。
            if (!Object.prototype.hasOwnProperty.call(prototype, "constructor")) {
                prototype.constructor = function Object() {
                    if (subClass.__proto__ !== Class) {
                        return subClass.__proto__.apply(this, arguments);
                    }
                };
            }
            // 直接使用构造函数作为类型本身。
            subClass = prototype.constructor;
            // 设置派生类的原型。
            subClass.prototype = prototype;
            /*@cc_on
    
            // IE6-9: 不支持 __proto__
            if (!('__proto__' in Object.prototype)) {
                let key;
                function BaseClass() {
                    for (key in prototype) {
                        this[key] = prototype[key];
                    }
                    // IE6-8 无法遍历 JS 内置 constructor 属性，这里手动覆盖。
                    this.constructor = subClass;
                };
                for (key in this) {
                    subClass[key] = this[key];
                }
                BaseClass.prototype = this.prototype;
                subClass.prototype = new BaseClass;
            }
    
            @*/
            subClass.__proto__ = this;
            prototype.__proto__ = this.prototype;
            return subClass;
        };
        return Class;
    }());
    exports.default = Class;
});
//# sourceMappingURL=class.js.map