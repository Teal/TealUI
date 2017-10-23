import * as dom from "web/dom";
import keyPress, { KeyPressOptions } from "web/keyPress";
import { scrollIntoViewIfNeeded } from "web/scroll";
import Control, { VNode, bind, NodeLike, from } from "ui/control";
import Input from "ui/input";
import { List, ListItem } from "ui/listBox";

/**
 * 表示一个多选列表框。
 */
export default class MultiListBox extends List {

    /**
     * 所有选中项。
     */
    get selectedItems() {
        return this.query(".x-listbox>.x-listbox-selected") as any[] as ListItem[];
    }
    set selectedItems(value) {
        this.selectedItems.forEach(item => { item.selected = false; });
        if (value) value.forEach(item => { item.selected = true; });
    }

    /**
     * 值。
     */
    get value() {
        return this.selectedItems.map(item => item.key);
    }
    set value(value) {
        this.items.forEach(item => {
            item.selected = false;
            if (value) {
                for (const v of value) {
                    if (item.key == v) {
                        item.selected = true;
                        break;
                    }
                }
            }
        });
    }

    protected init() {
        super.init();
        dom.on(this.body, "pointerdown", ">li", this.handleItemPointerDown, this);
        keyPress(this.elem, this.keyMappings);
    }

    /**
     * 如果为 true 则仅当按下 Ctrl 时才为多选模式。否则默认为单选模式。
     */
    ctrlKey: boolean;

    /**
     * 处理项指针按下事件。
     */
    protected handleItemPointerDown(e: MouseEvent, item: Element) {
        e.preventDefault();
        if (!this.disabled && !this.readOnly) {
            dom.on(document, "pointerup", this.handlePointerUp, this);
            dom.on(this.body, "pointerenter", "li", this.handlePointerMove, this);
            item = from(item) as any;
            this.select(e.shiftKey ? this._lastClickItem : item, item, this._lastSelected = !(item as any as ListItem).selected, this._ctrlKeyPressed = !!(e.ctrlKey || e.metaKey) === !!this.ctrlKey, e);
            this._lastClickItem = item as any as ListItem;
        }
    }

    /**
     * 存储最后一次点击的项。
     */
    private _lastClickItem: ListItem;

    /**
     * 存储是否使用多选模式。
     */
    private _ctrlKeyPressed: boolean;

    /**
     * 存储最后一次选则状态。
     */
    private _lastSelected: boolean;

    /**
     * 处理指针移动事件。
     */
    protected handlePointerMove(e: MouseEvent, item: Element) {
        this.select(this._lastClickItem, item, this._lastSelected, this._ctrlKeyPressed, e);
    }

    /**
     * 处理指针松开事件。
     */
    protected handlePointerUp(e: MouseEvent) {
        dom.off(this.body, "pointerenter", "li", this.handlePointerMove, this);
        dom.off(document, "pointerup", this.handlePointerUp, this);
    }

    /**
     * 选中项。
     * @param start 选区的第一个节点。
     * @param end 选区的最后一个节点。默认同 *from*。
     * @param value 如果为 true 则表示选中，如果为 false 则表示不选中。
     * @param add 如果为 true 则合并之前选中的项，否则为替代。
     * @param e 事件参数。
     */
    select(start: ListItem | NodeLike | null, end = start, value = true, add?: boolean, e?: UIEvent) {
        const items = this.items;
        const last = from(end) as ListItem;
        let startIndex = items.indexOf(from(start) as ListItem);
        let endIndex = items.indexOf(last);
        if (startIndex > endIndex) {
            const t = startIndex;
            startIndex = endIndex;
            endIndex = t;
        }
        let changed = false;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (i >= startIndex && i <= endIndex) {
                if (!this.onSelect || this.onSelect(item, value, e!, this) !== false) {
                    if (item.selected !== value) {
                        item.selected = value;
                        changed = true;
                    }
                }
            } else if (!add && value && item.selected === value && (!this.onSelect || this.onSelect(item, !value, e!, this) !== false)) {
                item.selected = !value;
                changed = true;
            }
        }
        if (last) {
            scrollIntoViewIfNeeded(last.elem, this.body, this.duration);
        }
        if (changed && this.onChange) {
            this.onChange(e!, this);
        }
    }

    /**
     * 即将选中事件。
     * @param item 要选中的项。
     * @param value 如果为 true 则表示选中，如果为 false 则表示不选中。
     * @param e 事件参数。
     * @param sender 事件源。
     * @return 如果返回 false 则阻止选中事件。
     */
    onSelect: (item: ListItem, value: boolean, e: UIEvent, sender: this) => boolean | void;

    /**
     * 获取键盘绑定。
     * @return 返回各个键盘绑定对象。
     */
    get keyMappings(): KeyPressOptions {
        const upDown = (e: KeyboardEvent, delta: number) => {
            const items = this.items;
            const selectedItem = delta < 0 ? this.selectedItem : this.selectedItems[this.selectedItems.length - 1];
            let newSelected: ListItem;
            if (selectedItem) {
                if (!(newSelected = items[items.indexOf(selectedItem) + delta])) {
                    return true;
                }
                this.select(newSelected, undefined, !newSelected.selected, !this.ctrlKey || e.shiftKey || e.ctrlKey || e.metaKey);
            } else {
                this.select(newSelected = items[delta > 0 ? 0 : items.length - 1], undefined, undefined, undefined, e);
            }
        };
        return {
            up(e) {
                upDown(e, -1);
            },
            down(e) {
                upDown(e, 1);
            }
        };
    }

}
