import * as dom from "web/dom";
import Control, { VNode, bind } from "ui/control";
import Picker from "ui/picker";
import ListBox, { ListItem } from "ui/listBox";
import ComboBox from "ui/comboBox";

/**
 * 表示一个选择框。
 */
export default class Select extends ComboBox {

    protected init() {
        super.init();
        this.input.readOnly = true;
        dom.addClass(this.elem, "x-picker-select");
    }

    protected createDropDown() {
        const dropDown = super.createDropDown();
        dropDown.event = "click";
        return dropDown;
    }

    protected handleButtonClick() {
        // FIXME: (this.dropDown as any)._toggle 是什么?
        this.dropDown.toggle((this.dropDown as any)._toggle);
    }

    /**
     * 选中的第一项。
     */
    get selectedItem() {
        return (this as any)._selectedItem;
    }
    set selectedItem(value) {
        (this as any)._selectedItem = value;
        this.input.value = value ? value.content : "";
    }

    get value() {
        if ((this as any)._selectedItem) {
            return (this as any)._selectedItem.key;
        }
        return this.input.value;
    }
    set value(value) {
        const item = (this as any)._selectedItem = this.menu.findItemByKey(value);
        if (item) {
            value = item.content;
        }
        this.input.value = value;
    }

}
