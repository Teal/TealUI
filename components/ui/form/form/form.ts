/**
 * @fileOverview 表单
 * @author xuld <xuld@vip.qq.com>
 */
import * as dom from "dom";
import Control from "control";
import "./form.less";

/**
 * 表示一个表单。
 */
export default class Form extends Control {

    /**
     * 获取当前控件的模板。
     */
    protected tpl = `<div class="x-form"></div>`;

    /**
	 * 当被子类重写时，负责初始化当前控件。
	 */
    protected init() {
        
    }

}
