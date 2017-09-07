import * as dom from "uux/dom;
import Control, { VNode, bind } from "ui/control";
import "typo/table/table.scss";
import "./dataGridView.scss";

/**
 * 表示一个表格视图。
 */
export default class DataGridView extends Control {

    protected render() {
        return <div class="x-datagridview"></div>;
    }

}
/**
 * @fileOverview 数据表视图
 * @author xuld <xuld@vip.qq.com>
 */
import * as dom from "dom";
import Control from "control";
import TextBox from "textBox";

/**
 * 表示一个数据表视图。
 */
export default class DataGridView extends Control {

    // #region 表格主体

    /**
     * 获取当前控件的模板。
     */
    protected tpl = `<table class="x-table"><thead><tr/></thead><tbody/></table>`;

    /**
	 * 当被子类重写时，负责初始化当前控件。
	 */
    protected init() {
        const me = this;
        dom.on(this.header, "click", ">*", function(e) { me.onHeaderClick(this, e); });
        dom.on(this.body, "dblclick", ">tr", function(e) { me.onCellDblClick(this, e); });
    }

    protected onHeaderClick(header: HTMLTableCellElement, e: Event) {
        if (this.sortable !== false) {
            const sortColumnIndex = dom.index(header);
            if (this.sortColumnIndex === sortColumnIndex) {
                this.sortDesc = !this.sortDesc;
            } else {
                this.sortColumnIndex = sortColumnIndex;
            }
        }
    }

    protected onCellDblClick(row: HTMLTableRowElement, e: Event) {
        this.toggleEdit(row);
    }

    // #endregion

    // #region 表头和列

    /**
     * 获取表头。
     */
    get head() { return dom.first<HTMLTableSectionElement>(this.elem, "thead"); }

    /**
     * 获取表头行。
     */
    get header() { return dom.last<HTMLTableRowElement>(this.head, "tr"); }

    /**
     * 获取列数。
     */
    get columnCount() { return this.header.cells.length; }

    /**
     * 获取所有列的信息。
     */
    get columns() {
        const result: ColumnInfo<any>[] = [];
        const columnCount = this.columnCount;
        for (let i = 0; i < columnCount; i++) {
            result[i] = this.getColumn(i);
        }
        return result;
    }

    /**
     * 设置所有列的信息。
     */
    set columns(value) {
        this.spliceColumn(0, this.columnCount, ...value);
    }

    /**
     * 获取指定列的信息。
     * @param index 相关的列号。
     * @return 返回列信息。如果列不存在则返回 undefined。
     */
    getColumn<T>(index: number) {
        const cell: DataGridHeaderCell = this.header.cells[index];
        if (cell) {
            return cell.data || (cell.data = {
                name: dom.getHtml(cell),
                title: cell.title || dom.getText(cell),
                hidden: dom.isHidden(cell)
            });
        }
    }

    /**
     * 设置指定列的信息。
     * @param index 相关的列号。如果列超出索引则自动追加。
     * @param value 相关的列信息。设置为 null 表示删除。
     */
    setColumn<T>(index: number, value: ColumnInfo<T>) {
        this.spliceColumn(index, 1, value);
    }

    /**
     * 插入一个列。
     * @param index 插入的列号。
     * @param value 相关的列信息。
     */
    insertColumn<T>(index: number, value?: ColumnInfo<T>) {
        this.spliceColumn(index, 0, value);
    }

    /**
     * 在末尾添加一个列。
     * @param value 相关的列信息。
     */
    addColumn<T>(value?: ColumnInfo<T>) {
        this.insertColumn(this.columnCount, value);
    }

    /**
     * 移除指定的列。
     * @param index 移除的列号。
     */
    removeColumn(index: number) {
        this.spliceColumn(index, 1);
    }

