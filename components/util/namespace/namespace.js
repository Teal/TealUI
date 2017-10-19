define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 定义一个命名空间。
     * @param namespace 要定义的命名空间，多个名称用点分隔，如 `"MyNameSpace.SubNamespace"`。
     * @return 如果命名空间已存在则直接返回，否则返回新创建的命名空间。
     * @example namespace("MyNameSpace.SubNamespace")
     */
    function namespace(namespace) {
        var parts = namespace.split(".");
        var current = (function () { return this; })();
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            current = current[part] || (current[part] = {});
        }
        return current;
    }
    exports.default = namespace;
});
//# sourceMappingURL=namespace.js.map