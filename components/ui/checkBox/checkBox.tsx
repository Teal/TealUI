import * as dom from "web/dom";
import Control, { VNode, bind } from "ui/control";
import Input from "ui/input";
import "typo/icon/icon.scss";
import "./checkBox.scss";

/**
 * 表示一个复选框。
 */
export default class CheckBox extends Input {

    protected render() {
        return <label class="x-checkbox">
            <input type="checkbox" class="x-checkbox-button" __control__={this as any} />
            <i class="x-icon">☐</i>
            <i class="x-icon">☑</i>
            &nbsp;
        </label>;
    }

    /**
     * 是否选中。
     */
    @bind("@input", "checked") value: boolean;

    /**
     * 默认是否选中。
     */
    @bind("@input", "defaultChecked") defaultValue: boolean;

    /**
     * 键。
     */
    @bind("@input", "value") key: string;

    /**
     * 第三状态图标。
     */
    threeStateIcon: string;

    /**
     * 是否启用第三状态。
     */
    get threeState() {
        return (this.find(".x-icon") as HTMLElement).innerHTML === this.threeStateIcon;
    }
    set threeState(value) {
        const icon = this.find(".x-icon") as HTMLElement;
        if (value) {
            this.value = false;
            (icon as any)._innerHTML = icon.innerHTML;
            icon.innerHTML = this.threeStateIcon;
            dom.on(this.input!, "change", this.offThreeState, this);
        } else {
            icon.innerHTML = (icon as any)._innerHTML;
            dom.off(this.input!, "change", this.offThreeState, this);
        }
    }

    private offThreeState() {
        this.threeState = false;
    }

}

CheckBox.prototype.threeStateIcon = "⊞";
