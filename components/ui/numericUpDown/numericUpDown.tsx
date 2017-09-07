import { Control, VNode, bind } from "control";
import "./numericUpDown.scss";

/**
 * 表示一个数字输入框。
 */
export class NumericUpDown extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-numericupdown"></div>;
    }

}

export default NumericUpDown;
/**
 * @author xuld@vip.qq.com
 */


typeof include === "function" && include("ui/suggest/updown.js");

var NumericUpDown = UpDown.extend({

    step: 1,

    onUpDown: function (delta) {
        this.elem.querySelector('input').value = (+this.elem.querySelector('input').value || 0) + delta * this.step;
    }

});