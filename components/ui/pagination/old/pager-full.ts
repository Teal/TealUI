

import * as dom from "dom";
import ComboBox from "comboBox";
import { initPager } from "pager/pager-simple";

export default function pager(elem: HTMLElement, callback?: (page: number, pageSize: number) => boolean | void, totalCount?: number, currentPage = 1, pageSize = 10) {
    const pageCount = Math.ceil(totalCount / pageSize) || 1;
    const changePage = (value: number) => {
        const pageSize = +comboBox.value;
        if (value >= 1 && value <= pageCount) {
            pager(elem, callback, totalCount, value, pageSize);
            callback && callback(value, pageSize);
        }
    };
    elem.innerHTML = `显示行数：
<span class="x-picker x-page-size" style="width: 70px;">
    <input type="text" class="x-textbox x-pager-input " readonly>
    <button class="x-button"><i class="x-icon">↡</i></button>
</span>
<menu class="x-listbox x-popover">
    <li><a href="javascript:;">10</a></li>
    <li><a href="javascript:;">20</a></li>
    <li><a href="javascript:;">50</a></li>
</menu>

<div class="x-pager-total">
    <span>总共${totalCount?totalCount:'0'}条记录，共${pageCount?pageCount:'0'}页</span>
</div>

<div class="x-right">
    <span class="x-pager" style="margin: 0"></span>
    <form style="margin-left: 2em; display: inline">
        跳至：<input type="number" class="x-textbox x-page-current"value="${currentPage}" min="1" max="${pageCount}"> 页 
        <input type="submit" class="x-button  x-page-goto-page" value="跳转" style="min-width: 60px;">
    </form> 
</div>`;
    const comboBox = new ComboBox();
    comboBox.autoResize = false;
    comboBox.elem = dom.find(".x-page-size", elem);
    comboBox.value = pageSize + "";
    comboBox.on("change", e => {
        changePage(1);
    });
    initPager(dom.find(".x-pager", elem), p => {
        changePage(p);
    }, pageCount, currentPage);
    dom.on(dom.find("form", elem), "submit", e => {
        e.preventDefault();
        changePage(+dom.getText(dom.find('.x-page-current', elem)));
    });
} 