    /**
     * 交换两个列。
     * @param x 交换的第一个列。
     * @param y 交换的第二个列。
     */
    swapColumn(x: number, y: number) {
        console.assert(x >= 0 && x < this.columnCount);
        console.assert(y >= 0 && y < this.columnCount);
        if (x === y) {
            return;
        }
        if (x > y) {
            const t = x;
            x = y;
            y = t;
        }
        const header = this.header;
        const rows = (<HTMLTableElement>this.elem).rows;
        for (let i = 0, row: HTMLTableRowElement; row = rows[i]; i++) {
            const cellX = row.cells[x];
            dom.before(cellX, row.cells[y]);
            dom.after(row.cells[y], cellX);
        }
    }

    /**
     * 新增或删除列信息。
     * @param index 新增或删除的位置。
     * @param removeCount 删除的列数。
     * @param inserts 插入的列。
     */
    spliceColumn(index: number, removeCount: number, ...inserts: ColumnInfo<any>[]) {
        console.assert(index >= 0 && index <= this.columnCount);
        console.assert(removeCount >= 0 && removeCount <= this.columnCount);

        const header = this.header;
        const rows = (<HTMLTableElement>this.elem).rows;
        let needRefilter: boolean;
        let needResort: boolean;
        let i = 0;

        // 更新。
        for (const updateCount = Math.min(removeCount, inserts.length); i < updateCount; i++) {
            const columnIndex = index + i;
            const oldColumn = this.getColumn(columnIndex);
            const newColumn = inserts[i];
            const headerCell: DataGridHeaderCell = header.cells[columnIndex];
            if (newColumn.name) {
                dom.setHtml(headerCell, newColumn.name);
            }
            if (newColumn.name || newColumn.title) {
                headerCell.title = newColumn.title || dom.getText(headerCell);
            }
            if (newColumn.hidden != undefined || newColumn.format) {
                for (let i = 0, row: HTMLTableRowElement; row = rows[i]; i++) {
                    const cell = row.cells[columnIndex];
                    if (cell) {
                        if (newColumn.hidden != undefined) {
                            dom.toggle(cell, "width", null, this.duration, null, !newColumn.hidden);
                        }
                        if (row !== header && newColumn.format) {
                            this.setDataOf(cell, this.getDataOf(cell, oldColumn), newColumn);
                        }
                    }
                }
            }
            if (newColumn.filter !== oldColumn.filter || newColumn.parse !== oldColumn.parse && (newColumn.filter || oldColumn.filter)) {
                needRefilter = true;
            }
            if (columnIndex === this.sortColumnIndex && (newColumn.sort !== oldColumn.sort || newColumn.parse !== oldColumn.parse)) {
                needResort = true;
            }
            headerCell.data = Object.assign(oldColumn, newColumn);
        }

        // 新增。
        for (; i < inserts.length; i++) {
            const columnIndex = index + i;
            const newColumn = Object.assign({}, inserts[i]);
            for (let i = 0, row: HTMLTableRowElement; row = rows[i]; i++) {
                const html = row.parentNode.nodeName === "THEAD" ? "<th/>" : "<td/>";
                const oldCell = <DataGridCell>row.cells[columnIndex];
                let newCell: typeof oldCell;
                if (oldCell) {
                    newCell = <DataGridCell>dom.before(oldCell, html);
                } else {
                    while (!(newCell = row.cells[columnIndex])) {
                        dom.append(row, html);
                    }
                }
                if (newColumn.hidden) {
                    dom.hide(newCell);
                }
                if (row === header) {
                    if (newColumn.name) {
                        dom.setHtml(newCell, newColumn.name);
                    }
                    if (newColumn.name || newColumn.title) {
                        newCell.title = newColumn.title || dom.getText(newCell);
                    }
                    (<DataGridHeaderCell>newCell).data = newColumn;
                } else {
                    if (newColumn.filter && newColumn.filter(this.getDataOf(newCell, newColumn), newCell) === false) {
                        dom.hide(row);
                    }
                    if (this.getEditing(newCell)) {
                        this.setEditing(newCell, true, newColumn);
                    }
                }
            }
        }

        // 删除。
        for (; i < removeCount; i++) {
            const columnIndex = index + i;
            for (let i = 0, row: HTMLTableRowElement; row = rows[i]; i++) {
                dom.remove(row.cells[columnIndex]);
            }
            if (this.getColumn(columnIndex).filter) {
                needRefilter = true;
            }
        }

        // 重新过滤。
        if (needRefilter) {
            for (let i = 0, row: HTMLTableRowElement; row = rows[i]; i++) {
                if (row !== header) {
                    let show = true;
                    for (let i = 0, cell: HTMLTableCellElement; cell = row.cells[i]; i++) {
                        const column = this.getColumn(i);
                        if (column.filter && column.filter(this.getDataOf(cell, column), cell) === false) {
                            show = false;
                            break;
                        }
                    }
                    this.toggleRow(row, show);
                }
            }
        }

        // 重新排序。
        if (needResort) {
            this.sortByColumn(this.sortColumnIndex, this.sortDesc);
        }

        this.emit("columnchange", removeCount, inserts);
    }

