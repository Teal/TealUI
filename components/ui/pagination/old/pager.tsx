import { Control, VNode, bind } from "control";
import "./pager.scss";

/**
 * 表示一个分页器。
 */
export class Pager extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        console.assert(this.currentPage > 0 && this.currentPage <= this.pageCount);
        console.assert(this.minSize >= 0);
        console.assert(this.maxSize > this.minSize * 2);
        let html = "";
        function append(tpl: string, page: number) {
            html += tpl.replace(/{page}/g, page as any);
        }
        let start = Math.max(this.currentPage - Math.floor((this.maxSize - 1) / 2), 1);
        let end = start + this.maxSize - 1;
        if (end > this.pageCount) {
            start = Math.max(start - end + this.pageCount, 1);
            end = this.pageCount;
        }
        let leftEllipsis = false;
        let rightEllipsis = false;
        if (this.minSize > 0) {
            if (start > 1) {
                leftEllipsis = true;
                start += this.minSize;
            }
            if (end < this.pageCount) {
                rightEllipsis = true;
                end -= this.minSize;
            }
        }
        append(this.currentPage <= 1 ? Pager.locale.prevDisabled : Pager.locale.prev, this.currentPage - 1);
        if (leftEllipsis) {
            for (let p = 1; p <= this.minSize; p++) {
                append(Pager.locale.item, p);
            }
            html += Pager.locale.ellipsis;
        }
        for (let p = start; p <= end; p++) {
            append(p === this.currentPage ? Pager.locale.itemDisabled : Pager.locale.item, p);
        }
        if (rightEllipsis) {
            html += Pager.locale.ellipsis;
            for (let p = this.pageCount - this.minSize + 1; p <= this.pageCount; p++) {
                append(Pager.locale.item, p);
            }
        }
        append(this.currentPage >= this.pageCount ? Pager.locale.nextDisabled : Pager.locale.next, this.currentPage + 1);
        return <nav class="x-pager">
            <div class="x-pager-header">
                每页
                    <span class="x-picker">
                    <input type="text" class="x-textbox" value={this.pageSize.toString()} />
                    <button class="x-button"><i class="x-icon">⮟</i></button>
                </span>
                行，共 200 条
                </div>
            <div class="x-pager-footer" innerHTML={html} onClick={this.handleClick}>
                <div>

                </div>
                <a href="###"><span class="x-icon">⮜</span>上一页</a>
                <a class="x-pager-active" href="###">1</a>
                <a href="###">2</a>
                ...
                <a href="###">99</a>
                <a href="###">100</a>
                <a href="###">下一页 <span class="x-icon">⮞</span></a>
                <form style="margin-left: 2em; display: inline">
                    跳至：<input type="number" class="x-textbox x-page-current" value="1" min="1" max="4" /> 页
                            <input type="submit" class="x-button  x-page-goto-page" value="跳转" style="min-width: 60px;" />
                </form>
            </div>
        </nav>;
    }

    /**
     * 存储本地化文案配置。
     */
    static locale = {
        item: `<a href="javascript://第 {page} 页" title="转到：第 {page} 页" data-value="{page}">{page}</a>`,
        itemDisabled: `<a class="x-pager-active">{page}</a>`,
        prev: `<a href="javascript://第 {page} 页" class="x-pager-prev" title="转到：第 {page} 页" data-value="{page}"><i class="x-icon">⮜</i>上一页</a>`,
        prevDisabled: ``,
        next: `<a href="javascript://第 {page} 页" class="x-pager-next" title="转到：第 {page} 页" data-value="{page}">下一页 <i class="x-icon">⮞</i></a>`,
        nextDisabled: ``,
        ellipsis: ` ... `
    };

    /**
     * 总条数。
     */
    @bind total: number;

    /**
     * 当前页数。页数从 1 开始。
     */
    @bind currentPage = 1;

    /**
     * 每页的条数。
     */
    @bind pageSize = 20;

    /**
     * 首尾保留的页数。
     */
    @bind minSize = 2;

    /**
     * 最多显示的页数(不含上一页和下一页)。建议设置为奇数。
     */
    @bind maxSize = 9;

    /**
     * 总页数。
     */
    get pageCount() {
        return Math.ceil(this.total / this.pageSize);
    }
    @bind set pageCount(value) {
        this.total = this.pageSize * value;
    }

    @bind showTotal: boolean;

    @bind showSizeChanger: boolean;

    @bind showQuickJumper: boolean;

    protected handleClick(e: MouseEvent) {
        const page = (e.target as HTMLElement).getAttribute("data-value");
        if (page) {
            this.onSelect && this.onSelect(+page);
        }
    }

    onSelect: (page: number) => void;

}

