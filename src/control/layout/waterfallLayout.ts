
/**
 * 对指定节点进行瀑布流布局。
 * @param {Element} container 要布局的容器。
 * @param {Number} [columnCount=4] 要分割的列数。
 * @param {Number} [rowSpace=10] 每行之间的空白。
 * @param {Number} [columnSpace=10] 每列之间的空白。
 */
function waterfallLayout(container, columnCount, rowSpace, columnSpace) {

    if (columnCount == null) {
        columnCount = 4;
    }

    if (rowSpace == null) {
        rowSpace = 10;
    }

    if (columnSpace == null) {
        columnSpace = 10;
    }

    // 支持内部元素绝对位置。
    container.style.position = 'relative';

    var node = container.firstElementChild,
        layoutInfo = [],
        leftInfo = [],
        minColumn = 0,
        i,
        columnWidth = (container.offsetWidth - columnSpace * (columnCount - 1)) / columnCount;

    // 初始化每列信息。
    for (i = 0; i < columnCount; i++) {
        layoutInfo[i] = 0;
        leftInfo[i] = minColumn;
        minColumn += columnWidth + columnSpace;
    }

    // 对每个节点布局。
    for (; node; node = node.nextElementSibling) {
        node.style.position = "absolute";
        node.style.width = columnWidth + "px";

        minColumn = 0;

        // 从每一列中找到最小的列。
        for (i = 1; i < columnCount; i++) {
            if (layoutInfo[i] < layoutInfo[minColumn]) {
                minColumn = i;
            }
        }

        node.style.left = leftInfo[minColumn] + "px";
        node.style.top = layoutInfo[minColumn] + "px";

        layoutInfo[minColumn] += node.offsetHeight + rowSpace;

    }

    // 设置容器的高度。
    minColumn = 0;
    for (i = 0; i < columnCount; i++) {
        if (layoutInfo[i] > minColumn) {
            minColumn = layoutInfo[i];
        }
    }
    container.style.height = Math.max(minColumn - rowSpace, 0) + "px";

}
