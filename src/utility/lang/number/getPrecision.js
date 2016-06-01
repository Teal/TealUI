Number.prototype.getPrecision = function () {
    var s = this + "",
        d = s.indexOf('.') + 1;

    return !d ? 0 : s.length - d;
};