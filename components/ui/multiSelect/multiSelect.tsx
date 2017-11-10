import * as dom from "web/dom";
import Control, { VNode, bind, from } from "ui/control";
import Picker from "ui/picker";
import { ListItem } from "ui/listBox";
import MultiListBox from "ui/multiListBox";
import ComboBox from "ui/comboBox";

/**
 * 表示一个选择框。
 */
export default class MultiSelect extends ComboBox {

    menu: MultiListBox;

    protected init() {
        super.init();
        this.input.readOnly = true;
        dom.addClass(this.elem, "x-picker-select");
    }

    protected createMenu() {
        const menu = new MultiListBox();
        menu.onSelect = (item, value, e) => {
            if (this.onSelect && this.onSelect(item, e, this) === false) {
                return false;
            }
        };
        menu.onChange = (e) => {
            this.input.value = this.menu.selectedItems.map(item => item.content).join(this.seperator);
            this.onChange && this.onChange(e, this);
        };
        return menu;
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
    get selectedItems() {
        return this.menu.selectedItems;
    }
    set selectedItems(value) {
        this.menu.selectedItems = value;
    }

    /**
     * 每项之间的分隔符。
     */
    seperator = ",";

    get value() {
        return this.menu.selectedItems.map(item=>item.key);
    }
    set value(value) {
        const contents = [];
        this.menu.items.forEach(item=>{
            for(const v of value) {
                if(v == item.key) {
                    item.selected = true;
                    contents.push(item.content);
                    return;
                }
            }
            item.selected = false;
        });
        this.input.value = contents.join(this.seperator);
    }

    protected updateMenu() {
        
    }
}
