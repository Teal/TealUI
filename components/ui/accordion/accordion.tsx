import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import Panel from "ui/panel";
import "./accordion.scss";

/**
 * 表示一个手风琴。
 */
export default class Accordion extends Control {

    /**
     * 是否允许同时开多个面板。
     */
    multiply: boolean;

    /**
     * 切换折叠事件。
     * @param panel 当前展开的面板。
     * @param sender 事件源。
     */
    onCollapseChange: (panel: Panel, sender: this) => void;

    /**
     * 选中的索引。
     */
    get selectedIndex() { return this.panels.findIndex(panel => !panel.collapsed); }
    set selectedIndex(value) {
        this.panels.forEach((panel, index) => {
            panel.collapsed = index !== value;
        });
    }

    protected render() {
        return <div class="x-accordion"></div>;
    }

    @bind("") body: HTMLElement;

    /**
     * 获取所有面板。
     */
    get panels() { return this.query(".x-accordion>.x-panel") as Panel[]; }

    layout() {
        let selectedIndex = this.selectedIndex;
        if (selectedIndex < 0) selectedIndex = 0;
        this.panels.forEach((panel, index) => {
            panel.collapsable = true;
            panel.onCollapseChange = this.handlePanelBeforeCollapseChange;
            if (!this.multiply) {
                panel.collapsed = index !== selectedIndex;
            }
        });
    }

    /**
     * 标记是否正在处理折叠事件。
     */
    private _ignoreChange: boolean;

    /**
     * 处理面板即将折叠事件。
     * @param value 如果为 true 表示即将折叠。
     * @param sender 事件源。
     */
    protected handlePanelBeforeCollapseChange = (value: boolean, sender: Panel) => {
        if (this._ignoreChange) {
            return;
        }
        if (!this.multiply) {
            const selectedIndex = this.selectedIndex;
            if (selectedIndex < 0) {
                return;
            }
            if (this.panels[selectedIndex] !== sender) {
                this._ignoreChange = true;
                this.panels[selectedIndex].toggleCollapse(true);
                this._ignoreChange = false;
            } else if (value) {
                return false;
            }
            this.selectedIndex = this.panels.indexOf(sender);
        }
        this.onCollapseChange && this.onCollapseChange(sender, this);
    }

}
