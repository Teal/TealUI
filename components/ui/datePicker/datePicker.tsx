/**
 * @fileOverview 日期选择器
 * @author xuld <xuld@vip.qq.com>
 */
import * as dom from "dom";
import Control from "control";
import "./datePicker.less";

/**
 * 表示一个日期选择器。
 */
export default class DatePicker extends Control {

    /**
     * 获取当前控件的模板。
     */
    protected tpl = `<div class="x-datepicker"></div>`;

    /**
	 * 当被子类重写时，负责初始化当前控件。
	 */
    protected init() {
        
    }

}
