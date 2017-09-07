import { Control, VNode, bind } from "control";
import "./balloonTip.scss";

/**
 * 表示一个泡泡提示。
 */
export class BalloonTip extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-balloontip"></div>;
    }

}

export default BalloonTip;
// #todo

/**
 * @author xuld@vip.qq.com
 */

typeof include === "function" && include("ui/tip/balloontip.css");
typeof include === "function" && include("dom/pin.js");
typeof include === "function" && include("ui/core/containercontrol.js");
typeof include === "function" && include("ui/core/itooltip.js");

/**
 * @class
 * @extends Control
 */
var BalloonTip = ContainerControl.extend(IToolTip).implement({
	
    cssClass: 'x-balloontip'

});");");
