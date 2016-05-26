
/**
 * 每隔指定时间执行一次函数。
 * @param {Function} fn 要执行的函数。其参数为：
 * 
 * * @param {Number} count 当前执行的次数。
 * * @returns {Boolean}  如果返回 @false 则强制停止执行。
 * 
 * @param {Number} [times=-1] 执行的次数。如果指定为 -1 则无限次执行。
 * @param {Number} [duration=0] 每次执行之间的间隔毫秒数。
 * @example Function.interval(function(a){console.log(a) }, 10, 400)
 */
Function.interval = function (fn, times, duration) {
    typeof console === "object" && console.assert(fn instanceof Function, "Function.interval(fn: 必须是函数, [times], [duration])");
    var count = 0;
    duration = duration || 0;
    function callback() {
        if ((times < 0 || count <= times) && fn(count++) !== false) {
            setTimeout(callback, duration);
        }
    }
    callback();
};