export default Pager;

// /**
//  * 生成包含指定分页信息的分页器 HTML。
//  * @param {Element} elem 渲染的父节点。
//  * @param {Number} totalCount 总的项数，这些项数将被分页。
//  * @param {Number} [pageSize=20] 每页的项数。
//  * @param {Number} [pagerCount=5] 显示的分页计数器个数，超过将不再显示。尽量传递奇数。
//  * @param {Number} [currentPage=1] 当前的页码，页数从 1 开始。
//  * @param {Function / String} [callback] 点击分页后的回调函数或生成的链接个数。其中 {page} 表示当前的页码。{pageSize} 表示每页的项数。
//  * @param {String} [href="?size={pageSize}&page={page}"] 生成的链接格式。其中 {page} 表示当前的页码。{pageSize} 表示每页的项数。
//  */
// function initPager(elem, totalCount, pageSize, pagerCount, currentPage, callback) {
//     var href;
//     if (!callback || callback.constructor !== Function) {
//         href = callback;
//         callback = 0;
//     }
//     elem.on('click', 'a', function (e) {
//         var hrefMatch = /page=(\d+)/.exec(this.href);
//         !hrefMatch || changePage(+hrefMatch[1]) !== true && e.preventDefault();
//     });//
//     changePage(currentPage || +(/page=(\d+)/.exec(location.href) || [0, 1])[1]);//
//     // 切换页码的逻辑。
//     function changePage(page) {
//         elem.innerHTML = generatePager(totalCount, pageSize, pagerCount, page, href);
//         return callback && callback(page, pageSize * (page - 1), Math.min(pageSize * page - 1, totalCount));
//     }//
// }//
// /**
//  * 存储本地化文案配置。
//  */
// export const locale = {

// };//
// /**
//  * 生成一段页码 HTML。
//  * @param pageCount 总页数。
//  * @param currentPage 当前页数。页码从 1 开始。
//  * @param href 生成的链接地址。其中 {page} 表示当前的页码。
//  * @param maxSize 最多显示的页数(不含上一页和下一页)。建议设置为奇数。
//  * @param minSize 首尾保留的页数。
//  */
// export default function generatePager(pageCount: number, currentPage = +(/[?&]page=(\d+)/.exec(location.href) || 0)[1] || 1, href = /([?&]page)=(\d+)/.test(location.search) ? location.search.replace(/([?&]page)=(\d+)/, '$1={page}') : (location.search ? location.search + '&' : '?') + 'page={page}', maxSize = 9, minSize = 2) {

// }//
// /**
//  * 生成包含指定分页信息的分页器 HTML。
//  * @param elem 渲染的父节点。
//  * @param callback 点击分页后的回调函数或生成的链接个数。其中 {page} 表示当前的页码。{pageSize} 表示每页的项数。
//  * @param pageCount 总页数。
//  * @param currentPage 当前页数。页码从 1 开始。
//  * @param maxSize 最多显示的页数(不含上一页和下一页)。建议设置为奇数。
//  * @param minSize 首尾保留的页数。
//  */
// export function initPager(elem: HTMLElement, callback?: (page?: number) => boolean | void, pageCount?: number, currentPage = 1, maxSize?: number, minSize?: number) {
//     elem.onclick = e => {
//         const hrefMatch = /page=(\d+)/.exec((<HTMLAnchorElement>e.target).href);
//         if (hrefMatch) {
//             const page = +hrefMatch[1];
//             elem.innerHTML = generatePager(pageCount, page, undefined, maxSize, minSize);
//             if (callback && callback(page) !== true) {
//                 e.preventDefault();
//             }
//         }
//     };
//     elem.innerHTML = generatePager(pageCount, currentPage, undefined, maxSize, minSize);
// }//