    // #endregion

    // #region 主体数据

    /**
     * 获取主体部分。
     */
    get body() { return dom.first(this.elem, "tbody"); }

    /**
     * 获取总行数。
     */
    get rowCount() { return this.rows.length; }

    /**
     * 获取所有行。
     */
    get rows() { return dom.query<HTMLTableRowElement>(">tr", this.body); }

    /**
     * 设置所有行。
     */
    set rows(value) {
        Array.prototype.forEach.call(this.rows, dom.remove);
        if (value) {
            Array.prototype.forEach.call(value, row => dom.append(this.body, row));
        }
    }

    /**
     * 获取指定行的数据。
     * @param index 相关的行号。
     * @return 返回行数据。如果列不存在则返回 undefined。
     */
    getRow<T>(index: number) {
        const row = this.rows[index];
        if (row) {
            const result = [];
            for (let i = 0, cell: DataGridCell; cell = row.cells[i]; i++) {
                result.push(this.getDataOf(cell));
            }
            return result;
        }
    }

    /**
     * 设置指定列的信息。
     * @param index 相关的列号。如果列超出索引则自动追加。
     * @param value 相关的列信息。设置为 null 表示删除。
     */
    setRow(index: number, value: any[]) {
        this.spliceRow(index, 1, value);
    }

    /**
     * 插入一个列。
     * @param index 插入的列号。
     * @param value 相关的列信息。
     */
    insertRow(index: number, value?: any[]) {
        this.spliceRow(index, 0, value || []);
        return this.rows[index];
    }

    /**
     * 在末尾添加一个列。
     * @param value 相关的列信息。
     * @return 返回新增的行号。
     */
    addRow(value?: any[]) {
        return this.insertRow(this.rowCount, value);
    }

    /**
     * 移除指定的列。
     * @param index 移除的列号。
     * @return 返回删除的行。
     */
    removeRow(index: number) {
        const row = this.rows[index];
        this.spliceRow(index, 1);
        return row;
    }

    /**
     * 新增或删除行。
     * @param index 新增或删除的位置。
     * @param removeCount 删除的行数。
     * @param inserts 插入的行。
     */
    spliceRow(index: number, removeCount: number, ...inserts: any[][]) {
        console.assert(index >= 0 && index <= this.rowCount);
        console.assert(removeCount >= 0 && removeCount <= this.rowCount);
        const rows = this.rows;
        const columnCount = this.columnCount;
        for (let i = 0; i < inserts.length; i++) {
            const refRow = rows[index + i];
            const row = refRow ? dom.before(refRow, "<tr/>") : dom.append(this.body, "<tr/>");
            for (let j = 0; j < columnCount; j++) {
                const cell = <DataGridCell>dom.append(row, "<td/>");
                if (j < inserts[i].length) {
                    this.setDataOf(cell, inserts[i][j]);
                }
            }
        }
        while (removeCount-- > 0) {
            dom.remove(rows[index + removeCount]);
        }
        this.emit("rowchange", index, removeCount, inserts);
    }

