import * as dom from "web/dom";
import { scrollIntoViewIfNeeded } from "web/scroll";
import keyPress, { KeyPressOptions } from "web/keyPress";
import Control, { VNode, bind, NodeLike, from } from "ui/control";
import Input from "ui/input";
import "./listBox.scss";

/**
 * 表示一个列表框基类。
 */
export class List extends Input {

    protected render() {
        return <ul class="x-listbox"></ul>;
    }

    @bind("", "class", "x-listbox-readonly") readOnly: boolean;

    @bind("", "class", "x-listbox-disabled") disabled: boolean;

    body: HTMLElement;

    /**
     * 所有项。
     */
    get items() {
        return this.query(".x-listbox>li") as any[] as ListItem[];
    }
    set items(value) {
        this.body.innerHTML = "";
        if (Array.isArray(value)) {
            for (const item of value) {
                if (item instanceof ListItem) {
                    item.renderTo(this as any);
                } else {
                    const listItem = new ListItem();
                    listItem.content = item;
                    listItem.renderTo(this as any);
                }
            }
        } else {
            for (const key in value) {
                const item = new ListItem();
                item.key = key;
                item.content = (value as any)[key];
                item.renderTo(this as any);
            }
        }
    }

    /**
     * 选中的第一项。
     */
    get selectedItem() {
        return this.find(".x-listbox>.x-listbox-selected") as ListItem | null;
    }
    set selectedItem(value) {
        const old = this.selectedItem;
        if (old) old.selected = false;
        if (value) value.selected = true;
    }

    /**
     * 选中的第一项的索引。
     */
    get selectedIndex() {
        const item = this.selectedItem;
        return item ? dom.index(item.elem) : -1;
    }
    set selectedIndex(value) {
        this.selectedItem = value >= 0 ? this.items[value] : null;
    }

    /**
     * 获取指定键对应的项。
     * @param key 相关的键。
     * @return 返回匹配的第一个项。如果不存在则返回 undefined。
     */
    findItemByKey(key: string) {
        return key == null ? null : this.items.find(x => x.key == key)!;
    }

    /**
     * 获取指定内容对应的项。
     * @param content 相关的内容。
     * @return 返回匹配的第一个项。如果不存在则返回 undefined。
     */
    findItemByContent(content: string) {
        return this.items.find(x => x.content == content) as ListItem | null;
    }

}

/**
 * 表示一个列表项。
 */
export class ListItem extends Control {

    protected render() {
        return <li><a href="javascript:;" draggable={false}></a></li>;
    }

    @bind("a") body: HTMLElement;

    /**
     * 键。
     */
    get key() {
        const key = dom.getAttr(this.elem, "data-key");
        return key != undefined ? key : this.content;
    }
    set key(value) {
        dom.setAttr(this.elem, "data-key", value);
    }

    /**
     * 内容。
     */
    @bind("@body", "textContent") content: string;

    /**
     * 是否选中。
     */
    get selected() {
        return dom.hasClass(this.elem, "x-listbox-selected");
    }
    set selected(value) {
        dom.toggleClass(this.elem, "x-listbox-selected", value);
        if (value) {
            this.elem.setAttribute("aria-selected", "true");
        } else {
            this.elem.removeAttribute("aria-selected");
        }
    }

}

/**
 * 表示一个列表框。
 */
export default class ListBox extends List {

    /**
     * 值。
     */
    get value() {
        const item = this.selectedItem;
        if (item) {
            return item.key;
        }
        return null;
    }
    set value(value) {
        this.selectedItem = this.findItemByKey(value);
    }

    protected init() {
        super.init();
        dom.on(this.body, "click", ".x-listbox>li", this.handleItemClick, this);
        keyPress(this.elem, this.keyMappings);
    }

    /**
     * 处理项点击事件。
     */
    protected handleItemClick(e: MouseEvent, item: HTMLElement) {
        if (!this.disabled && !this.readOnly) {
            this.select(item, e);
        }
    }

    /**
     * 选中项。
     * @param item 要选中的项。
     * @param e 事件参数。
     */
    select(item: NodeLike | ListItem | null, e?: UIEvent) {
        item = from(item);
        if (this.onSelect && this.onSelect(item as ListItem, e!, this) === false) {
            return;
        }
        const changed = this.selectedItem !== item;
        if (changed) {
            this.selectedItem = item as ListItem | null;
        }
        if (item) {
            scrollIntoViewIfNeeded((item as ListItem).elem, this.body, this.duration);
        }
        if (changed && this.onChange) {
            this.onChange(e!, this);
        }
    }

    /**
     * 即将选中事件。
     * @param item 要选中的项。
     * @param multiple 是否为多选模式。
     * @param e 事件参数。
     * @param sender 事件源。
     * @return 如果返回 false 则阻止选中事件。
     */
    onSelect: (item: ListItem, e: UIEvent, sender: this) => boolean | void;

    /**
     * 获取键盘绑定。
     * @return 返回各个键盘绑定对象。
     */
    get keyMappings(): KeyPressOptions {
        const upDown = (e: KeyboardEvent, delta: number) => {
            const items = this.items;
            if (items.length) {
                let index = this.selectedIndex + delta;
                if (index < 0) index += items.length;
                if (index >= items.length) index = 0;
                this.select(items[index], e);
            }
        };
        return {
            up(e: KeyboardEvent) {
                upDown(e, -1);
            },
            down(e: KeyboardEvent) {
                upDown(e, 1);
            }
        };
    }

}
