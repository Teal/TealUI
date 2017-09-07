/**
 * @fileOverview 表格
 * @author xuld <xuld@vip.qq.com>
 */
import * as dom from "dom";
import Control from "control";
import "./table.less";

/**
 * 表示一个表格。
 */
export default class Table extends Control {

    /**
     * 获取当前控件的模板。
     */
    protected tpl = `<table class="x-table"><thead><tr/></thead><tbody/></table>`;

    /**
	 * 当被子类重写时，负责初始化当前控件。
	 */
    protected init() {
        
    }

}