    /**
     * 切换是否显示或隐藏行。
     * @param row 相关的行号。
     * @param value 是否隐藏。
     */
    toggleRow(row: HTMLTableRowElement | number, value?: boolean) {
        if (typeof row === "number") row = this.rows[row];
        dom.toggle(row, "height", null, this.duration, null, value);
        for (let i = 0, cell: HTMLTableCellElement; cell = row.cells[i]; i++) {
            dom.toggle(cell, "height", null, this.duration, null, value);
        }
    }

    /**
     * 显示行。
     * @param row 相关的行号。
     * @param value 是否隐藏。
     */
    showRow(row: HTMLTableRowElement | number, value?: boolean) {
        this.toggleRow(row, true);
    }

    /**
     * 隐藏行。
     * @param row 相关的行号。
     * @param value 是否隐藏。
     */
    hideRow(row: HTMLTableRowElement | number, value?: boolean) {
        this.toggleRow(row, false);
    }

    /**
     * 设置当前表格的数据源。
     */
    get data() {
        const result: any[][] = [];
        const rowCount = this.rowCount;
        for (let i = 0; i < rowCount; i++) {
            result.push(this.getRow(i));
        }
        return result;
    }

    /**
     * 设置当前表格的数据源。
     */
    set data(value) {
        this.spliceRow(0, this.rowCount, ...(value || []));
    }

    /**
     * 获取指定单元格的数据。
     * @param row 相关的行号。
     * @param column 相关的列号。
     * @return 返回绑定的值。如果单元格不存在则返回 undefined。
     */
    getData(row: number, column: number) {
        const rowElem = this.rows[row];
        const cell = rowElem && rowElem.cells[column];
        return cell && this.getDataOf(cell);
    }

    /**
     * 获取指定单元格的数据。如果单元格不存在则自动插入。
     * @param row 相关的行号。
     * @param column 相关的列号。
     * @param value 要设置的值。
     */
    setData(row: number, column: number, value: any) {
        console.assert(row >= 0 && row < this.rowCount);
        console.assert(column >= 0 && column < this.rows[row].cells.length);
        this.setDataOf(this.rows[row].cells[column], value);
    }

    /**
     * 获取指定单元格的数据。
     * @param cell 相关的单元格。
     * @param column 使用的列信息。
     * @return 返回绑定的值。
     */
    getDataOf(cell: DataGridCell, column?: ColumnInfo<any>) {
        if (cell.editor) {
            return cell.editor.value;
        }
        if (column === undefined) column = this.getColumn(cell.cellIndex);
        const html = dom.getHtml(cell);
        return column && column.parse ? column.parse(html, cell) : html;
    }

    /**
     * 设置指定单元格的数据。
     * @param cell 相关的单元格。
     * @param value 相关的数据。
     * @param column 使用的列信息。
     */
    setDataOf(cell: DataGridCell, value: any, column?: ColumnInfo<any>) {
        if (cell.editor) {
            cell.editor.value = value;
            return;
        }
        if (column === undefined) column = this.getColumn(cell.cellIndex);
        if (column && column.format) {
            value = column.format(value, cell);
        }
        if (value !== undefined) {
            dom.setHtml(cell, value);
        }
    }

    // #endregion

    // #region 排序

    /**
     * 获取当前是否允许排序。
     */
    sortable: boolean;

    /**
     * 获取当前排序的列。
     */
    get sortColumn() { return dom.find<HTMLTableCellElement>(">.x-table-sort", this.header); }

    /**
     * 获取当前排序的列号。
     */
    get sortColumnIndex() {
        const sortColumn = this.sortColumn;
        return sortColumn ? sortColumn.cellIndex : -1;
    }

    /**
     * 设置当前排序的列号。
     */
    set sortColumnIndex(value) {
        console.assert(value >= 0 && value < this.columnCount);
        if (this.sortable === false) {
            return;
        }
        const column = this.getColumn(value);
        if (column && column.sortable === false) {
            return;
        }
        const sortColumn = this.sortColumn;
        if (sortColumn) {
            dom.removeClass(sortColumn, "x-table-sort-desc");
            dom.removeClass(sortColumn, "x-table-sort");
        }
        dom.addClass(this.header.cells[value], "x-table-sort");
        this.sortByColumn(value, false);
    }

