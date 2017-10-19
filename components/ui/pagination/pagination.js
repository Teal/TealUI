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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "ui/control", "ui/listBox", "ui/comboBox", "ui/textBox", "web/pagination", "./pagination.scss"], function (require, exports, control_1, listBox_1, comboBox_1, textBox_1, pagination_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个分页。
     */
    var Pagination = /** @class */ (function (_super) {
        __extends(Pagination, _super);
        function Pagination() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 每页显示的条数。
             */
            _this.pageSize = 20;
            /**
             * 当前页码。页码从 1 开始。
             */
            _this.currentPage = 1;
            /**
             * 首尾保留的页数。
             */
            _this.minCount = 2;
            /**
             * 最多显示的页数（不含上一页和下一页）。建议设置为奇数。
             */
            _this.maxCount = 7;
            /**
             * 是否显示总条数。
             */
            _this.showTotal = true;
            /**
             * 是否显示页面大小切换器。
             */
            _this.showSizeChanger = true;
            /**
             * 页面切换器显示的页码。
             */
            _this.sizeChangerItems = [10, 20, 30];
            /**
             * 是否显示上一页。
             */
            _this.showPrevPage = true;
            /**
             * 是否显示页码。
             */
            _this.showPagination = true;
            /**
             * 是否显示下一页。
             */
            _this.showNextPage = true;
            /**
             * 是否显示快速跳转。
             */
            _this.showQuickJumper = true;
            /**
             * 处理页码点击事件。
             * @param e 相关事件参数。
             */
            _this.handleClick = function (e) {
                var page = +e.target.getAttribute("data-value");
                if (page) {
                    _this.select(page);
                }
            };
            /**
             * 处理快速跳转事件。
             * @param e 相关事件参数。
             */
            _this.handleQuickJumperClick = function (e) {
                e.preventDefault();
                var input = _this.find(".x-pagination-quickjumper");
                if (input.reportValidity().valid) {
                    _this.select(+input.value);
                }
            };
            /**
             * 处理页面改变事件。
             * @param e 相关事件参数。
             */
            _this.handleSizeChange = function (e) {
                var input = _this.find(".x-pagination-sizechanger");
                if (input.reportValidity().valid) {
                    _this.select(undefined, +input.value);
                }
            };
            return _this;
        }
        Object.defineProperty(Pagination.prototype, "pageCount", {
            /**
             * 总页数。
             */
            get: function () {
                return this.total ? Math.ceil(this.total / this.pageSize) : 1;
            },
            set: function (value) {
                this.total = this.pageSize * value;
            },
            enumerable: true,
            configurable: true
        });
        Pagination.prototype.render = function () {
            var _this = this;
            var html = "";
            var append = function (tpl, page) {
                html += tpl.replace(/{page}/g, page);
            };
            if (this.showPrevPage) {
                append(this.currentPage <= 1 ? Pagination.locale.prevDisabled : Pagination.locale.prev, this.currentPage - 1);
            }
            if (this.showPagination) {
                pagination_1.default(this.pageCount, this.currentPage, function (page, ellipsis) {
                    if (ellipsis) {
                        html += Pagination.locale.ellipsis;
                    }
                    else {
                        append(page === _this.currentPage ? Pagination.locale.itemDisabled : Pagination.locale.item, page);
                    }
                });
            }
            if (this.showNextPage) {
                append(this.currentPage >= this.pageCount ? Pagination.locale.nextDisabled : Pagination.locale.next, this.currentPage + 1);
            }
            return control_1.VNode.create("nav", { class: "x-pagination" },
                control_1.VNode.create("div", { class: "x-pagination-header" },
                    this.showSizeChanger ? ["每页条数：",
                        control_1.VNode.create(comboBox_1.default, { class: "x-pagination-sizechanger", value: this.pageSize.toString(), onChange: this.handleSizeChange, pattern: /^\d+$/, hideSuccess: true }, this.sizeChangerItems.map(function (item) { return control_1.VNode.create(listBox_1.ListItem, null, item); }))] : null,
                    this.showTotal ? " \u5171 " + (this.total || 0) + " \u6761" : ""),
                this.showQuickJumper ? control_1.VNode.create("form", { class: "x-pagination-footer", onSubmit: this.handleQuickJumperClick },
                    "\u8DF3\u81F3\uFF1A",
                    control_1.VNode.create(textBox_1.default, { type: "number", class: "x-textbox x-pagination-quickjumper", value: this.currentPage.toString(), min: 1, max: this.pageCount, validateDelay: 0, hideSuccess: true }),
                    " \u9875 \u00A0",
                    control_1.VNode.create("input", { type: "submit", class: "x-button x-page-goto-page", value: "跳转", style: "min-width: 60px;" })) : null,
                control_1.VNode.create("div", { class: "x-pagination-body", innerHTML: html, onClick: this.handleClick }));
        };
        /**
         * 切换到指定的页码和页大小。
         * @param page 页码。
         * @param pageSize 页大小。
         */
        Pagination.prototype.select = function (page, pageSize) {
            if (page === void 0) { page = this.currentPage; }
            if (pageSize === void 0) { pageSize = this.pageSize; }
            if ((!this.onSelect || this.onSelect(page, pageSize, this) !== false) && (this.currentPage !== page || this.pageSize !== pageSize)) {
                this.currentPage = page;
                this.pageSize = pageSize;
                this.onChange && this.onChange(page, pageSize, this);
            }
        };
        /**
         * 存储本地化文案配置。
         */
        Pagination.locale = {
            item: "<a href=\"javascript://\u7B2C {page} \u9875\" title=\"\u8F6C\u5230\uFF1A\u7B2C {page} \u9875\" data-value=\"{page}\">{page}</a>",
            itemDisabled: "<a class=\"x-pagination-active\">{page}</a>",
            prev: "<a href=\"javascript://\u7B2C {page} \u9875\" class=\"x-pagination-prev\" title=\"\u8F6C\u5230\uFF1A\u7B2C {page} \u9875\" data-value=\"{page}\"><i class=\"x-icon\">\u2B9C</i>\u4E0A\u4E00\u9875</a>",
            prevDisabled: "",
            next: "<a href=\"javascript://\u7B2C {page} \u9875\" class=\"x-pagination-next\" title=\"\u8F6C\u5230\uFF1A\u7B2C {page} \u9875\" data-value=\"{page}\">\u4E0B\u4E00\u9875 <i class=\"x-icon\">\u2B9E</i></a>",
            nextDisabled: "",
            ellipsis: " ... "
        };
        __decorate([
            control_1.bind
        ], Pagination.prototype, "total", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "pageSize", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "currentPage", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "minCount", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "maxCount", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "showTotal", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "showSizeChanger", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "sizeChangerItems", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "showPrevPage", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "showPagination", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "showNextPage", void 0);
        __decorate([
            control_1.bind
        ], Pagination.prototype, "showQuickJumper", void 0);
        return Pagination;
    }(control_1.default));
    exports.default = Pagination;
});
//# sourceMappingURL=pagination.js.map