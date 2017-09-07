import * as dom from "ux/dom";
import { scrollIntoViewIfNeeded } from "ux/scroll";
import keyPress from "ux/keyPress";
import Control, { VNode, bind, from } from "ui/control";
import Picker from "ui/picker";
import ListBox, { ListItem } from "ui/listBox";
import "typo/icon";

/**
 * 表示一个组合框基类。
 */
export abstract class ComboBoxBase extends Picker {

    get body() {
        return this.menu.body;
    }

    menu = new ListBox();

    protected init() {
        super.init();
        dom.on(this.menu.body, "pointermove", "li", (e, item: HTMLElement) => {
            this.menu.selectedItem = from(item) as ListItem;
        });
        this.menu.onSelect = (item, e) => {
            if (!(e as any)._ignore) {
                this.handleMenuSelect(item, e);
            }
        };
        const mappings = this.menu.keyMappings();
        keyPress(this.input, {
            up: (e) => {
                if (this.dropDown.hidden) {
                    this.dropDown.show();
                } else {
                    (e as any)._ignore = true;
                    mappings.up(e);
                }
            },
            down: (e) => {
                if (this.dropDown.hidden) {
                    this.dropDown.show();
                } else {
                    (e as any)._ignore = true;
                    mappings.down(e);
                }
            },
            enter: (e) => {
                if (this.dropDown.hidden) {
                    return true;
                }
                const item = this.menu.selectedItem;
                if (item) this.menu.onSelect(item, e, this.menu);
            }
        });
    }

    /**
     * 处理项选中事件。
     */
    protected handleMenuSelect(item: ListItem, e: UIEvent) {
        this.value = item.content;
        this.dropDown.hide();
        this.onChange && this.onChange(e, this);
    }

    protected updateMenu() {
        this.menu.value = this.value;
        const item = this.menu.selectedItem;
        if (item) {
            scrollIntoViewIfNeeded(item.elem, this.menu.body, 0);
        }
    }

}

/**
 * 表示一个组合框。
 */
export default class ComboBox extends ComboBoxBase {

}