    /**
     * 获取当前是否倒序。
     */
    get sortDesc() {
        const sortColumn = this.sortColumn;
        return sortColumn && dom.match(sortColumn, ".x-table-sort-desc");
    }

    /**
     * 设置当前是否倒序。
     */
    set sortDesc(value) {
        const sortColumn = this.sortColumn;
        if (sortColumn) {
            dom.toggleClass(sortColumn, "x-table-sort-desc", value);
            const columnIndex = dom.index(sortColumn);
            const column = this.getColumn(columnIndex);
            if (column && column.sortable === false) {
                return;
            }
            this.sortByColumn(columnIndex, value);
        }
    }

    private sortByColumn(column: number, desc: boolean) {
        const columnInfo = this.getColumn(column);
        this.sort((x, y) => {
            const cellX = x.cells[column];
            const cellY = y.cells[column];
            const dataX = this.getDataOf(cellX);
            const dataY = this.getDataOf(cellY);
            const result = columnInfo && columnInfo.sort ? columnInfo.sort(dataX, dataY, cellX, cellY) : dataX < dataY ? -1 : dataX > dataY ? 1 : 0;
            return desc ? -result : result;
        });
    }

    /**
     * 根据指定的值排序。
     * @param sorter 用于排序的函数。
     */
    sort(sorter?: (x: HTMLTableRowElement, y: HTMLTableRowElement) => number) {
        const rows = Array.prototype.slice.call(this.rows);
        rows.sort(sorter);
        this.rows = rows;
        this.emit("sort");
    }

    // #endregion

    // #region 选中模式



    // #endregion

    // #region 编辑模式

    /**
     * 获取当前是否允许编辑。
     */
    editable: boolean;

    /**
     * 判断某个单元格是否正在编辑。
     * @param cell 相关的单元格。
     */
    getEditing(cell: HTMLTableCellElement) {
        return !!(<DataGridCell>cell).editor;
    }

    /**
     * 设置某个单元格是否正在编辑。
     * @param cell 相关的单元格。
     * @param value 可编辑的状态。
     * @param column 相关的列信息。
     */
    setEditing(cell: HTMLTableCellElement, value: boolean, column?: ColumnInfo<any>) {
        if (this.editable === false || (value !== false) === this.getEditing(cell)) {
            return;
        }
        if (!column) column = this.getColumn(cell.cellIndex);
        if (column && column.editable === false) {
            return;
        }
        if (value === false) {
            dom.removeClass(cell, "x-table-edit");
            const value = (<DataGridCell>cell).editor.value;
            dom.remove((<DataGridCell>cell).editor.elem);
            delete (<DataGridCell>cell).editor;
            this.setDataOf(cell, value);
            this.emit("endedit", cell);
        } else {
            dom.addClass(cell, "x-table-edit");
            const editor = this.getEditor(cell, column);
            if (editor) {
                editor.value = this.getDataOf(cell, column);
                dom.setHtml(cell, "");
                editor.appendTo(cell);
                (<DataGridCell>cell).editor = editor;
            }
            this.emit("beginedit", cell);
        }
    }

    /**
     * 当被子类重写时负责返回指定单元格的编辑器。
     * @param cell 相关的单元格。
     * @param column 相关的列信息。
     */
    protected getEditor(cell: HTMLTableCellElement, column: ColumnInfo<any>) {
        if (column && column.editor) {
            return column.editor(cell);
        }
        return new TextBox();
    }

    // /**
    //  * 获取正在进行编辑模式的行。
    //  */
    // get editRow() {
    //     return dom.find<HTMLTableRowElement>(">.x-table-edit", this.body);
    // }

    /**
     * 进入编辑模式。
     * @param row 相关的行号。如果未提供则所有行进入编辑模式。
     * @param column 相关的列号。如果未提供则整行进入编辑模式。
     */
    beginEdit(row?: number | HTMLTableRowElement, column?: number) {
        this.toggleEdit(row, column, true);
    }

