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
define(["require", "exports", "ui/control", "ui/popup", "./toolTip.scss"], function (require, exports, control_1, popup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个工具提示。
     */
    var ToolTip = /** @class */ (function (_super) {
        __extends(ToolTip, _super);
        function ToolTip() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ToolTip.prototype.render = function () {
            return control_1.VNode.create("div", { class: "x-tooltip", style: "display: none;" },
                control_1.VNode.create("span", { class: "x-arrow" }));
        };
        return ToolTip;
    }(popup_1.default));
    exports.default = ToolTip;
    ToolTip.prototype.event = "hover";
    ToolTip.prototype.align = "top";
    ToolTip.prototype.animation = "zoomOut";
});
//# sourceMappingURL=toolTip.js.map