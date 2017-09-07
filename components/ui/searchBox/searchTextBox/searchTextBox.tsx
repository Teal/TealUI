import { Control, VNode, bind } from "control";
import "./searchTextBox.scss";

/**
 * 表示一个搜索框。
 */
export class SearchTextBox extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-searchtextbox"></div>;
    }

}

export default SearchTextBox;
