
if (!Function.prototype.bind) {

    /**
     * 返回一个新函数，这个函数执行时 @this 始终为指定的 @scope。
     * @param {Object} scope 要绑定的 @this 的值。
     * @returns {Function} 返回一个新函数。
     * @example (function(){ return this;  }).bind(0)() // 0
     * @since ES5
     */
    Function.prototype.bind = function (scope) {
        var me = this;
        return function () {
            return me.apply(scope, arguments);
        }
    };

}
