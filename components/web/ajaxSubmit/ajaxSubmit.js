var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "web/ajax"], function (require, exports, ajax_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 异步提交表单数据。
     * @param elem 要提交的表单元素。
     * @param success 成功回调函数。
     * @param error 错误回调函数。
     * @param options 附加的额外选项。
     * @return 返回请求对象。
     * @example ajaxSubmit(document.getElementById("form"))
     */
    function ajaxSubmit(elem, success, error, options) {
        var data = formData(elem);
        options = __assign({ type: elem.method, url: elem.action, withCredentials: true, data: data, success: success, error: error }, options);
        if (!(data instanceof FormData) && !options.contentType) {
            options.contentType = elem.enctype;
        }
        return ajax_1.default(options);
    }
    exports.default = ajaxSubmit;
    /**
     * 获取表单的数据。
     * @param formElem 表单元素。
     * @param disabled 是否包含被禁用的元素。
     * @return 返回表单数据。如果表单不包含文件域，返回 JSON 对象。否则返回 FormData 对象。
     * @example formData(document.getElementById("form"))
     */
    function formData(formElem, disabled) {
        if (disabled === void 0) { disabled = false; }
        var r = {};
        var formData;
        for (var _i = 0, _a = formElem; _i < _a.length; _i++) {
            var input = _a[_i];
            var name_1 = input.name;
            if (name_1 && (disabled || !input.disabled)) {
                switch (input.type) {
                    case "select-multiple":
                        for (var _b = 0, _c = input.options; _b < _c.length; _b++) {
                            var option = _c[_b];
                            if (option.selected) {
                                addValue(r, name_1, option.value || option.text);
                            }
                        }
                        break;
                    case "radio":
                        if (input.checked) {
                            addValue(r, name_1, input.value || "on");
                        }
                        break;
                    case "checkbox":
                        if (input.checked) {
                            addValue(r, name_1, input.value || "on");
                        }
                        break;
                    case "file":
                        formData = formData || new FormData();
                        if (input.files) {
                            for (var _d = 0, _e = input.files; _d < _e.length; _d++) {
                                var file = _e[_d];
                                formData.append(name_1, file);
                            }
                        }
                        break;
                    default:
                        addValue(r, name_1, input.value);
                        break;
                }
            }
        }
        if (formData) {
            for (var key in r) {
                var value = r[key];
                if (Array.isArray(value)) {
                    for (var _f = 0, value_1 = value; _f < value_1.length; _f++) {
                        var item = value_1[_f];
                        formData.append(key, item);
                    }
                }
                else {
                    formData.append(key, value);
                }
            }
            return formData;
        }
        return r;
    }
    exports.formData = formData;
    function addValue(r, key, value) {
        var exists = r[key];
        if (Array.isArray(exists)) {
            exists.push(value);
        }
        else if (exists != undefined) {
            r[key] = [exists, value];
        }
        else {
            r[key] = value;
        }
    }
});
//# sourceMappingURL=ajaxSubmit.js.map