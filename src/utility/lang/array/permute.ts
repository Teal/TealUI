// #todo


interface Array<T> {

}

/**
 * 计算数组的全排列结果。
 * @returns {Array} 如果已新增则返回 @true，否则返回 @false。
 */
Array.prototype.permute = function () {
    var result = [],
        usedChars = [];
    function next(input) {
        for (var i = 0; i < input.length; i++) {
            var ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
                result.push(usedChars.slice());
            }
            next(input);
            input.splice(i, 0, ch);
            usedChars.pop();
        }
    }
    return next(this);
};
