import * as dom from "web/dom";
import { scrollIntoViewIfNeeded } from "web/scroll";
import keyPress, { KeyPressOptions } from "web/keyPress";
import Control, { VNode, bind, from } from "ui/control";
import Picker from "ui/picker";
import ListBox, { ListItem, List } from "ui/listBox";
import "typo/icon";

/**
 * 表示一个组合框。
 */
export default class ComboBox extends Picker {

    menu: List;

    value: string;

    @bind("@menu", "items") items: ListBox["items"];

    private _selectedItem: ListItem | null;

    /**
     * 选中的第一项。
     */
    get selectedItem() {
        if (this._selectedItem && this._selectedItem.content === this.input.value) {
            return this._selectedItem;
        }
        return this._selectedItem = this.menu.findItemByContent(this.input.value);
    }
    set selectedItem(value) {
        this._selectedItem = value;
        this.input.value = value ? value.content : "";
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

    protected createMenu(): Control {
        const menu = new ListBox();
        dom.on(menu.body, "pointermove", "li", (e, item) => {
            this.menu.selectedItem = from(item) as ListItem;
        });
        menu.onSelect = (item, e) => {
            if (e && (e as any).__ignore__) {
                return;
            }
            this.handleMenuSelect(item, e);
        };
        return menu;
    }

    protected init() {
        super.init();
        keyPress(this.input, this.keyMappings);
    }

    get keyMappings(): KeyPressOptions {
        const mappings = (this.menu as ListBox).keyMappings;
        return {
            up: (e) => {
                if (this.dropDown.hidden) {
                    this.dropDown.show();
                } else {
                    (e as any).__ignore__ = true;
                    mappings.up!(e);
                }
            },
            down: (e) => {
                if (this.dropDown.hidden) {
                    this.dropDown.show();
                } else {
                    (e as any).__ignore__ = true;
                    mappings.down!(e);
                }
            },
            enter: (e) => {
                if (this.dropDown.hidden) {
                    return false;
                }
                const item = this.menu.selectedItem;
                if (item) (this.menu as ListBox).onSelect(item, e, this.menu as ListBox);
            },
            esc: () => {
                if (this.dropDown.hidden) {
                    return false;
                }
                this.dropDown.hide();
            }
        };
    }

    /**
     * 选中项事件。
     * @param item 当前选中的项。
     * @param e 事件参数。
     * @param sender 事件源。
     */
    onSelect: (item: ListItem, e: UIEvent, sender: this) => boolean | void;

    /**
     * 处理项选中事件。
     * @param item 当前选中的项。
     * @param e 事件参数。
     */
    protected handleMenuSelect(item: ListItem, e: UIEvent) {
        if (this.onSelect && this.onSelect(item, e, this) === false) {
            return;
        }
        this.dropDown.hide();
        if (this.selectedItem !== item) {
            this.selectedItem = item;
            this.onChange && this.onChange(e, this);
        }
    }

    protected updateMenu() {
        const item = this.menu.selectedItem = this.selectedItem;
        if (item) {
            scrollIntoViewIfNeeded(item.elem, this.menu.body, this.duration);
        }
    }

}
