/**
 * @fileOverview 设置滚动显示指定元素时回调。
 * @author xuld
 */

typeof include === "function" && include("base");

/**
 * 渐变滚动当前元素到指定位置。
 * @param {Number} x 滚动的目标水平位置。
 * @param {Number} y 滚动的目标垂直位置。
 * @param {Number} [duration=100] 滚动的特效时间。如果为 0 则不使用渐变。
 * @param {Function} [callback] 滚动特效完成后的回调。
 */
Dom.prototype.touchRotate = function (options) {

    var lastRadius;

    this.on('touchstart', function (e) {

        $(this).html('asd');
        var touches = e.touches,
            x1 = touches[0].pageX,
            y1 = touches[0].pageY,
            x2 = touches[touches.length - 1].pageX,
            y2 = touches[touches.length - 1].pageY;

       $(this).html( getRadius(x1, y1, x2, y2)  );
    });

};

function getRadius(x1, y1, x2, y2) {
    if (x1 == x2) return 90;
    var tan = (y2 - y1) / (x2 - x1);
    if (tan > 0) return Math.atan(tan) * 180 / Math.PI;
    return 180 + Math.atan(tan) * 180 / Math.PI;
}
