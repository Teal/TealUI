/**
 * @fileOverview 日历
 * @author xuld <xuld@vip.qq.com>
 */
import * as dom from "dom";
import Control from "control";
import "./calender.less";

/**
 * 表示一个日历。
 */
export default class Calender extends Control {

    /**
     * 获取当前控件的模板。
     */
    protected tpl = `<div class="x-calender"></div>`;

    /**
	 * 当被子类重写时，负责初始化当前控件。
	 */
    protected init() {
        
    }

}
