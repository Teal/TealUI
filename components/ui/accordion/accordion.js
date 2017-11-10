var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "ui/control", "./accordion.scss"], function (require, exports, control_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个手风琴。
     */
    var Accordion = /** @class */ (function (_super) {
        __extends(Accordion, _super);
        function Accordion() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 处理面板即将折叠事件。
             * @param value 如果为 true 表示即将折叠。
             * @param sender 事件源。
             */
            _this.handlePanelBeforeCollapseChange = function (value, sender) {
                if (_this._ignoreChange) {
                    return;
                }
                if (!_this.multiply) {
                    var selectedIndex = _this.selectedIndex;
                    if (selectedIndex < 0) {
                        return;
                    }
                    if (_this.panels[selectedIndex] !== sender) {
                        _this._ignoreChange = true;
                        _this.panels[selectedIndex].toggleCollapse(true);
                        _this._ignoreChange = false;
                    }
                    else if (value) {
                        return false;
                    }
                    _this.selectedIndex = _this.panels.indexOf(sender);
                }
                _this.onCollapseChange && _this.onCollapseChange(sender, _this);
            };
            return _this;
        }
        Object.defineProperty(Accordion.prototype, "selectedIndex", {
            /**
             * 选中的索引。
             */
            get: function () { return this.panels.findIndex(function (panel) { return !panel.collapsed; }); },
            set: function (value) {
                this.panels.forEach(function (panel, index) {
                    panel.collapsed = index !== value;
                });
            },
            enumerable: true,
            configurable: true
        });
        Accordion.prototype.render = function () {
            return control_1.VNode.create("div", { class: "x-accordion" });
        };
        Object.defineProperty(Accordion.prototype, "panels", {
            /**
             * 获取所有面板。
             */
            get: function () { return this.query(">.x-panel"); },
            enumerable: true,
            configurable: true
        });
        Accordion.prototype.layout = function () {
            var _this = this;
            var selectedIndex = this.selectedIndex;
            if (selectedIndex < 0)
                selectedIndex = 0;
            this.panels.forEach(function (panel, index) {
                panel.collapsable = true;
                panel.onCollapseChange = _this.handlePanelBeforeCollapseChange;
                if (!_this.multiply) {
                    panel.collapsed = index !== selectedIndex;
                }
            });
        };
        return Accordion;
    }(control_1.default));
    exports.default = Accordion;
});
//# sourceMappingURL=accordion.js.map