define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 绘制页码。
     * @param pageCount 总页数。
     * @param currentPage 当前页码。页码从 1 开始。
     * @param callback 页码内容生成器。
     * @param minCount 首尾保留的页数。
     * @param maxCount 最多显示的页数（不含上一页和下一页）。建议设置为奇数。
     * @example pagination(10, 2, console.log)
     */
    function pagination(pageCount, currentPage, callback, minCount, maxCount) {
        if (minCount === void 0) { minCount = 2; }
        if (maxCount === void 0) { maxCount = 7; }
        console.assert(currentPage > 0 && currentPage <= pageCount);
        console.assert(minCount >= 0);
        console.assert(maxCount > minCount * 2);
        // 根据首页或尾页调整实际的开始和结束页码。
        var start = Math.max(currentPage - Math.floor((maxCount - 1) / 2), 1);
        var end = start + maxCount - 1;
        if (end > pageCount) {
            start = Math.max(start - end + pageCount, 1);
            end = pageCount;
        }
        // 计算是否需要绘制省略号。
        var leftEllipsis = false;
        var rightEllipsis = false;
        if (minCount > 0) {
            if (start > 1) {
                leftEllipsis = true;
                start += minCount;
            }
            if (end < pageCount) {
                rightEllipsis = true;
                end -= minCount;
            }
        }
        // 绘制每个页面。
        if (leftEllipsis) {
            var p = 0;
            while (++p <= minCount) {
                callback(p, false);
            }
            callback(p, true);
        }
        for (var p = start; p <= end; p++) {
            callback(p, false);
        }
        if (rightEllipsis) {
            var p = pageCount - minCount;
            callback(p, true);
            while (++p <= pageCount) {
                callback(p, false);
            }
        }
    }
    exports.default = pagination;
});
//# sourceMappingURL=pagination.js.map