    /**
     * 退出编辑模式。
     * @param row 相关的行号。如果未提供则所有行退出编辑模式。
     * @param column 相关的列号。如果未提供则整行退出编辑模式。
     */
    endEdit(row?: number | HTMLTableRowElement, column?: number) {
        this.toggleEdit(row, column, false);
    }

    /**
     * 切换编辑模式。
     * @param row 相关的行号。如果未提供则所有行退出编辑模式。
     * @param column 相关的列号。如果未提供则整行退出编辑模式。
     * @param value 设置模式。
     */
    toggleEdit(row?: number | HTMLTableRowElement, column?: number, value?: boolean) {
        if (row === undefined) {
            dom.toggleClass(this.elem, "x-table-edit", value);
            const rowCount = this.rowCount;
            for (let i = 0; i < rowCount; i++) {
                this.toggleEdit(i, undefined, value);
            }
        } else {
            if (typeof row === "number") {
                console.assert(row >= 0 && row < this.rowCount);
                row = this.rows[row];
            }
            if (column === undefined) {
                dom.toggleClass(row, "x-table-edit", value);
                const cellCount = row.cells.length;
                for (let i = 0; i < cellCount; i++) {
                    this.toggleEdit(row, i, value);
                }
            } else {
                console.assert(column >= 0 && column < row.cells.length);
                const cell = row.cells[column];
                this.setEditing(cell, value === undefined ? !this.getEditing(cell) : value);
            }
        }
    }

    /**
     * 判断是否正在进行编辑模式。
     */
    isEditing(row?: number, column?: number) {
        if (row === undefined) return dom.match(this.elem, ".x-table-edit");
        console.assert(row >= 0 && row < this.rowCount);
        if (column === undefined) return dom.match(this.rows[row], ".x-table-edit");
        console.assert(column >= 0 && column < this.rows[row].cells.length);
        return this.getEditing(this.rows[row].cells[column]);
    }

    // #endregion

}

/**
 * 表示数据表头的一个单元格。
 */
interface DataGridHeaderCell extends HTMLTableDataCellElement, HTMLTableHeaderCellElement {

    /**
     * 当前列的数据。
     */
    data?: ColumnInfo<any>;

}

/**
 * 表示数据表的一个单元格。
 */
interface DataGridCell extends HTMLTableDataCellElement, HTMLTableHeaderCellElement {

    /**
     * 和当前单元格绑定的数据。
     */
    editor?: DataGridCellEditor;

}

/**
 * 表示一个单元格编辑器。
 */
export interface DataGridCellEditor {

    /**
     * 获取当前编辑器的值。
     */
    value: any;

    /**
     * 获取当前编辑器的元素。
     */
    elem: HTMLElement;

    /**
     * 将当前编辑器添加到指定的容器。
     */
    appendTo(parent: HTMLElement);

    /**
     * 绑定 changing 事件。
     */
    on(event: "changing", handler: Function);

}

/**
 * 表示一个列信息。
 */
export interface ColumnInfo<T> {

    /**
     * 列名。
     */
    name?: string;

    /**
     * 列标题。
     */
    title?: string;

    /**
     * 是否隐藏列。
     */
    hidden?: boolean;

    /**
     * 是否允许基于当前列排序。
     */
    sortable?: boolean;

    /**
     * 是否允许编辑当前列。
     */
    editable?: boolean;

    /**
     * 用于将字符串转为当前列的函数。
     */
    parse?: (value: string, cell: HTMLTableCellElement) => T;

    /**
     * 用于格式化当前列为字符串的函数。
     */
    format?: (value: T, cell: HTMLTableCellElement) => string;

    /**
     * 用于筛选当前列的函数。
     */
    filter?: (value: T, cell: HTMLTableCellElement) => boolean;

    /**
     * 用于排序当前列的函数。
     */
    sort?: (x: T, y: T, cellX: HTMLTableCellElement, cellY: HTMLTableCellElement) => number;

    /**
     * 当前列在编辑模式的选择器。
     */
    editor?: ((cell: HTMLTableCellElement) => DataGridCellEditor);

    /**
     * 绑定的键名。
     */
    key?: string;

}
