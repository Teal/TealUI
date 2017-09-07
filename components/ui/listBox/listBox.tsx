import * as dom from "ux/dom";
import { scrollIntoViewIfNeeded } from "ux/scroll";
import keyPress from "ux/keyPress";
import Control, { VNode, bind, NodeLike, from } from "ui/control";
import Input from "ui/input";
import "./listBox.scss";

/**
 * 表示一个列表框基类。
 */
export abstract class ListBoxBase extends Input {

    protected render() {
        return <ul class="x-listbox"></ul>;
    }

    @bind("") body: HTMLElement;

    @bind("", "class", "x-listbox-readonly") readOnly: boolean;

    @bind("", "class", "x-listbox-disabled") disabled: boolean;

    /**
     * 所有项。
     */
    get items() {
        return this.query(".x-listbox>li") as ListItem[];
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
            for (const key in value as any) {
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
        return this.find(".x-listbox>.x-listbox-selected") as ListItem | null | undefined;
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
     * @param key 要查询的键。
     * @return 返回匹配的第一个项。如果不存在则返回 undefined。 
     */
    findItemByKey(key: string) {
        return this.items.find(x => x.key === key);
    }

    /**
     * 获取指定值对应的项。
     * @param content 要查询的键。
     * @return 返回匹配的第一个项。如果不存在则返回 undefined。 
     */
    findItemByContent(content: string) {
        return this.items.find(x => x.content === content);
    }

}

/**
 * 表示一个列表框。
 */
export default class ListBox extends ListBoxBase {

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
        this.selectedItem = this.findItemByKey(value!)!;
    }

    protected init() {
        super.init();
        dom.on(this.body, "click", "li", this.handleClick, this);
        keyPress(this.elem, this.keyMappings());
    }

    /**
     * 处理指针按下事件。
     */
    protected handleClick(e: MouseEvent, item: HTMLElement) {
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
        if (!this.onSelect || this.onSelect(item as ListItem, e!, this) !== false) {
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
    keyMappings() {
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
        return this.elem.getAttribute("data-key") || this.content;
    }
    set key(value) {
        this.elem.setAttribute("data-key", value);
    }

    /**
     * 内容。
     */
    @bind("a", "textContent") content: string;

    /**
     * 是否选中。
     */
    get selected() {
        return dom.hasClass(this.elem, "x-listbox-selected");
    }
    set selected(value) {
        dom.toggleClass(this.elem, "x-listbox-selected", value);
        this.elem.setAttribute("aria-selected", value.toString());
    }

}
