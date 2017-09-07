import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import { ListItem } from "ui/listBox";
import ComboBox from "ui/comboBox";
import TextBox from "ui/textBox";
import { NormalizedValidityResult } from "ui/input";
import "./pagination.scss";

/**
 * 表示一个分页。
 */
export default class Pagination extends Control {

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
    @bind maxSize = 7;

    /**
     * 总页数。
     */
    get pageCount() {
        return this.total ? Math.ceil(this.total / this.pageSize) : 1;
    }
    set pageCount(value) {
        this.total = this.pageSize * value;
        this.invalidate();
    }

    @bind showTotal = true;

    @bind showSizeChanger = true;

    @bind showQuickJumper = true;

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
        append(this.currentPage <= 1 ? Pagination.locale.prevDisabled : Pagination.locale.prev, this.currentPage - 1);
        if (this.maxSize > 0) {
            if (leftEllipsis) {
                for (let p = 1; p <= this.minSize; p++) {
                    append(Pagination.locale.item, p);
                }
                html += Pagination.locale.ellipsis;
            }
            for (let p = start; p <= end; p++) {
                append(p === this.currentPage ? Pagination.locale.itemDisabled : Pagination.locale.item, p);
            }
            if (rightEllipsis) {
                html += Pagination.locale.ellipsis;
                for (let p = this.pageCount - this.minSize + 1; p <= this.pageCount; p++) {
                    append(Pagination.locale.item, p);
                }
            }
        }
        append(this.currentPage >= this.pageCount ? Pagination.locale.nextDisabled : Pagination.locale.next, this.currentPage + 1);
        return <nav class="x-pagination">
            <div class="x-pagination-header">
                {this.showSizeChanger ? ["每页条数：",
                    <ComboBox class="x-pagination-sizechanger" value={this.pageSize.toString()} onChange={this.handleSizeChange}>
                        <ListItem>10</ListItem>
                        <ListItem>20</ListItem>
                        <ListItem>30</ListItem>
                    </ComboBox>] : null}
                {this.showTotal ? ` 共 ${this.total || 0} 条` : ""}
            </div>
            {this.showQuickJumper ? <form class="x-pagination-footer" onSubmit={this.handleQuickJumperClick}>
                跳至：<TextBox type="number" class="x-textbox x-pagination-quickjumper" value={this.currentPage.toString()} noValidate min={1} max={this.pageCount} /> 页
                &nbsp;<input type="submit" class="x-button x-page-goto-page" value="跳转" style="min-width: 60px;" />
            </form> : null}
            <div class="x-pagination-body" innerHTML={html} onClick={this.handleClick}></div>
        </nav>;
    }

    /**
     * 存储本地化文案配置。
     */
    static locale = {
        item: `<a href="javascript://第 {page} 页" title="转到：第 {page} 页" data-value="{page}">{page}</a>`,
        itemDisabled: `<a class="x-pagination-active">{page}</a>`,
        prev: `<a href="javascript://第 {page} 页" class="x-pagination-prev" title="转到：第 {page} 页" data-value="{page}"><i class="x-icon">⮜</i>上一页</a>`,
        prevDisabled: ``,
        next: `<a href="javascript://第 {page} 页" class="x-pagination-next" title="转到：第 {page} 页" data-value="{page}">下一页 <i class="x-icon">⮞</i></a>`,
        nextDisabled: ``,
        ellipsis: ` ... `
    };

    protected handleClick = (e: MouseEvent) => {
        const page = (e.target as HTMLElement).getAttribute("data-value");
        if (page) {
            this.currentPage = +page;
            this.onSelect && this.onSelect(this.currentPage, this.pageSize);
        }
    }

    protected handleQuickJumperClick = (e: UIEvent) => {
        e.preventDefault();
        const input = this.find(".x-pagination-quickjumper") as TextBox;
        const result = input.checkValidity() as NormalizedValidityResult;
        if (result.valid) {
            input.setCustomValidity({ status: null });
            this.currentPage = +input.value;
            this.onSelect && this.onSelect(this.currentPage, this.pageSize);
        } else {
            input.setCustomValidity(result);
        }
    }

    protected handleSizeChange = (e: UIEvent) => {
        const input = this.find(".x-pagination-sizechanger") as ComboBox;
        // TODO: 添加字段验证。
        this.pageSize = +input.value;
        this.onSelect && this.onSelect(this.currentPage, this.pageSize);
    }

    onSelect: (page: number, pageSize: number) => void;

}

// /**
//  * 生成包含指定分页信息的分页器 HTML。
//  * @param {Element} elem 渲染的父节点。
//  * @param {Number} totalCount 总的项数，这些项数将被分页。
//  * @param {Number} [pageSize=20] 每页的项数。
//  * @param {Number} [PaginationCount=5] 显示的分页计数器个数，超过将不再显示。尽量传递奇数。
//  * @param {Number} [currentPage=1] 当前的页码，页数从 1 开始。
//  * @param {Function / String} [callback] 点击分页后的回调函数或生成的链接个数。其中 {page} 表示当前的页码。{pageSize} 表示每页的项数。
//  * @param {String} [href="?size={pageSize}&page={page}"] 生成的链接格式。其中 {page} 表示当前的页码。{pageSize} 表示每页的项数。
//  */
// function initPagination(elem, totalCount, pageSize, PaginationCount, currentPage, callback) {
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
//         elem.innerHTML = generatePagination(totalCount, pageSize, PaginationCount, page, href);
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
// export default function generatePagination(pageCount: number, currentPage = +(/[?&]page=(\d+)/.exec(location.href) || 0)[1] || 1, href = /([?&]page)=(\d+)/.test(location.search) ? location.search.replace(/([?&]page)=(\d+)/, '$1={page}') : (location.search ? location.search + '&' : '?') + 'page={page}', maxSize = 9, minSize = 2) {

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
// export function initPagination(elem: HTMLElement, callback?: (page?: number) => boolean | void, pageCount?: number, currentPage = 1, maxSize?: number, minSize?: number) {
//     elem.onclick = e => {
//         const hrefMatch = /page=(\d+)/.exec((<HTMLAnchorElement>e.target).href);
//         if (hrefMatch) {
//             const page = +hrefMatch[1];
//             elem.innerHTML = generatePagination(pageCount, page, undefined, maxSize, minSize);
//             if (callback && callback(page) !== true) {
//                 e.preventDefault();
//             }
//         }
//     };
//     elem.innerHTML = generatePagination(pageCount, currentPage, undefined, maxSize, minSize);
// }//
