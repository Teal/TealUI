/**
 * @author xuld
 */

/**
 * 以动画方式逐字打印指定节点的内容。
 * @param {Number} [speed=150] 每个字打印的间隙时间。
 * @param {String} [cursor="|"] 打字时作为光标的字符。
 * @param {Function} [callback] 当全部字符打印完成时的回调函数。函数参数为：
 * * @this {Element} 当前的目标节点。
 * * @param {Number} speed 每个字打印的间隙时间。
 * @returns this
 * @example $("#elem1").animateText()
 */
Dom.prototype.animateText = function (speed, cursor, callback) {
    speed = speed || 150;
    cursor = cursor == null ? "|" : cursor;
    return this.each(function (elem) {
        var html = elem.innerHTML;
        var pos = 0;

        function step() {

            // 跳过 HTML 标签和空白字符。
            while (/^[\s<]/.test(html.charAt(pos))) {
                pos = Math.max(html.charAt(pos++) === "<" ? html.indexOf(">", pos) : html.substr(pos).search(/\S/) + pos, pos);
            }

            elem.innerHTML = html.substr(0, ++pos) + cursor;

            if (pos < html.length) {
                setTimeout(step, speed);
            } else {
                elem.innerHTML = html;
                callback && callback.call(elem, speed);
            }
        }

        step();

    });
};
