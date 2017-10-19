/**
 * @author xuld
 */

typeof include === "function" && include("ui/core/base.js");


/**
 * 生成包含指定分页信息的分页器 HTML。
 * @param {Number} totalCount 总的项数，这些项数将被分页。
 * @param {Number} [pageSize=20] 每页的项数。
 * @param {Number} [pagerCount=5] 显示的分页计数器个数，超过将不再显示。尽量传递奇数。
 * @param {Number} [currentPage=1] 当前的页码，页数从 1 开始。
 * @param {String} [href="?page={page}&size={pageSize}"] 生成的链接格式。其中 {page} 表示当前的页码。{pageSize} 表示每页的项数。
 */
function generatePager(totalCount, pageSize, pagerCount, currentPage, href) {
    pageSize = pageSize || 20;
    pagerCount = pagerCount || 5;
    currentPage = currentPage || 1;
    href = href || '?page={page}&size={pageSize}';

    // 不需要分页。
    if (!totalCount || totalCount <= pageSize) {
        return '';
    }

    var maxPage = Math.ceil(totalCount / pageSize),
        page = Math.max(Math.min(currentPage - Math.floor(pagerCount / 2), maxPage - pagerCount + 1), 1),
        html = '';

    currentPage = Math.max(Math.min(currentPage, maxPage), 1);

    appendLink('prev', currentPage <= 1 ? 1 : currentPage - 1, currentPage <= 1 ? 'x-pager-disabled' : '');
    for (; page <= maxPage && pagerCount > 0; pagerCount--, page++) {
        appendLink('href', page, page === currentPage ? 'x-pager-actived' : '');
    }
    appendLink('next', currentPage >= maxPage ? maxPage : currentPage + 1, currentPage >= maxPage ? 'x-pager-disabled' : '');

    return html;

    function appendLink(key, page, className) {
        html += generatePager.locale[key].replace('{href}', href).replace('{class}', className ? ' class="' + className + '"' : '').replace(/{page}/g, page).replace(/{pageSize}/g, pageSize);
    }

}

generatePager.locale = {
    href: '<a href="{href}"{class} title="转到：第{page}页">{page}</a>',
    prev: '<a href="{href}"{class} title="上一页：第{page}页"><span class="x-icon">«</span></a>',
    next: '<a href="{href}"{class} title="下一页：第{page}页"><span class="x-icon">»</span></a>'
};

/**
 * 生成包含指定分页信息的分页器 HTML。
 * @param {Element} elem 渲染的父节点。
 * @param {Number} totalCount 总的项数，这些项数将被分页。
 * @param {Number} [pageSize=20] 每页的项数。
 * @param {Number} [pagerCount=5] 显示的分页计数器个数，超过将不再显示。尽量传递奇数。
 * @param {Number} [currentPage=1] 当前的页码，页数从 1 开始。
 * @param {Function/String} [callback] 点击分页后的回调函数或生成的链接个数。其中 {page} 表示当前的页码。{pageSize} 表示每页的项数。
 * @param {String} [href="?size={pageSize}&page={page}"] 生成的链接格式。其中 {page} 表示当前的页码。{pageSize} 表示每页的项数。
 */
function initPager(elem, totalCount, pageSize, pagerCount, currentPage, callback) {
    var href;
    if (!callback || callback.constructor !== Function) {
        href = callback;
        callback = 0;
    }
    elem.on('click', 'a', function (e) {
        var hrefMatch = /page=(\d+)/.exec(this.href);
        !hrefMatch || changePage(+hrefMatch[1]) !== true && e.preventDefault();
    });
    
    changePage(currentPage || +(/page=(\d+)/.exec(location.href) || [0, 1])[1]);

    // 切换页码的逻辑。
    function changePage(page) {
        elem.innerHTML = generatePager(totalCount, pageSize, pagerCount, page, href);
        return callback && callback(page, pageSize * (page - 1), Math.min(pageSize * page - 1, totalCount));
    }

}