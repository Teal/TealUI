/**
 * @fileOverview 页码
 * @author xuld <xuld@vip.qq.com>
 */
import * as dom from "dom";
import Control from "control";
import "./pager.less";

/**
 * 表示一个页码。
 */
export default class Pager extends Control {

    /**
     * 获取当前控件的模板。
     */
    protected tpl = `<div class="x-pager"></div>`;

    /**
	 * 当被子类重写时，负责初始化当前控件。
	 */
    protected init() {
        
    }

}
