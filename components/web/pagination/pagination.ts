/**
 * 绘制页码。
 * @param pageCount 总页数。
 * @param currentPage 当前页码。页码从 1 开始。
 * @param callback 页码内容生成器。
 * @param minCount 首尾保留的页数。
 * @param maxCount 最多显示的页数（不含上一页和下一页）。建议设置为奇数。
 * @example pagination(10, 2, console.log)
 */
export default function pagination(pageCount: number, currentPage: number, callback: (page: number, ellipsis: boolean) => void, minCount = 2, maxCount = 7) {
    console.assert(currentPage > 0 && currentPage <= pageCount);
    console.assert(minCount >= 0);
    console.assert(maxCount > minCount * 2);

    // 根据首页或尾页调整实际的开始和结束页码。
    let start = Math.max(currentPage - Math.floor((maxCount - 1) / 2), 1);
    let end = start + maxCount - 1;
    if (end > pageCount) {
        start = Math.max(start - end + pageCount, 1);
        end = pageCount;
    }

    // 计算是否需要绘制省略号。
    let leftEllipsis = false;
    let rightEllipsis = false;
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
        let p = 0;
        while (++p <= minCount) {
            callback(p, false);
        }
        callback(p, true);
    }
    for (let p = start; p <= end; p++) {
        callback(p, false);
    }
    if (rightEllipsis) {
        let p = pageCount - minCount;
        callback(p, true);
        while (++p <= pageCount) {
            callback(p, false);
        }
    }
}
