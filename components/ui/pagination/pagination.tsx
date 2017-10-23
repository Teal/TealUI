import * as dom from "web/dom";
import Control, { VNode, bind } from "ui/control";
import { ListItem } from "ui/listBox";
import ComboBox from "ui/comboBox";
import TextBox from "ui/textBox";
import { NormalizedValidityResult } from "ui/input";
import pagination from "web/pagination";
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
     * 每页显示的条数。
     */
    @bind pageSize = 20;

    /**
     * 总页数。
     */
    get pageCount() {
        return this.total ? Math.ceil(this.total / this.pageSize) : 1;
    }
    set pageCount(value) {
        this.total = this.pageSize * value;
    }

    /**
     * 当前页码。页码从 1 开始。
     */
    @bind currentPage = 1;

    /**
     * 首尾保留的页数。
     */
    @bind minCount = 2;

    /**
     * 最多显示的页数（不含上一页和下一页）。建议设置为奇数。
     */
    @bind maxCount = 7;

    /**
     * 是否显示总条数。
     */
    @bind showTotal = true;

    /**
     * 是否显示页面大小切换器。
     */
    @bind showSizeChanger = true;

    /**
     * 页面切换器显示的页码。
     */
    @bind sizeChangerItems = [10, 20, 30];

    /**
     * 是否显示上一页。
     */
    @bind showPrevPage = true;

    /**
     * 是否显示页码。
     */
    @bind showPagination = true;

    /**
     * 是否显示下一页。
     */
    @bind showNextPage = true;

    /**
     * 是否显示快速跳转。
     */
    @bind showQuickJumper = true;

    protected render() {
        let html = "";
        const append = (tpl: string, page: any) => {
            html += tpl.replace(/{page}/g, page);
        };

        if (this.showPrevPage) {
            append(this.currentPage <= 1 ? Pagination.locale.prevDisabled : Pagination.locale.prev, this.currentPage - 1);
        }
        if (this.showPagination) {
            pagination(this.pageCount, this.currentPage, (page, ellipsis) => {
                if (ellipsis) {
                    html += Pagination.locale.ellipsis;
                } else {
                    append(page === this.currentPage ? Pagination.locale.itemDisabled : Pagination.locale.item, page);
                }
            });
        }
        if (this.showNextPage) {
            append(this.currentPage >= this.pageCount ? Pagination.locale.nextDisabled : Pagination.locale.next, this.currentPage + 1);
        }
        return <nav class="x-pagination">
            <div class="x-pagination-header">
                {this.showSizeChanger ? ["每页条数：",
                    <ComboBox class="x-pagination-sizechanger" value={this.pageSize.toString()} onChange={this.handleSizeChange} pattern={/^\d+$/} hideSuccess>
                        {this.sizeChangerItems.map(item => <ListItem>{item}</ListItem>)}
                    </ComboBox>] : null}
                {this.showTotal ? ` 共 ${this.total || 0} 条` : ""}
            </div>
            {this.showQuickJumper ? <form class="x-pagination-footer" onSubmit={this.handleQuickJumperClick}>
                跳至：<TextBox type="number" class="x-textbox x-pagination-quickjumper" value={this.currentPage.toString()} min={1} max={this.pageCount} validateDelay={0} hideSuccess /> 页
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

    /**
     * 处理页码点击事件。
     * @param e 相关事件参数。
     */
    protected handleClick = (e: MouseEvent) => {
        const page = +(e.target as HTMLElement).getAttribute("data-value")!;
        if (page) {
            this.select(page);
        }
    }

    /**
     * 处理快速跳转事件。
     * @param e 相关事件参数。
     */
    protected handleQuickJumperClick = (e: UIEvent) => {
        e.preventDefault();
        const input = this.find(".x-pagination-quickjumper") as TextBox;
        if ((input.reportValidity() as NormalizedValidityResult).valid) {
            this.select(+input.value);
        }
    }

    /**
     * 处理页面改变事件。
     * @param e 相关事件参数。
     */
    protected handleSizeChange = (e: UIEvent) => {
        const input = this.find(".x-pagination-sizechanger") as ComboBox;
        if ((input.reportValidity() as NormalizedValidityResult).valid) {
            this.select(undefined, +input.value);
        }
    }

    /**
     * 切换到指定的页码和页大小。
     * @param page 页码。
     * @param pageSize 页大小。
     */
    select(page = this.currentPage, pageSize = this.pageSize) {
        if ((!this.onSelect || this.onSelect(page, pageSize, this) !== false) && (this.currentPage !== page || this.pageSize !== pageSize)) {
            this.currentPage = page;
            this.pageSize = pageSize;
            this.onChange && this.onChange(page, pageSize, this);
        }
    }

    /**
     * 切换页码或页大小事件。
     * @param page 新的页码。
     * @param pageSize 新的页大小。
     * @param sender 事件源。
     * @return 如果事件返回 false 则阻止切换。
     */
    onSelect: (page: number, pageSize: number, sender: this) => boolean | void;

    /**
     * 更改页面或页大小事件。
     * @param page 新的页码。
     * @param pageSize 新的页大小。
     * @param sender 事件源。
     */
    onChange: (page: number, pageSize: number, sender: this) => void;

}
