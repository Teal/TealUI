define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function bresenham(startX, startY, endX, endY, callback) {
        var r;
        if (!callback) {
            r = [];
        }
        var dx = endX - startX;
        var dy = endY - startY;
        var adx = Math.abs(dx);
        var ady = Math.abs(dy);
        var sx = dx > 0 ? 1 : -1;
        var sy = dy > 0 ? 1 : -1;
        var eps = 0;
        if (adx > ady) {
            for (var x = startX, y = startY; sx < 0 ? x >= endX : x <= endX; x += sx) {
                if (callback) {
                    callback(x, y);
                }
                else {
                    r.push({ x: x, y: y });
                }
                eps += ady;
                if ((eps << 1) >= adx) {
                    y += sy;
                    eps -= adx;
                }
            }
        }
        else {
            for (var x = startX, y = startY; sy < 0 ? y >= endY : y <= endY; y += sy) {
                if (callback) {
                    callback(x, y);
                }
                else {
                    r.push({ x: x, y: y });
                }
                eps += adx;
                if ((eps << 1) >= ady) {
                    x += sx;
                    eps -= ady;
                }
            }
        }
        return r;
    }
    exports.default = bresenham;
});
//# sourceMappingURL=bresenham.js.map