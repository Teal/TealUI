import * as dom from "web/dom";
import Control, { VNode, bind } from "ui/control";
import Picker from "ui/picker";
import ListBox, { ListItem } from "ui/listBox";
import Select from "ui/select";
import { getPinYinOfChar } from "util/pinyin";

/**
 * 表示一个选择框。
 */
export default class Suggest extends Select {

    validateEvent = "blur";

    protected init() {
        super.init();
        this.input.readOnly = false;
        dom.removeClass(this.elem, "x-picker-select");
        dom.on(this.input, "input", this.handleInput, this);
    }

    protected handleInput() {
        const value = this.input.value.trim();
        let hasItem;
        for (const item of this.menu.items) {
            const val = !!value && !this.match(value, item.content);
            if (!val) {
                hasItem = true;
            }
            item.hidden = val;
        }
        this.dropDown.toggle(hasItem);
        this.dropDown.realign();
    }

    private _cache = { __proto__: null };

    match(value: string, item: string) {
        value = value.toLowerCase();
        let c = this._cache[item];
        if (!c) {
            c = this._cache[item] = {
                lower: item.toLowerCase(),
                pinyin: item.split("").map(x => getPinYinOfChar(x).join("|") || "_").join("").toLowerCase(),
                py: item.split("").map(x => (getPinYinOfChar(x).join("|") || "_")[0]).join("").toLowerCase()
            }
        }

        if (c.lower.indexOf(value) >= 0) {
            return true;
        }

        if (c.pinyin.indexOf(value) >= 0) {
            return true;
        }

        if (c.py.indexOf(value) >= 0) {
            return true;
        }

        return false;
    }

    /**
     * 是否允许自定义项。
     */
    allowCustom: boolean;

    protected validate(value: this["value"]) {
        const b = super.validate(value);
        if (b || this.allowCustom) {
            return b;
        }
        if (this.menu.findItemByKey(value)) {
            return "";
        }
        return "请从菜单中选择项";
    }

    get body() {
        this.elem;
        return this.menu.body;
    }

    get value() {
        let c = this.input.value;
        this.menu.items.forEach(item => {
            if (item.body.textContent == this.input.value) {
                c = item.key;
            }
        });
        return c;
    }
    set value(value) {
        this.menu.value = value;
        this.input.value = this.menu.selectedItem ? this.menu.selectedItem.elem.textContent as string : value;
    }

}
