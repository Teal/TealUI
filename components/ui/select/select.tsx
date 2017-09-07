import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import Picker from "ui/picker";
import ListBox, { ListItem } from "ui/listBox";
import { ComboBoxBase } from "ui/comboBox";

/**
 * 表示一个选择框。
 */
export default class Select extends ComboBoxBase {

    protected init() {
        super.init();
        this.canInput = false;
        dom.on(this.input, "click", this.dropDown.show, this.dropDown);
    }

    get value() {
        const value = this.input.value;
        const item = this.menu.findItemByContent(value);
        if (item) {
            return item.key;
        }
        return value;
    }
    set value(value) {
        const item = this.menu.selectedItem = this.menu.findItemByKey(value);
        if (item) {
            value = item.content;
        }
        this.menu.value = value;
    }

    protected handleMenuSelect(item: ListItem, e: UIEvent) {
        this.input.value = item.content;
        this.dropDown.hide();
        this.onChange && this.onChange(e, this);
    }

}
