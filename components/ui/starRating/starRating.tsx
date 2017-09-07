import { Control, VNode, bind } from "control";
import "./starRating.scss";

/**
 * 表示一个星级评分。
 */
export class StarRating extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-starrating"></div>;
    }

}

export default StarRating;
