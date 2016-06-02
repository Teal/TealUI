// #todo


/**
 * 创建一个延时执行函数。
 * @param {Function} fn 执行的函数。
 * @param {Number} [duration=0] 延时的毫秒数。
 * @returns {Function} 返回一个可触发延时执行的函数。
 * 如果在延时等待期间有新的调用，则之前的延时失效，重新开始延时执行。
 * @example
 * document.onscroll = Function.createDelayed(function(){
 *      console.log('延时执行');
 * }, 100);
 */
Function.createDelayed = function (fn, duration) {
    typeof console === "object" && console.assert(fn instanceof Function, "Function.createDelayed(fn: 必须是函数, [duration])");
    var timer;
    return function () {
        var me = this, args = arguments;
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            timer = 0;
            fn.apply(me, args);
        }, duration || 0);
    };
};
