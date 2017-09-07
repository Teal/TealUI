import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import "./shareTo.scss";

/**
 * 表示一个分享到。
 */
export default class ShareTo extends Control {

    protected render() {
        return <div class="x-shareto"></div>;
    }

}
